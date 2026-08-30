"use client";

import { useState } from "react";
import { Copy, UploadCloud, CheckCircle2, AlertCircle, Loader2, Building2 } from "lucide-react";
import { submitDeposit } from "./actions";

export default function AddFundsClient({ deposits }: { deposits: any[] }) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  
  const handleCopy = () => {
    navigator.clipboard.writeText("4673075315");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await submitDeposit(formData);
    
    if (result.success) {
      setSuccess(true);
      setFileName(""); // Clear file name on success
      (e.target as HTMLFormElement).reset();
    } else {
      setError(result.error || "เกิดข้อผิดพลาดบางอย่าง");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-1">
          เติมเครดิต (Add Funds)
        </h1>
        <p className="text-gray-500 mt-1 text-sm font-medium tracking-wide">
          โอนเงินเข้าบัญชีธนาคารและแนบสลิป ยอดเงินจะเข้าสู่ระบบหลังแอดมินตรวจสอบ (1-5 นาที)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Bank Details & Upload Form */}
        <div className="space-y-6">
          
          {/* Bank Details Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-[#00a5e3] to-[#0070c0] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/30 mb-4">
                KTB
              </div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" /> ธนาคารกรุงไทย
              </h2>
              <p className="text-gray-500 text-sm mt-1 mb-6">ชื่อบัญชี: นายรัชพล ศักดิ์นุชิต</p>
              
              <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between group">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">เลขบัญชี (คลิกเพื่อคัดลอก)</p>
                  <p className="text-2xl font-black text-gray-800 tracking-widest">467-3-07531-5</p>
                </div>
                <button 
                  type="button"
                  onClick={handleCopy}
                  className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-500 hover:text-blue-600 shadow-sm border border-gray-100 group-hover:border-blue-200'}`}
                >
                  {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="w-full mt-4 bg-blue-50 text-blue-700 text-xs font-bold p-3 rounded-xl flex items-center justify-center border border-blue-100">
                ⚠️ กรุณาโอนเงินเข้าบัญชีนี้และเก็บสลิปไว้เพื่อแจ้งยอด
              </div>
            </div>
          </div>

          {/* Upload Form */}
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">แจ้งสลิปโอนเงิน</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">จำนวนเงินที่โอน (บาท)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-black text-xl">฿</span>
                  <input 
                    type="number" 
                    name="amount"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-black text-xl pl-12 pr-4 py-3.5 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">อัปโหลดสลิป (รูปภาพ)</label>
                <div className={`relative border-2 border-dashed ${fileName ? 'border-emerald-400 bg-emerald-50' : 'border-gray-300 bg-gray-50'} rounded-2xl p-6 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer group`}>
                  {fileName ? (
                    <>
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                      <p className="text-sm text-emerald-600 font-bold text-center">อัปโหลดไฟล์แล้ว: <br/><span className="text-gray-600 font-medium">{fileName}</span></p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                      <p className="text-sm text-gray-500 font-medium group-hover:text-blue-600">คลิกเพื่อเลือกไฟล์รูปภาพสลิป</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    name="slip"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFileName(e.target.files[0].name);
                      } else {
                        setFileName("");
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm font-bold p-3 rounded-xl border border-red-100 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {error}
                </div>
              )}

              {success && (
                <div className="bg-emerald-50 text-emerald-600 text-sm font-bold p-3 rounded-xl border border-emerald-100 flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" /> แจ้งโอนเงินสำเร็จ! กรุณารอแอดมินตรวจสอบสักครู่
                </div>
              )}

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex justify-center items-center"
              >
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> กำลังอัปโหลด...</> : "แจ้งโอนเงิน"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 flex flex-col h-full">
          <h2 className="text-xl font-bold text-gray-800 mb-6">ประวัติการแจ้งโอนล่าสุด</h2>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {deposits.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <p className="font-medium">ยังไม่มีประวัติการโอนเงิน</p>
              </div>
            ) : deposits.map(d => (
              <div key={d.id} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition-shadow">
                <div>
                  <p className="font-bold text-gray-800 text-lg">฿{d.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(d.createdAt).toLocaleString('th-TH')}
                  </p>
                </div>
                <div>
                  {d.status === 'APPROVED' ? (
                    <span className="inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                      สำเร็จแล้ว
                    </span>
                  ) : d.status === 'REJECTED' ? (
                    <span className="inline-flex px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                      ถูกปฏิเสธ
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
                      รอตรวจสอบ
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
