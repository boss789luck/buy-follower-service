"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserBalance(userId: string, amount: number, type: "set" | "add" | "deduct") {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found" };

  let newBalance = user.balance;
  if (type === "set") newBalance = amount;
  if (type === "add") newBalance += amount;
  if (type === "deduct") newBalance = Math.max(0, newBalance - amount); // prevent negative

  await prisma.user.update({
    where: { id: userId },
    data: { balance: newBalance }
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  
  return { success: true, newBalance };
}
