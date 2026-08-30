"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: '/' })} 
      className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-gray-500 bg-gray-50/50 hover:bg-red-50 hover:text-red-600 border border-transparent rounded-xl transition-all"
    >
      <LogOut className="w-3.5 h-3.5 mr-2" strokeWidth={2.5} />
      ออกจากระบบ
    </button>
  );
}
