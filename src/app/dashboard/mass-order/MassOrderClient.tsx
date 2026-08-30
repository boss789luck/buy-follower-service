"use client";

import { useState } from "react";
import { ListPlus, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react";
import { submitMassOrder } from "./actions";

export default function MassOrderClient() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    const res = await submitMassOrder(text);
    setResult(res);
    
    if (res.success && res.failedCount === 0) {
      setText(""); // clear only if everything succeeded perfectly
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
          <ListPlus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">สั่งซื้อจำนวนมาก (Mass Order)</h1>
          <p className="text-gray-500 text-sm mt-1">ประหยัดเวลาด้วยการสั่งซื้อหลายรายการพร้อมกันในครั้งเดียว</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 relative overflow-hidden">
            
            {result && !result.success && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl mb-4">
                <div className="flex items-center text-red-600 font-bold mb-2">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {result.error}
                </div>
                {result.details && result.details.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-red-500 space-y-1 ml-1">
                    {result.details.map((err: string, i: number) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {result && result.success && (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-4">
                <div className="flex items-center text-emerald-600 font-bold mb-2">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  ทำรายการเสร็จสิ้น
                </div>
                <div className="text-sm text-emerald-700 space-y-1">
                  <p>✅ สำเร็จ: <strong>{result.successCount}</strong> รายการ</p>
                  {result.failedCount > 0 && (
                    <>
                      <p className="text-red-500">❌ ล้มเหลว: <strong>{result.failedCount}</strong> รายการ (คืนเงิน ฿{result.refundAmount.toFixed(2)})</p>
                      <ul className="list-disc list-inside text-xs text-red-400 mt-2">
                        {result.failedDetails.map((f: any, i: number) => (
                          <li key={i}>บรรทัดที่ {f.line}: {f.error}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  วางข้อมูลออเดอร์ของคุณที่นี่:
                </label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="IDบริการ | ลิงก์ | จำนวน&#10;123 | https://instagram.com/p/123 | 1000&#10;124 | https://facebook.com/photo/456 | 500"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-2xl p-4 min-h-[300px] font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all resize-y"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || text.trim().length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin mr-2" /> กำลังประมวลผล...</> : "🚀 ยืนยันการสั่งซื้อจำนวนมาก"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Instructions */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-blue-800 flex items-center mb-4">
              <Info className="w-5 h-5 mr-2" /> คำแนะนำการใช้งาน
            </h3>
            
            <div className="space-y-4 text-sm text-blue-900/80">
              <p>กรุณากรอกข้อมูลให้ตรงตามรูปแบบเป๊ะๆ โดยใช้เครื่องหมายขีดตรง <code>|</code> ในการคั่นข้อมูล</p>
              
              <div className="bg-white/60 p-3 rounded-xl border border-white">
                <p className="font-bold text-blue-900 mb-1">รูปแบบที่ถูกต้อง:</p>
                <code className="text-xs font-bold text-indigo-600">IDบริการ | ลิงก์ | จำนวน</code>
              </div>

              <div>
                <p className="font-bold text-blue-900 mb-1">ตัวอย่าง:</p>
                <div className="bg-gray-900 p-3 rounded-xl">
                  <code className="text-xs text-green-400 block">102|https://ig.com/p/1|500</code>
                  <code className="text-xs text-green-400 block mt-1">205|https://fb.com/p/2|1000</code>
                  <code className="text-xs text-green-400 block mt-1">310|https://tiktok.com/p/3|200</code>
                </div>
              </div>
              
              <ul className="list-disc list-inside space-y-1 pt-2">
                <li>สั่งได้สูงสุด 100 ออเดอร์ต่อครั้ง</li>
                <li>ID บริการ สามารถดูได้จากหน้า "บริการทั้งหมด"</li>
                <li>ระบบจะหักเงินและรันออเดอร์ทีละรายการ</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
