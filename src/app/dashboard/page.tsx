import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import OrderForm from "../components/OrderForm";
import { Wallet, User, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const services = await prisma.service.findMany({
    orderBy: { id: 'asc' }
  });

  let userBalance = 0;
  if (session?.user?.id) {
    const u = await prisma.user.findUnique({ where: { id: session.user.id }});
    if (u) userBalance = u.balance;
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Balance Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 relative overflow-hidden flex items-center justify-between group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-200 transition-colors" />
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase mb-1">ยอดเงินคงเหลือ</p>
            <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">฿{userBalance.toFixed(2)}</h2>
          </div>
          <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-[#00a5e3] to-[#0070c0] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Wallet className="w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>

        {/* Username Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 relative overflow-hidden flex items-center justify-between group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-200 transition-colors" />
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase mb-1">ชื่อผู้ใช้งาน</p>
            <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{session?.user?.name || "User"}</h2>
          </div>
          <div className="relative z-10 w-16 h-16 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
            <User className="w-8 h-8" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Order Form) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <OrderForm services={services} />
        </div>

        {/* Right Column (Announcements) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button className="flex-1 py-4 px-4 text-sm font-black text-blue-600 border-b-2 border-blue-600 bg-white/50">ยินดีต้อนรับ</button>
              <button className="flex-1 py-4 px-4 text-sm font-bold text-gray-400 hover:bg-gray-50/50 hover:text-gray-600 transition-colors">ประกาศจากระบบ</button>
            </div>
            <div className="p-6">
              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-red-700 text-sm font-bold space-y-3 leading-relaxed shadow-sm">
                <p className="text-center text-red-600 mb-5 text-base flex justify-center items-center">
                  <span className="bg-red-100 p-2 rounded-full mr-2">⚠️</span> 
                  <span>ข้อควรระวังก่อนสั่งซื้อ</span>
                </p>
                <div className="space-y-2 text-red-600/90 text-[13px]">
                  <p>• การเพิ่มยอดบนโซเชียลทุกบริการ ยอดที่เพิ่มไปนั้นอาจลดลงได้</p>
                  <p>• หากบริการไม่มีการรับประกัน ไม่เคลมยอดหรือคืนเงินหากยอดลดลง</p>
                  <p>• ห้ามสั่งงานเดิมเข้ามาซ้ำขณะที่งานก่อนหน้ายังไม่สำเร็จ</p>
                  <p>• ย้ำ สั่งงานเดิมซ้ำขณะที่งานแรกไม่เสร็จ ได้งานไม่ครบ ไม่คืนเงิน</p>
                  <p>• กรุณาอ่านรายละเอียดบริการก่อนสั่งซื้อ</p>
                  <p>• อย่าลืมตั้งบัญชี-โพสต์ให้เป็นสาธารณะก่อนสั่งซื้อ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
