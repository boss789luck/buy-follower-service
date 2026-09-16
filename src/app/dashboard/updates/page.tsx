import { prisma } from "@/lib/prisma";
import { BellRing } from "lucide-react";
import UpdatesClient from "./UpdatesClient";

export default async function UpdatesPage() {
  const updates = await prisma.serviceUpdate.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
          <BellRing className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">อัปเดตบริการ (Service Updates)</h1>
          <p className="text-gray-500 text-sm font-medium">ติดตามการปรับเปลี่ยนราคา และบริการใหม่ล่าสุดจากเซิร์ฟเวอร์หลัก</p>
        </div>
      </div>

      <UpdatesClient updates={updates} />

    </div>
  );
}
