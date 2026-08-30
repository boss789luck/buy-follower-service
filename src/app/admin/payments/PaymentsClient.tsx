"use client";

import { useState } from "react";
import { Check, X, Search, FileImage, Image as ImageIcon } from "lucide-react";
import { processDeposit } from "./actions";

type DepositType = {
  id: string;
  amount: number;
  slipUrl: string;
  status: string;
  createdAt: Date;
  user: {
    username: string;
  }
};

export default function PaymentsClient({ initialDeposits }: { initialDeposits: DepositType[] }) {
  const [deposits, setDeposits] = useState<DepositType[]>(initialDeposits);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [slipModalUrl, setSlipModalUrl] = useState<string | null>(null);

  const pendingCount = deposits.filter(d => d.status === 'PENDING').length;

  const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
    if (!confirm(`ยืนยันการ ${action === 'APPROVE' ? 'อนุมัติยอดเงิน' : 'ปฏิเสธ'} ใช่หรือไม่?`)) return;
    
    setLoadingId(id);
    const result = await processDeposit(id, action);
    
    if (result.success) {
      setDeposits(deposits.map(d => 
        d.id === id ? { ...d, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : d
      ));
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">ยอดโอนรอตรวจสอบ</h2>
          <p className="text-gray-400 text-sm mt-1">กรุณาตรวจสอบสลิปโอนเงินก่อนกดยืนยัน</p>
        </div>
        <div className="bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-500/30 text-center">
          <p className="text-amber-400 font-bold text-2xl">{pendingCount}</p>
          <p className="text-amber-500/70 text-xs uppercase tracking-wider font-bold">รอตรวจสอบ</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1f222a] text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">เวลาที่แจ้ง</th>
                <th className="px-6 py-4 font-medium">ผู้ใช้งาน</th>
                <th className="px-6 py-4 font-medium text-right">จำนวนเงิน</th>
                <th className="px-6 py-4 font-medium text-center">รูปสลิป</th>
                <th className="px-6 py-4 font-medium text-center">สถานะ</th>
                <th className="px-6 py-4 font-medium text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {deposits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    ไม่มีรายการแจ้งโอน
                  </td>
                </tr>
              ) : deposits.map(d => (
                <tr key={d.id} className="hover:bg-[#252830] transition-colors">
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(d.createdAt).toLocaleString('th-TH')}
                  </td>
                  <td className="px-6 py-4 text-white font-bold">
                    {d.user.username}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-black text-emerald-400">
                      ฿{d.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSlipModalUrl(d.slipUrl)}
                      className="inline-flex items-center justify-center p-2 bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {d.status === 'APPROVED' && <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">สำเร็จ</span>}
                    {d.status === 'REJECTED' && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">ปฏิเสธ</span>}
                    {d.status === 'PENDING' && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">รอตรวจสอบ</span>}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {d.status === 'PENDING' ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleAction(d.id, "APPROVE")}
                          disabled={loadingId === d.id}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4 mr-1" /> อนุมัติ
                        </button>
                        <button 
                          onClick={() => handleAction(d.id, "REJECT")}
                          disabled={loadingId === d.id}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg flex items-center transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4 mr-1" /> ปฏิเสธ
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Modal */}
      {slipModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSlipModalUrl(null)}>
          <div className="relative max-w-2xl w-full h-[80vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSlipModalUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={slipModalUrl} 
              alt="Slip" 
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

    </div>
  );
}
