"use client";

import { useState } from "react";
import { AlertTriangle, ArrowRight, ShieldAlert, CheckCircle2, CheckSquare } from "lucide-react";
import { markReserveAsDone } from "./actions";

type CashFlowProps = {
  totalUserBalance: number;
  coveredBalance: number;
  ads4uRatio: number;
  panelSocialRatio: number;
};

export default function CashFlowWidget({ totalUserBalance, coveredBalance, ads4uRatio, panelSocialRatio }: CashFlowProps) {
  const [loading, setLoading] = useState(false);

  const uncoveredBalance = Math.max(0, totalUserBalance - coveredBalance);
  const reservedFundNeeded = uncoveredBalance / 2;
  
  const ads4uReserve = reservedFundNeeded * ads4uRatio;
  const panelSocialReserve = reservedFundNeeded * panelSocialRatio;

  const handleMarkAsDone = async () => {
    setLoading(true);
    await markReserveAsDone(totalUserBalance);
    setLoading(false);
  };

  if (uncoveredBalance <= 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-900/20 to-green-900/20 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CheckCircle2 className="w-48 h-48 text-emerald-500" />
        </div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50 flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-emerald-400 mb-1">✅ ยอดเงินสำรองครอบคลุมแล้ว</h2>
            <p className="text-gray-300 text-sm">
              คุณได้ทำการโอนเงินไปเว็บแม่ครอบคลุมยอดเงินของลูกค้าทั้งหมดเรียบร้อยแล้ว (อัปเดตล่าสุดที่ยอดเงินรวม ฿{coveredBalance.toLocaleString()})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <ShieldAlert className="w-48 h-48 text-red-500" />
      </div>
      
      <div className="relative z-10 flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-2">⚠️ แจ้งเตือนกระแสเงินสด (มียอดเงินใหม่เข้ามา!)</h2>
              <p className="text-gray-300 mb-6 text-sm">
                มีลูกค้าเติมเงินเข้าเว็บรวม <strong>฿{uncoveredBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> ที่คุณยังไม่ได้กระจายเงินทุนไปเว็บแม่ กรุณาโอนเงินและกดเครื่องหมายติ๊กถูกเพื่อรับทราบ
              </p>
            </div>
            
            {/* Mark as Done Button */}
            <button 
              onClick={handleMarkAsDone}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-lg shadow-lg shadow-emerald-500/20 transition-all flex items-center disabled:opacity-50"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              {loading ? "กำลังบันทึก..." : "โอนเรียบร้อยแล้ว (Mark as Done)"}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 rounded-xl p-5 border border-white/5">
              <p className="text-gray-400 text-sm font-medium mb-1">ยอดเงินฝากใหม่ (ที่ยังไม่ cover)</p>
              <p className="text-2xl font-black text-white">฿{uncoveredBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              <p className="text-[11px] text-emerald-400 mt-2">ยอดเงินฝากทั้งหมด: ฿{totalUserBalance.toLocaleString()}</p>
            </div>
            
            <div className="bg-blue-900/20 rounded-xl p-5 border border-blue-500/30 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-blue-500 font-black text-6xl">A</div>
              <p className="text-blue-300 text-sm font-medium mb-1 flex justify-between">
                ควรโอนไป Ads4U <span>{(ads4uRatio * 100).toFixed(0)}%</span>
              </p>
              <p className="text-2xl font-black text-blue-400">฿{ads4uReserve.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              <a href="https://ads4u.co/addfunds" target="_blank" className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center">
                ไปเติมเงิน Ads4U <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </div>

            <div className="bg-indigo-900/20 rounded-xl p-5 border border-indigo-500/30 relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-500 font-black text-6xl">P</div>
              <p className="text-indigo-300 text-sm font-medium mb-1 flex justify-between">
                ควรโอนไป PanelSocial <span>{(panelSocialRatio * 100).toFixed(0)}%</span>
              </p>
              <p className="text-2xl font-black text-indigo-400">฿{panelSocialReserve.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              <a href="https://panelsocial.club/addfunds" target="_blank" className="mt-3 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center">
                ไปเติมเงิน PanelSocial <ArrowRight className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
