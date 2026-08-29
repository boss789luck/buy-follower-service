"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false
    });

    if (res?.error) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <div>
        <input 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="ชื่อผู้ใช้" 
          className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 text-gray-900"
          required
        />
      </div>
      <div>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน" 
          className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 text-gray-900"
          required
        />
      </div>
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        เข้าสู่ระบบ
      </button>
    </form>
  );
}
