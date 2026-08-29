import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { service: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white p-6 rounded shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">ประวัติการสั่งซื้อ</h2>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">วันที่</th>
            <th className="px-4 py-2">บริการ</th>
            <th className="px-4 py-2">ลิงก์</th>
            <th className="px-4 py-2">ปริมาณ</th>
            <th className="px-4 py-2">ราคา</th>
            <th className="px-4 py-2">สถานะ</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                ยังไม่มีประวัติการสั่งซื้อ
              </td>
            </tr>
          )}
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="px-4 py-2 text-gray-700">{o.id.substring(0,8)}</td>
              <td className="px-4 py-2 text-gray-600">{new Date(o.createdAt).toLocaleString('th-TH')}</td>
              <td className="px-4 py-2 text-gray-800 max-w-xs truncate" title={o.service.name}>{o.service.name}</td>
              <td className="px-4 py-2"><a href={o.link} target="_blank" className="text-blue-500 hover:underline">Link</a></td>
              <td className="px-4 py-2 text-gray-600">{o.quantity}</td>
              <td className="px-4 py-2 font-semibold text-blue-600">฿{o.charge.toFixed(2)}</td>
              <td className="px-4 py-2">
                <span className={`px-2 py-1 rounded text-xs ${
                  o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                  o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  o.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {o.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
