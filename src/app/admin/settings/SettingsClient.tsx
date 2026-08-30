"use client";

import { useState } from "react";
import { Settings, RefreshCw, Save, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { updateMarkup, syncServices } from "./actions";

export default function SettingsClient({ config }: { config: any }) {
  const [markup, setMarkup] = useState<string>(((config.globalMarkup - 1) * 100).toFixed(0)); // convert 1.5 -> 50%
  const [loading, setLoading] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleSaveMarkup = async () => {
    const val = Number(markup);
    if (isNaN(val) || val < 0) {
      setMessage({ type: 'error', text: 'กรุณาระบุเปอร์เซ็นต์กำไรให้ถูกต้อง' });
      return;
    }

    setLoading(true);
    setMessage(null);
    
    // convert 50% back to 1.5
    const multiplier = 1 + (val / 100);
    
    const res = await updateMarkup(multiplier);
    if (res.success) {
      setMessage({ type: 'success', text: `อัปเดตกำไรเป็น ${val}% และปรับราคาบริการทั้งหมดเรียบร้อยแล้ว!` });
    } else {
      setMessage({ type: 'error', text: res.error || 'เกิดข้อผิดพลาด' });
    }
    setLoading(false);
  };

  const handleSync = async () => {
    if (!confirm("การดึงข้อมูลบริการใหม่จะใช้เวลาประมาณ 1-3 นาที ยืนยันหรือไม่?")) return;
    
    setSyncLoading(true);
    setMessage(null);
    
    const res = await syncServices();
    if (res.success) {
      setMessage({ type: 'success', text: res.message || 'ซิงค์ข้อมูลบริการสำเร็จ' });
    } else {
      setMessage({ type: 'error', text: res.error || 'เกิดข้อผิดพลาดในการซิงค์' });
    }
    setSyncLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {message && (
        <div className={`p-4 rounded-2xl flex items-center ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
          {message.text}
        </div>
      )}

      {/* Markup Card */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">ตั้งค่าเรทกำไร (Profit Margin)</h2>
              <p className="text-gray-400 text-sm mt-0.5">บวกกำไรเพิ่มจากต้นทุนเว็บแม่เป็นเปอร์เซ็นต์ (%)</p>
            </div>
          </div>

          <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6">
            <label className="block text-sm font-bold text-gray-400 mb-2">กำไรที่ต้องการบวกเพิ่ม (%)</label>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <input 
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(e.target.value)}
                  className="w-full bg-[#1a1d24] border border-gray-700 text-white font-black text-2xl px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">%</span>
              </div>
              <button 
                onClick={handleSaveMarkup}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center shadow-lg shadow-blue-900/20"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />} 
                {loading ? 'กำลังคำนวณ...' : 'บันทึก'}
              </button>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
              <AlertCircle className="w-4 h-4 mr-2 text-blue-400 flex-shrink-0" />
              <p>ตัวอย่าง: หากต้นทุนเว็บแม่ 10 บาท/พันวิว และตั้งกำไร 50% ราคาขายหน้าร้านจะปรับเป็น 15 บาทอัตโนมัติ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Services Card */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white flex items-center">
              <RefreshCw className="w-5 h-5 mr-2 text-emerald-400" /> อัปเดตข้อมูลบริการจากเว็บแม่
            </h2>
            <p className="text-gray-400 text-sm max-w-md">
              ดึงข้อมูลบริการใหม่ล่าสุด ปรับปรุงต้นทุนที่เปลี่ยนแปลง และคำนวณราคาขายใหม่ตามเรทกำไรที่คุณตั้งไว้
            </p>
          </div>
          
          <button 
            onClick={handleSync}
            disabled={syncLoading}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-emerald-900/20 flex-shrink-0"
          >
            {syncLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> กำลังดึงข้อมูล...</>
            ) : (
              <><RefreshCw className="w-5 h-5 mr-2" /> ดึงข้อมูลล่าสุดทันที</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
