"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await auth();
  if (
    !session ||
    ((session.user as { role?: string })?.role !== "ADMIN" &&
      session.user?.name !== "admin")
  ) {
    throw new Error("Unauthorized");
  }
}

export async function updateUserBalance(
  userId: string,
  amount: number,
  type: "set" | "add" | "deduct"
) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "ไม่มีสิทธิ์ดำเนินการ" };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "ไม่พบผู้ใช้งาน" };

  let newBalance = user.balance;
  if (type === "set") newBalance = amount;
  if (type === "add") newBalance += amount;
  if (type === "deduct") newBalance = Math.max(0, newBalance - amount);

  await prisma.user.update({
    where: { id: userId },
    data: { balance: newBalance },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");

  return { success: true, newBalance };
}

export async function adminResetUserPassword(
  userId: string,
  newPassword: string
) {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: "ไม่มีสิทธิ์ดำเนินการ" };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      success: false,
      error: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร",
    };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "ไม่พบผู้ใช้งาน" };

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  revalidatePath("/admin/users");

  return { success: true };
}
