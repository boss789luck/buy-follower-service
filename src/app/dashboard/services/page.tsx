import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 pb-1">
          บริการทั้งหมด
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide">
          อัปเดตราคาล่าสุดจากระบบอัตโนมัติ
        </p>
      </div>

      <ServicesClient services={services} />
    </div>
  );
}
