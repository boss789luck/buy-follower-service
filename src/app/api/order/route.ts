import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { serviceId, link, quantity, comments } = await req.json();

  if (!serviceId || !link || !quantity) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // 1. Get Service
  const service = await prisma.service.findUnique({ where: { id: Number(serviceId) } });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  if (quantity < service.min || quantity > service.max) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const charge = (quantity * service.price) / 1000;

  // 2. Get User & Check Balance
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.balance < charge) {
    return NextResponse.json({ error: "ยอดเงินของคุณไม่เพียงพอ กรุณาเติมเครดิต" }, { status: 400 });
  }

  try {
    // 3. Forward to Provider
    let providerKey = "";
    let providerUrl = "";
    
    if (service.provider === "ADS4U") {
      providerKey = process.env.ADS4U_API_KEY || "";
      providerUrl = process.env.ADS4U_URL || "";
    } else {
      providerKey = process.env.PROVIDER_API_KEY || "";
      providerUrl = process.env.PROVIDER_URL || "";
    }

    const payload: any = {
      key: providerKey,
      action: "add",
      service: service.originalId.toString(),
      link: link,
      quantity: quantity.toString()
    };

    // If custom comments are provided, append them
    if (comments) {
      payload.comments = comments;
    }

    const params = new URLSearchParams(payload);

    const providerRes = await fetch(providerUrl, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const providerData = await providerRes.json();
    
    let upstreamOrderId = null;
    let orderStatus = "PENDING";

    if (providerData.error) {
      console.error("Provider Error:", providerData.error);
      // We do NOT return a 500 error here. We silently fail the upstream,
      // but accept the order locally so the customer isn't confused.
      upstreamOrderId = "API_ERROR: " + providerData.error;
    } else {
      upstreamOrderId = providerData.order ? providerData.order.toString() : null;
    }

    // 4. Deduct Balance and Create Order using transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { balance: { decrement: charge } }
      });

      return await tx.order.create({
        data: {
          userId: user.id,
          serviceId: service.id,
          link,
          quantity,
          charge,
          status: orderStatus,
          providerOrderId: upstreamOrderId
        }
      });
    });

    return NextResponse.json({ success: true, order: newOrder });

  } catch (error) {
    console.error("Order Failed:", error);
    // Only return error if our LOCAL system completely crashes
    return NextResponse.json({ error: "ระบบขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง" }, { status: 500 });
  }
}
