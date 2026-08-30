"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitMassOrder(text: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
  }

  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) {
    return { success: false, error: "กรุณากรอกข้อมูลออเดอร์" };
  }

  if (lines.length > 100) {
    return { success: false, error: "จำกัดการสั่งสูงสุด 100 ออเดอร์ต่อครั้ง" };
  }

  const parsedOrders = [];
  const errors = [];
  let totalCost = 0;

  // 1. Validate syntax and calculate total cost
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Format should be: serviceId|link|quantity
    const parts = line.split("|").map(p => p.trim());
    
    if (parts.length !== 3) {
      errors.push(`บรรทัดที่ ${i + 1}: รูปแบบไม่ถูกต้อง (ต้องเป็น ID|ลิงก์|จำนวน)`);
      continue;
    }

    const serviceId = parseInt(parts[0]);
    const link = parts[1];
    const quantity = parseInt(parts[2]);

    if (isNaN(serviceId) || isNaN(quantity) || quantity <= 0) {
      errors.push(`บรรทัดที่ ${i + 1}: ID หรือ จำนวน ไม่ใช่ตัวเลขที่ถูกต้อง`);
      continue;
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      errors.push(`บรรทัดที่ ${i + 1}: ไม่พบบริการ ID ${serviceId}`);
      continue;
    }

    if (quantity < service.min || quantity > service.max) {
      errors.push(`บรรทัดที่ ${i + 1}: จำนวนต้องอยู่ระหว่าง ${service.min} - ${service.max}`);
      continue;
    }

    const charge = (quantity * service.price) / 1000;
    totalCost += charge;

    parsedOrders.push({
      service,
      link,
      quantity,
      charge,
      lineIndex: i + 1
    });
  }

  if (errors.length > 0) {
    return { success: false, error: "พบข้อผิดพลาดในข้อมูลที่กรอก", details: errors };
  }

  // 2. Check Balance
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.balance < totalCost) {
    return { success: false, error: `ยอดเงินไม่พอ (ยอดรวม: ฿${totalCost.toFixed(2)}, ยอดคงเหลือ: ฿${user?.balance.toFixed(2)})` };
  }

  // 3. Deduct total cost upfront
  await prisma.user.update({
    where: { id: user.id },
    data: { balance: { decrement: totalCost } }
  });

  const successOrders = [];
  const failedOrders = [];
  let refundAmount = 0;

  // 4. Place orders externally
  for (const order of parsedOrders) {
    try {
      let providerKey = "";
      let providerUrl = "";
      
      if (order.service.provider === "ADS4U") {
        providerKey = process.env.ADS4U_API_KEY || "";
        providerUrl = process.env.ADS4U_URL || "";
      } else {
        providerKey = process.env.PROVIDER_API_KEY || "";
        providerUrl = process.env.PROVIDER_URL || "";
      }

      const params = new URLSearchParams({
        key: providerKey,
        action: "add",
        service: order.service.originalId.toString(),
        link: order.link,
        quantity: order.quantity.toString()
      });

      const providerRes = await fetch(providerUrl, {
        method: "POST",
        body: params,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const providerData = await providerRes.json();
      
      if (providerData.error) {
        throw new Error(providerData.error);
      }

      // Save to local DB
      await prisma.order.create({
        data: {
          userId: user.id,
          serviceId: order.service.id,
          link: order.link,
          quantity: order.quantity,
          charge: order.charge,
          status: "PENDING",
          providerOrderId: providerData.order ? providerData.order.toString() : null
        }
      });

      successOrders.push(order.lineIndex);

    } catch (err: any) {
      console.error("Mass Order Error:", err.message);
      failedOrders.push({ line: order.lineIndex, error: err.message });
      refundAmount += order.charge; // Add back to refund pool
    }
  }

  // 5. Refund any failed orders
  if (refundAmount > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: { increment: refundAmount } }
    });
  }

  revalidatePath("/dashboard/orders");
  revalidatePath("/dashboard/mass-order");

  return { 
    success: true, 
    totalProcessed: parsedOrders.length,
    successCount: successOrders.length,
    failedCount: failedOrders.length,
    refundAmount,
    failedDetails: failedOrders
  };
}
