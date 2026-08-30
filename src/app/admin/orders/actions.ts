"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function refundOrder(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return { success: false, error: "ไม่พบออเดอร์นี้" };
    }

    if (order.status === "CANCELED" || order.status === "REFUNDED") {
      return { success: false, error: "ออเดอร์นี้ถูกยกเลิกหรือคืนเงินไปแล้ว" };
    }

    // 1. Update User Balance (Refund the charge)
    await prisma.user.update({
      where: { id: order.userId },
      data: { balance: { increment: order.charge } }
    });

    // 2. Mark Order as CANCELED
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" }
    });

    revalidatePath("/admin/orders");
    revalidatePath("/dashboard/orders");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการคืนเงิน" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status }
    });
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function syncAllOrdersStatus() {
  try {
    const activeOrders = await prisma.order.findMany({
      where: {
        status: { in: ["PENDING", "PROCESSING"] },
        providerOrderId: {
          not: null,
          notIn: [""],
        }
      },
      include: {
        service: true,
        user: true
      }
    });

    // Filter out API errors that were logged as providerOrderId
    const validOrders = activeOrders.filter(o => o.providerOrderId && !o.providerOrderId.startsWith("API_ERROR"));

    if (validOrders.length === 0) {
      return { success: true, message: "ไม่มีออเดอร์ที่ต้องอัปเดต" };
    }

    const ads4uOrders = validOrders.filter(o => o.service.provider === "ADS4U");
    const panelSocialOrders = validOrders.filter(o => o.service.provider === "PANELSOCIAL");

    let updatedCount = 0;

    // --- Helper function to sync a batch of orders for a provider ---
    const syncBatch = async (orders: typeof validOrders, url: string, key: string) => {
      if (!orders.length || !url || !key) return;
      
      const orderIds = orders.map(o => o.providerOrderId).join(',');
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ key: key, action: "status", orders: orderIds })
      });
      
      const data = await res.json();
      if (data.error) {
        console.error("Sync Orders API Error:", data.error);
        return;
      }

      for (const order of orders) {
        if (!order.providerOrderId) continue;
        const apiStatusObj = data[order.providerOrderId];
        if (!apiStatusObj) continue;
        
        const apiStatus = (apiStatusObj.status || "").toLowerCase();
        let newLocalStatus = order.status;
        let shouldRefund = false;

        if (apiStatus === "completed") newLocalStatus = "COMPLETED";
        else if (apiStatus === "processing" || apiStatus === "in progress") newLocalStatus = "PROCESSING";
        else if (apiStatus === "pending") newLocalStatus = "PENDING";
        else if (apiStatus === "canceled" || apiStatus === "refunded") {
          newLocalStatus = "CANCELED";
          shouldRefund = true;
        }

        if (newLocalStatus !== order.status) {
          if (shouldRefund) {
            // Process Refund
            await prisma.$transaction([
              prisma.user.update({
                where: { id: order.userId },
                data: { balance: { increment: order.charge } }
              }),
              prisma.order.update({
                where: { id: order.id },
                data: { status: newLocalStatus }
              })
            ]);
          } else {
            // Just update status
            await prisma.order.update({
              where: { id: order.id },
              data: { status: newLocalStatus }
            });
          }
          updatedCount++;
        }
      }
    };

    // --- Execute syncs ---
    await syncBatch(ads4uOrders, process.env.ADS4U_URL || "", process.env.ADS4U_API_KEY || "");
    await syncBatch(panelSocialOrders, process.env.PROVIDER_URL || "", process.env.PROVIDER_API_KEY || "");

    revalidatePath("/admin/orders");
    revalidatePath("/dashboard/orders");

    return { success: true, message: `อัปเดตสถานะสำเร็จ ${updatedCount} ออเดอร์` };
  } catch (error: any) {
    return { success: false, error: error.message || "เกิดข้อผิดพลาดในการซิงค์ออเดอร์" };
  }
}
