"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, LogIn, User, Lock } from "lucide-react";
import Link from "next/link";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="text" 
            name="username"
            required
            placeholder="ชื่อผู้ใช้ (Username)" 
            className="w-full bg-[#1f222a] border border-gray-800 text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-600"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="password" 
            name="password"
            required
            placeholder="รหัสผ่าน (Password)" 
            className="w-full bg-[#1f222a] border border-gray-800 text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-600"
          />
        </div>

        <div className="flex justify-end">
          <Link 
            href="/forgot-password" 
            className="text-xs font-semibold text-gray-400 hover:text-blue-400 transition-colors"
          >
            ลืมรหัสผ่าน?
          </Link>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center group shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <LogIn className="w-5 h-5 mr-2" />}
        {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <Link href="/signup" className="text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center group">
            สมัครสมาชิก <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
        <p className="text-gray-500 text-sm mt-4">
          <Link href="/dashboard/services" className="hover:text-white transition-colors">
            ดูรายชื่อบริการทั้งหมด (ไม่ต้องล็อกอิน)
          </Link>
        </p>
      </div>
    </form>
  );
}
