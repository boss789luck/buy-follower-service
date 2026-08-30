import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { 
  LayoutDashboard, Users, ShoppingCart, Settings, 
  ArrowLeft, BellRing, Wallet, Activity
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Basic admin check (Assuming testuser can access for now in this demo, but in real life check role)
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#0f1115] text-gray-200 font-sans">
      {/* Sidebar - Dark Admin Theme */}
      <aside className="w-72 bg-[#1a1d24] border-r border-gray-800 flex flex-col shadow-2xl">
        <div className="p-8 flex items-center justify-center border-b border-gray-800">
          <div className="text-2xl font-black tracking-tighter flex items-baseline">
            <span className="text-white">NS</span>
            <span className="text-gray-500">Admin</span>
            <span className="text-red-500 ml-1">🔥</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">การจัดการหลัก</p>
          
          <Link href="/admin" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-300 rounded-xl hover:bg-[#252830] hover:text-white transition-all group">
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-400" strokeWidth={2.5} />
            ภาพรวม (Dashboard)
          </Link>
          <Link href="/admin/users" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-300 rounded-xl hover:bg-[#252830] hover:text-white transition-all group">
            <Users className="w-5 h-5 mr-3 text-gray-500 group-hover:text-indigo-400" strokeWidth={2.5} />
            จัดการลูกค้า
          </Link>
          <Link href="/admin/orders" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-300 rounded-xl hover:bg-[#252830] hover:text-white transition-all group">
            <ShoppingCart className="w-5 h-5 mr-3 text-gray-500 group-hover:text-emerald-400" strokeWidth={2.5} />
            ออเดอร์ทั้งหมด
          </Link>
          <Link href="/admin/settings" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-300 rounded-xl hover:bg-[#252830] hover:text-white transition-all group">
            <Settings className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-300" strokeWidth={2.5} />
            ตั้งค่าระบบ
          </Link>

          <div className="mt-8 mb-3">
            <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">การเงิน</p>
          </div>
          <Link href="/admin/payments" className="flex items-center px-4 py-3 text-sm font-semibold text-gray-300 rounded-xl hover:bg-[#252830] hover:text-white transition-all group">
            <Wallet className="w-5 h-5 mr-3 text-gray-500 group-hover:text-purple-400" strokeWidth={2.5} />
            แจ้งยอดโอน (รอดำเนินการ)
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Link href="/dashboard" className="flex items-center justify-center w-full py-3 text-sm font-bold text-gray-400 bg-[#252830] rounded-xl hover:bg-gray-700 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้าลูกค้า
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-[#1a1d24] border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" /> NSPanelTHAI - System Center
          </h2>
          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-[#252830] rounded-full flex items-center justify-center text-gray-400 hover:text-white">
              <BellRing className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 bg-[#252830] px-4 py-2 rounded-full border border-gray-700">
              <div className="w-6 h-6 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">A</div>
              <span className="text-sm font-bold text-white">Administrator</span>
            </div>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
