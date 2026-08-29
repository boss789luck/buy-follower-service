import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: { in: ["PENDING", "PROCESSING"] },
        providerOrderId: { not: null }
      },
      include: { service: true }
    });

    if (pendingOrders.length === 0) {
      return NextResponse.json({ message: "No pending orders to sync" });
    }

    // Group by provider
    const psOrders = pendingOrders.filter(o => o.service.provider !== "ADS4U");
    const ads4uOrders = pendingOrders.filter(o => o.service.provider === "ADS4U");
    
    let updated = 0;

    // Sync PanelSocial
    if (psOrders.length > 0) {
      const psIds = psOrders.map(o => o.providerOrderId).join(',');
      const psParams = new URLSearchParams({
        key: process.env.PROVIDER_API_KEY || "",
        action: "status",
        orders: psIds
      });
      const psRes = await fetch(process.env.PROVIDER_URL || "", {
        method: "POST", body: psParams, headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const psData = await psRes.json();
      if (!psData.error) {
        for (const [providerId, statusObj] of Object.entries(psData)) {
          if ((statusObj as any).status) {
            await prisma.order.updateMany({
              where: { providerOrderId: providerId, service: { provider: "PANELSOCIAL" } },
              data: { status: (statusObj as any).status.toUpperCase() }
            });
            updated++;
          }
        }
      }
    }

    // Sync Ads4U
    if (ads4uOrders.length > 0) {
      const ads4uIds = ads4uOrders.map(o => o.providerOrderId).join(',');
      const ads4uParams = new URLSearchParams({
        key: process.env.ADS4U_API_KEY || "",
        action: "status",
        orders: ads4uIds
      });
      const ads4uRes = await fetch(process.env.ADS4U_URL || "", {
        method: "POST", body: ads4uParams, headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });
      const ads4uData = await ads4uRes.json();
      if (!ads4uData.error) {
        for (const [providerId, statusObj] of Object.entries(ads4uData)) {
          if ((statusObj as any).status) {
            await prisma.order.updateMany({
              where: { providerOrderId: providerId, service: { provider: "ADS4U" } },
              data: { status: (statusObj as any).status.toUpperCase() }
            });
            updated++;
          }
        }
      }
    }

    return NextResponse.json({ success: true, updatedCount: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
