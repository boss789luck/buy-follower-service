import Link from "next/link";
import { auth } from "@/auth";
import { 
  LayoutDashboard, ShoppingCart, History, Wallet, User, LogOut,
  ListPlus, Globe, Users, Code, BellRing, HelpCircle, MessageCircle, BookOpen
} from "lucide-react";
import { signOut } from "@/auth";
import SocialProof from "../components/SocialProof";
import LogoutButton from "./components/LogoutButton";

import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Fetch real-time user data
  let realUser = null;
  if (session?.user?.id) {
    realUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true }
    });
  }

  return (
    <div className="flex h-screen bg-[#f3f5f8] font-sans relative overflow-hidden">
      <SocialProof />
      {/* Ambient Background Orbs for Multi-dimensional feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none animate-blob-delayed" />
      <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none animate-blob" style={{animationDelay: "4s"}} />

      {/* Sidebar - Glassmorphism & Minimal */}
      <aside className="w-72 relative z-10 m-4 mr-0 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 pb-4 flex items-center justify-center animate-float shrink-0">
          <div className="text-[28px] font-black tracking-tighter drop-shadow-sm flex items-baseline">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">NS</span>
            <span className="text-gray-800 tracking-tight">Panel</span>
            <span className="text-blue-600 tracking-tight">THAI</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
          <div className="space-y-6">
            
            {/* Section 1: Main */}
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">เมนูหลัก</p>
              
              <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-blue-600 hover:shadow-sm hover:shadow-blue-500/5 transition-all group">
                <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
                สั่งซื้อใหม่
              </Link>

              <Link href="/dashboard/mass-order" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-blue-600 hover:shadow-sm hover:shadow-blue-500/5 transition-all group">
                <ListPlus className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
                สั่งซื้อจำนวนมาก
              </Link>
              
              <Link href="/dashboard/services" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:shadow-indigo-500/5 transition-all group">
                <ShoppingCart className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-500 transition-colors" strokeWidth={2.5} />
                บริการทั้งหมด
              </Link>

              <Link href="/dashboard/orders" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-purple-600 hover:shadow-sm hover:shadow-purple-500/5 transition-all group">
                <History className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500 transition-colors" strokeWidth={2.5} />
                ประวัติออเดอร์
              </Link>
              
              <Link href="/dashboard/addfunds" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-emerald-600 hover:shadow-sm hover:shadow-emerald-500/5 transition-all group">
                <Wallet className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" strokeWidth={2.5} />
                เติมเครดิต
              </Link>
            </div>

            {/* Section 2: Features */}
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">สร้างรายได้ & ฟีเจอร์</p>
              
              <Link href="/dashboard/child-panel" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-amber-500 hover:shadow-sm hover:shadow-amber-500/5 transition-all group">
                <Globe className="w-5 h-5 mr-3 text-gray-400 group-hover:text-amber-500 transition-colors" strokeWidth={2.5} />
                เช่าเว็บลูก (Child Panel)
              </Link>
              
              <Link href="/dashboard/affiliate" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-pink-500 hover:shadow-sm hover:shadow-pink-500/5 transition-all group">
                <Users className="w-5 h-5 mr-3 text-gray-400 group-hover:text-pink-500 transition-colors" strokeWidth={2.5} />
                แนะนำเพื่อนรับเงิน
              </Link>

              <Link href="/dashboard/api" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-gray-900 hover:shadow-sm hover:shadow-gray-900/5 transition-all group">
                <Code className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-900 transition-colors" strokeWidth={2.5} />
                API นักพัฒนา
              </Link>
            </div>

            {/* Section 3: Support */}
            <div className="space-y-1">
              <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">ช่วยเหลือ</p>
              
              <Link href="/dashboard/updates" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-sky-500 hover:shadow-sm hover:shadow-sky-500/5 transition-all group">
                <BellRing className="w-5 h-5 mr-3 text-gray-400 group-hover:text-sky-500 transition-colors" strokeWidth={2.5} />
                อัปเดตบริการ
              </Link>

              <Link href="/dashboard/faq" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-orange-500 hover:shadow-sm hover:shadow-orange-500/5 transition-all group">
                <HelpCircle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors" strokeWidth={2.5} />
                คำถามที่พบบ่อย (FAQ)
              </Link>

              <Link href="/dashboard/guide" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-purple-500 hover:shadow-sm hover:shadow-purple-500/5 transition-all group">
                <BookOpen className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500 transition-colors" strokeWidth={2.5} />
                คู่มือสำหรับมือใหม่
              </Link>

              <a 
                href="https://lin.ee/xz3NJOp" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-[#00B900] hover:shadow-sm hover:shadow-green-500/5 transition-all group"
              >
                <MessageCircle className="w-5 h-5 mr-3 text-gray-400 group-hover:text-[#00B900] transition-colors" strokeWidth={2.5} />
                ติดต่อแอดมิน (LINE)
              </a>
            </div>

          </div>
        </div>

        {/* User Card - Sleek Floating Feel */}
        <div className="p-4 mx-5 mb-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.name}</p>
              <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 font-bold tracking-wide">
                ฿{realUser?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
