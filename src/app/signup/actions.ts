"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!username || !email || !password || !confirmPassword) {
    return { success: false, error: "กรุณากรอกข้อมูลให้ครบถ้วน" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "รหัสผ่านไม่ตรงกัน" };
  }

  if (password.length < 6) {
    return { success: false, error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  // Check if username or email exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: email }
      ]
    }
  });

  if (existingUser) {
    return { success: false, error: "ชื่อผู้ใช้หรืออีเมลนี้มีในระบบแล้ว" };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        balance: 0,
        role: "USER"
      }
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "เกิดข้อผิดพลาดในการสมัครสมาชิก" };
  }
}
