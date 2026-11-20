"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyUserForReset, resetUserPassword } from "./actions";
import {
  Loader2,
  ArrowLeft,
  KeyRound,
  Lock,
  Mail,
  User,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordClient() {
  const [step, setStep] = useState<"verify" | "reset" | "done">("verify");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await verifyUserForReset(username, email);
    setLoading(false);

    if (result.success) {
      setStep("reset");
    } else {
      setError(result.error || "เกิดข้อผิดพลาด");
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await resetUserPassword(
      username,
      email,
      newPassword,
      confirmPassword
    );
    setLoading(false);

    if (result.success) {
      setStep("done");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setError(result.error || "เกิดข้อผิดพลาด");
    }
  };

  if (step === "done") {
    return (
      <div className="text-center space-y-5 py-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 mx-auto bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">เปลี่ยนรหัสผ่านสำเร็จ!</h2>
          <p className="text-gray-400 text-sm mt-2">
            คุณสามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้ทันที กำลังพากลับหน้าล็อกอิน...
          </p>
        </div>
        <Link
          href="/"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-900/20"
        >
          เข้าสู่ระบบทันที
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold p-3 rounded-xl text-center">
          {error}
        </div>
      )}

      {step === "verify" ? (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมลที่ใช้สมัครสมาชิก (Email)"
              className="w-full bg-[#1f222a] border border-gray-800 text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-900/20 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <ShieldCheck className="w-5 h-5 mr-2" />
            )}
            {loading ? "กำลังตรวจสอบข้อมูล..." : "ยืนยันตัวตนเพื่อตั้งรหัสใหม่"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold p-3 rounded-xl flex items-center justify-between">
            <span>ยืนยันบัญชีสำเร็จ: {username}</span>
            <button
              type="button"
              onClick={() => {
                setStep("verify");
                setError("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="text-gray-400 hover:text-white underline text-xs"
            >
              เปลี่ยนบัญชี
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="password"
              name="newPassword"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
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
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่านใหม่อีกครั้ง"
              className="w-full bg-[#1f222a] border border-gray-800 text-white pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium placeholder-gray-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <KeyRound className="w-5 h-5 mr-2" />
            )}
            {loading ? "กำลังบันทึกรหัสผ่าน..." : "บันทึกรหัสผ่านใหม่"}
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-gray-800/80 text-center space-y-3">
        <p className="text-gray-500 text-xs">
          จำชื่อผู้ใช้หรืออีเมลไม่ได้?{" "}
          <a
            href="https://lin.ee/xz3NJOp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00B900] font-bold hover:underline inline-flex items-center"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1" />
            ติดต่อแอดมินทาง LINE
          </a>
        </p>

        <Link
          href="/"
          className="text-gray-400 hover:text-white text-sm font-bold transition-colors inline-flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </div>
    </div>
  );
}
