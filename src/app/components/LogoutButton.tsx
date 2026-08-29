"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })} 
      className="block w-full text-left px-4 py-2 mt-4 rounded text-red-600 hover:bg-red-50"
    >
      ออกจากระบบ
    </button>
  );
}
