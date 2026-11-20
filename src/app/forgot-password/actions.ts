"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function verifyUserForReset(username: string, email: string) {
  const cleanUsername = username?.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanUsername || !cleanEmail) {
    return { success: false, error: "กรุณากรอกชื่อผู้ใช้และอีเมลให้ครบถ้วน" };
  }

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
  });

  if (!user) {
    return { success: false, error: "ไม่พบชื่อผู้ใช้หรืออีเมลไม่ตรงกับข้อมูลในระบบ" };
  }

  if (user.role === "ADMIN") {
    return {
      success: false,
      error: "บัญชีผู้ดูแลระบบไม่สามารถรีเซ็ตรหัสผ่านจากหน้านี้ได้",
    };
  }

  if (!user.email) {
    return {
      success: false,
      error: "บัญชีนี้ยังไม่ได้ผูกอีเมลไว้ กรุณาติดต่อแอดมินทาง LINE เพื่อตั้งรหัสผ่านใหม่",
    };
  }

  if (user.email.trim().toLowerCase() !== cleanEmail) {
    return { success: false, error: "ไม่พบชื่อผู้ใช้หรืออีเมลไม่ตรงกับข้อมูลในระบบ" };
  }

  return { success: true };
}

export async function resetUserPassword(
  username: string,
  email: string,
  newPassword: string,
  confirmPassword: string
) {
  const cleanUsername = username?.trim();
  const cleanEmail = email?.trim().toLowerCase();

  if (!cleanUsername || !cleanEmail || !newPassword || !confirmPassword) {
    return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน" };
  }

  if (newPassword.length < 6) {
    return { success: false, error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  const user = await prisma.user.findUnique({
    where: { username: cleanUsername },
  });

  if (
    !user ||
    user.role === "ADMIN" ||
    !user.email ||
    user.email.trim().toLowerCase() !== cleanEmail
  ) {
    return { success: false, error: "ข้อมูลยืนยันตัวตนไม่ถูกต้อง" };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch {
    return { success: false, error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน กรุณาลองใหม่อีกครั้ง" };
  }
}
