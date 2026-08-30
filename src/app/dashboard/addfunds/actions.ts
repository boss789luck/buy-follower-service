"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

export async function submitDeposit(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const amount = formData.get("amount");
  const file = formData.get("slip") as File;

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return { success: false, error: "กรุณาระบุจำนวนเงินให้ถูกต้อง" };
  }

  if (!file || file.size === 0) {
    return { success: false, error: "กรุณาแนบรูปสลิปโอนเงิน" };
  }

  // Create unique filename
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${session.user.id}_${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/slips");
  const filepath = path.join(uploadDir, filename);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

// Write file
  fs.writeFileSync(filepath, buffer);

  const slipUrl = `/uploads/slips/${filename}`;

  // Create DB record
  await prisma.deposit.create({
    data: {
      userId: session.user.id,
      amount: Number(amount),
      slipUrl: slipUrl,
      status: "PENDING"
    }
  });

  revalidatePath("/dashboard/addfunds");
  return { success: true };
}

export async function createGatewayTransaction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const amount = formData.get("amount");

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return { success: false, error: "กรุณาระบุจำนวนเงินให้ถูกต้อง" };
  }

  // Create a pending gateway transaction (In real life, this generates a payment link)
  await prisma.deposit.create({
    data: {
      userId: session.user.id,
      amount: Number(amount),
      slipUrl: "GATEWAY_MOCK", 
      status: "PENDING" // This would be automatically changed to APPROVED by a webhook in production
    }
  });

  revalidatePath("/dashboard/addfunds");
  revalidatePath("/admin/payments");
  return { success: true };
}
