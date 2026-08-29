import Link from "next/link";
import { auth } from "@/auth";
import { LayoutDashboard, ShoppingCart, History, Wallet, User, LogOut } from "lucide-react";
import { signOut } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen bg-[#f3f5f8] font-sans relative overflow-hidden">
      {/* Ambient Background Orbs for Multi-dimensional feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] pointer-events-none animate-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none animate-blob-delayed" />
      <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-emerald-400/10 rounded-full blur-[100px] pointer-events-none animate-blob" style={{animationDelay: "4s"}} />

      {/* Sidebar - Glassmorphism & Minimal */}
      <aside className="w-72 relative z-10 m-4 mr-0 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-3xl flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 flex items-center justify-center animate-float">
          <div className="text-[28px] font-black tracking-tighter drop-shadow-sm flex items-baseline">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">NS</span>
            <span className="text-gray-800 tracking-tight">Panel</span>
            <span className="text-blue-600 tracking-tight">THAI</span>
          </div>
        </div>
        
        <nav className="flex-1 px-5 py-4 space-y-2">
          <Link href="/dashboard" className="flex items-center px-4 py-3.5 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-blue-600 hover:shadow-sm hover:shadow-blue-500/5 transition-all group">
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400 group-hover:text-blue-500 transition-colors" strokeWidth={2.5} />
            สั่งซื้อใหม่
          </Link>
          
          <Link href="/dashboard/services" className="flex items-center px-4 py-3.5 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-indigo-600 hover:shadow-sm hover:shadow-indigo-500/5 transition-all group">
            <ShoppingCart className="w-5 h-5 mr-3 text-gray-400 group-hover:text-indigo-500 transition-colors" strokeWidth={2.5} />
            บริการทั้งหมด
          </Link>

          <Link href="/dashboard/orders" className="flex items-center px-4 py-3.5 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-purple-600 hover:shadow-sm hover:shadow-purple-500/5 transition-all group">
            <History className="w-5 h-5 mr-3 text-gray-400 group-hover:text-purple-500 transition-colors" strokeWidth={2.5} />
            ประวัติออเดอร์
          </Link>
          
          <Link href="/dashboard/addfunds" className="flex items-center px-4 py-3.5 text-sm font-semibold text-gray-700 rounded-2xl hover:bg-white hover:text-emerald-600 hover:shadow-sm hover:shadow-emerald-500/5 transition-all group">
            <Wallet className="w-5 h-5 mr-3 text-gray-400 group-hover:text-emerald-500 transition-colors" strokeWidth={2.5} />
            เติมเครดิต
          </Link>
        </nav>

        {/* User Card - Sleek Floating Feel */}
        <div className="p-4 mx-5 mb-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
              {session?.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.username}</p>
              <p className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-600 font-bold tracking-wide">
                ฿{(session?.user as any)?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-gray-500 bg-gray-50/50 hover:bg-red-50 hover:text-red-600 border border-transparent rounded-xl transition-all">
              <LogOut className="w-3.5 h-3.5 mr-2" strokeWidth={2.5} />
              ออกจากระบบ
            </button>
          </form>
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
