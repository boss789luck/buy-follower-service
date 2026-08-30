"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function processDeposit(depositId: string, action: "APPROVE" | "REJECT") {
  const deposit = await prisma.deposit.findUnique({
    where: { id: depositId },
    include: { user: true }
  });

  if (!deposit || deposit.status !== "PENDING") {
    return { success: false, error: "Deposit not found or already processed" };
  }

  if (action === "APPROVE") {
    // 1. Update user balance
    await prisma.user.update({
      where: { id: deposit.userId },
      data: { balance: { increment: deposit.amount } }
    });
    
    // 2. Mark deposit as approved
    await prisma.deposit.update({
      where: { id: depositId },
      data: { status: "APPROVED" }
    });
  } else {
    // Mark as rejected
    await prisma.deposit.update({
      where: { id: depositId },
      data: { status: "REJECTED" }
    });
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin");
  revalidatePath("/dashboard/addfunds");
  
  return { success: true };
}
