import { prisma } from "@/lib/prisma";
import { ShoppingCart } from "lucide-react";
import AdminOrdersClient from "./OrdersClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      service: {
        select: { name: true }
      },
      user: {
        select: { username: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <ShoppingCart className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">จัดการออเดอร์ (Orders)</h1>
          <p className="text-gray-400 mt-1">ดูประวัติการสั่งซื้อทั้งหมด และจัดการคืนเงินให้ลูกค้า</p>
        </div>
      </div>

      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
