import { prisma } from "@/lib/prisma";
import OrderForm from "../components/OrderForm";

export default async function DashboardPage() {
  const services = await prisma.service.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 pb-1">
          เพิ่มยอดของคุณ
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide">
          เลือกระบบเป้าหมาย ใช้งานง่าย ลื่นไหลใน 3 ขั้นตอน
        </p>
      </div>
      
      <OrderForm services={services} />
    </div>
  );
}
