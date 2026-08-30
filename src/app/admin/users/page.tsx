import { prisma } from "@/lib/prisma";
import UsersTable from "./UsersTable";
import { Users as UsersIcon } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
          <UsersIcon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">จัดการลูกค้า (Users)</h1>
          <p className="text-gray-400 mt-1">ดูรายชื่อลูกค้า ค้นหา และปรับลดยอดเงินในกระเป๋า</p>
        </div>
      </div>

      <UsersTable initialUsers={users} />
    </div>
  );
}
