import { prisma } from "@/lib/prisma";
import { Wallet } from "lucide-react";
import PaymentsClient from "./PaymentsClient";

export default async function AdminPaymentsPage() {
  const deposits = await prisma.deposit.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { username: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
          <Wallet className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">แจ้งยอดโอน (Payments)</h1>
          <p className="text-gray-400 mt-1">ตรวจสอบสลิปโอนเงิน และอนุมัติเครดิตเข้ากระเป๋าลูกค้า</p>
        </div>
      </div>

      <PaymentsClient initialDeposits={deposits} />
    </div>
  );
}
