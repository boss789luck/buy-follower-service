"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "./actions";
import { Loader2, ArrowRight, UserPlus, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

export default function SignupClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.success) {
      alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      router.push("/");
    } else {
      setError(result.error || "เกิดข้อผิดพลาด");
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
            <Mail className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="email" 
            name="email"
            required
            placeholder="อีเมล (Email)" 
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

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-500" />
          </div>
          <input 
            type="password" 
            name="confirmPassword"
            required
            placeholder="ยืนยันรหัสผ่านอีกครั้ง" 
            className="w-full bg-[#1f222a] border border-gray-800 text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-600"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center group shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
        {loading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิกฟรี"}
      </button>

      <div className="text-center mt-6">
        <p className="text-gray-500 text-sm">
          มีบัญชีอยู่แล้วใช่ไหม?{" "}
          <Link href="/" className="text-blue-400 font-bold hover:text-blue-300 transition-colors inline-flex items-center group">
            เข้าสู่ระบบ <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </p>
      </div>
    </form>
  );
}
