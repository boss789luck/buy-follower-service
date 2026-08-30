import { prisma } from "@/lib/prisma";
import { Users, ShoppingCart, Wallet, ArrowRight } from "lucide-react";
import CashFlowWidget from "./CashFlowWidget";

export default async function AdminDashboardPage() {
  // Get all users
  const usersCount = await prisma.user.count();
  
  // Calculate total user balance
  const userBalanceAgg = await prisma.user.aggregate({
    _sum: { balance: true }
  });
  const totalUserBalance = userBalanceAgg._sum.balance || 0;

  // Get admin config for covered balance
  const adminConfig = await prisma.adminConfig.findUnique({
    where: { id: "default" }
  });
  const coveredBalance = adminConfig?.coveredUserBalance || 0;

  // Calculate total orders
  const ordersCount = await prisma.order.count();
  
  // Recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, service: true }
  });

  // Calculate recommendation split based on historical order data
  const allOrders = await prisma.order.findMany({
    include: { service: true }
  });

  let ads4uHistoricalVolume = 0;
  let panelSocialHistoricalVolume = 0;

  allOrders.forEach(order => {
    if (order.service.provider === 'ADS4U') ads4uHistoricalVolume += order.charge;
    if (order.service.provider === 'PANELSOCIAL') panelSocialHistoricalVolume += order.charge;
  });

  const totalHistorical = ads4uHistoricalVolume + panelSocialHistoricalVolume;
  let ads4uRatio = 0.5; // Default 50/50 if no orders yet
  let panelSocialRatio = 0.5;

  if (totalHistorical > 0) {
    ads4uRatio = ads4uHistoricalVolume / totalHistorical;
    panelSocialRatio = panelSocialHistoricalVolume / totalHistorical;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">ภาพรวมระบบ (Overview)</h1>
        <p className="text-gray-400 mt-2">รายงานสรุปข้อมูลและสถานะกระแสเงินสดของระบบ</p>
      </div>

      {/* Cash Flow Alert Widget - CRITICAL FOR ADMIN */}
      <CashFlowWidget 
        totalUserBalance={totalUserBalance}
        coveredBalance={coveredBalance}
        ads4uRatio={ads4uRatio}
        panelSocialRatio={panelSocialRatio}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-gray-400 font-medium">ลูกค้าทั้งหมด</p>
          </div>
          <p className="text-3xl font-black text-white">{usersCount.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <p className="text-gray-400 font-medium">ออเดอร์ทั้งหมด</p>
          </div>
          <p className="text-3xl font-black text-white">{ordersCount.toLocaleString()}</p>
        </div>
        
        <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
              <Wallet className="w-5 h-5" />
            </div>
            <p className="text-gray-400 font-medium">หนี้สินในระบบ (ยอดเงินลูกค้า)</p>
          </div>
          <p className="text-3xl font-black text-white">฿{totalUserBalance.toLocaleString()}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">ออเดอร์ล่าสุด 5 รายการ</h2>
          <a href="/admin/orders" className="text-sm text-blue-500 hover:text-blue-400 font-semibold">ดูทั้งหมด</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1f222a] text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">ผู้ใช้งาน</th>
                <th className="px-6 py-4 font-medium">บริการ</th>
                <th className="px-6 py-4 font-medium">จำนวน</th>
                <th className="px-6 py-4 font-medium">ราคา (฿)</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">ยังไม่มีออเดอร์</td>
                </tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#252830] transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{order.user.username}</td>
                  <td className="px-6 py-4 text-gray-300 w-1/3 truncate max-w-xs">{order.service.name}</td>
                  <td className="px-6 py-4 text-gray-300">{order.quantity}</td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">{order.charge.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                      order.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' : 
                      order.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
