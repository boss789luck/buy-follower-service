import { Wallet, MousePointerClick, Search, Link2, CheckCircle, ArrowRight } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-2">
          <span className="text-3xl">📖</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 pb-1">
          คู่มือการใช้งานสำหรับมือใหม่
        </h1>
        <p className="text-gray-500 text-sm font-medium tracking-wide max-w-xl mx-auto">
          อ่านจบ ทำเป็นทันที! สอนการใช้งานทีละขั้นตอนตั้งแต่การเติมเงินไปจนถึงการสั่งซื้อบริการให้สำเร็จแบบละเอียด
        </p>
      </div>

      <div className="space-y-8">
        
        {/* STEP 1 */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex-shrink-0 w-full md:w-1/3">
            {/* Mockup UI illustration */}
            <div className="bg-[#f3f5f8] rounded-2xl p-4 border border-gray-200 shadow-inner">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-center h-24">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">QR CODE</span>
                </div>
              </div>
              <button className="w-full mt-3 h-8 bg-emerald-500 rounded-lg opacity-50"></button>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-1">STEP 1</div>
            <h2 className="text-2xl font-black text-gray-800">เติมเครดิตเข้าระบบ</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              ก่อนเริ่มสั่งซื้อ คุณจำเป็นต้องมีเงิน (เครดิต) ในระบบก่อน 
              ให้ไปที่เมนู <strong className="text-emerald-600">"เติมเครดิต"</strong> ที่แถบด้านซ้ายมือ จากนั้น:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>ระบุจำนวนเงินที่ต้องการเติม</li>
              <li>ระบบจะสร้าง QR Code ให้คุณสแกนจ่ายผ่านแอปธนาคาร</li>
              <li>เมื่อสแกนจ่ายเสร็จ ยอดเงินจะเข้าสู่ระบบ<strong className="text-blue-600">อัตโนมัติภายใน 1 นาที</strong></li>
            </ul>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="bg-[#f3f5f8] rounded-2xl p-4 border border-gray-200 shadow-inner grid grid-cols-2 gap-2">
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-2 h-20 shadow-sm border-blue-400 ring-2 ring-blue-100">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <div className="h-2 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-2 h-20 opacity-60 grayscale">
                <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                <div className="h-2 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-2 h-20 opacity-60 grayscale">
                <div className="w-6 h-6 bg-black rounded-full"></div>
                <div className="h-2 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center space-y-2 h-20 opacity-60 grayscale">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <div className="h-2 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="inline-flex px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full mb-1">STEP 2</div>
            <h2 className="text-2xl font-black text-gray-800">เลือกแพลตฟอร์มเป้าหมาย</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              ไปที่เมนู <strong className="text-blue-600">"สั่งซื้อใหม่"</strong> จะเจอหน้าจอรวมไอคอนแอปต่างๆ (Facebook, Instagram, TikTok ฯลฯ)
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              ให้คุณ <strong className="text-gray-900 font-bold">คลิกเลือกไอคอนของแอป</strong> ที่คุณต้องการเพิ่มยอด (เช่น ถ้าต้องการปั๊มผู้ติดตามไอจี ให้กดที่ไอคอน Instagram)
            </p>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute -left-10 top-1/2 w-40 h-40 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="bg-[#f3f5f8] rounded-2xl p-4 border border-gray-200 shadow-inner space-y-3">
              <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-300" />
                <div className="h-3 w-20 bg-gray-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-200 flex justify-between items-center">
                  <div className="h-2 w-24 bg-blue-300 rounded"></div>
                  <div className="h-3 w-8 bg-emerald-400 rounded"></div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-gray-100 flex justify-between items-center opacity-60">
                  <div className="h-2 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-8 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="inline-flex px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full mb-1">STEP 3</div>
            <h2 className="text-2xl font-black text-gray-800">ค้นหาและเลือกบริการ</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              หลังจากเลือกแพลตฟอร์มแล้ว รายชื่อบริการทั้งหมดของแอปนั้นจะแสดงขึ้นมา (เช่น เพิ่มไลค์, เพิ่มผู้ติดตาม, เพิ่มวิว)
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
              <li>สามารถ <strong>พิมพ์ค้นหา</strong> ในช่องค้นหาได้เลย เช่น พิมพ์คำว่า "คนไทย"</li>
              <li>เปรียบเทียบราคาและอ่านรายละเอียด (คลิกที่ไอคอน ℹ️ เพื่อดูคำอธิบายบริการ)</li>
              <li>คลิกเลือกบริการที่ตรงกับความต้องการของคุณที่สุด</li>
            </ul>
          </div>
        </div>

        {/* STEP 4 */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row-reverse gap-8 items-center">
          <div className="absolute -right-10 top-10 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="bg-[#f3f5f8] rounded-2xl p-4 border border-gray-200 shadow-inner space-y-3">
              <div className="space-y-1">
                <div className="h-2 w-16 bg-gray-300 rounded"></div>
                <div className="bg-white rounded-lg px-3 py-2 border border-blue-400 ring-2 ring-blue-100 flex items-center space-x-2">
                  <Link2 className="w-4 h-4 text-blue-500" />
                  <div className="h-3 w-full bg-blue-100 rounded"></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="h-2 w-12 bg-gray-300 rounded"></div>
                <div className="bg-white rounded-lg px-3 py-2 border border-gray-200 flex items-center space-x-2 w-1/2">
                  <div className="h-3 w-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="inline-flex px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full mb-1">STEP 4</div>
            <h2 className="text-2xl font-black text-gray-800">ใส่ลิงก์ และ จำนวน</h2>
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl mb-2">
              <p className="text-red-600 text-xs font-bold">⚠️ สำคัญมาก: กรุณาตั้งค่าโปรไฟล์ หรือโพสต์ให้เป็น "สาธารณะ" ก่อนเสมอ!</p>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
              <li><strong>ช่อง ลิงก์ (Link):</strong> วาง URL ของโพสต์ หรือ รูปภาพ หรือ วิดีโอ หรือ Username (ขึ้นอยู่กับประเภทบริการ)
                <span className="block text-xs text-gray-400 ml-5 mt-1">เช่น บริการเพิ่มฟอลไอจี ให้ใส่ Username หรือลิงก์หน้าโปรไฟล์ไอจี</span>
              </li>
              <li><strong>ช่อง จำนวน (Quantity):</strong> พิมพ์ตัวเลขจำนวนที่ต้องการ (เช่น 1000) ระบบจะคำนวณราคาให้อัตโนมัติด้านล่าง</li>
            </ul>
          </div>
        </div>

        {/* STEP 5 */}
        <div className="relative bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 md:p-8 overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute left-1/2 top-1/2 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex-shrink-0 w-full md:w-1/3">
            <div className="bg-[#f3f5f8] rounded-2xl p-5 border border-gray-200 shadow-inner flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <button className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-90 flex items-center justify-center space-x-2">
                 <div className="h-3 w-16 bg-white/50 rounded"></div>
              </button>
            </div>
          </div>
          
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full mb-1">STEP 5</div>
            <h2 className="text-2xl font-black text-gray-800">ยืนยันและรอรับความปัง!</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              ตรวจสอบข้อมูลทั้งหมดให้ถูกต้อง จากนั้นกดปุ่ม <strong className="text-blue-600">"ยืนยันการสั่งซื้อ"</strong> 
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              เงินในระบบของคุณจะถูกหักตามราคาที่แสดง และคำสั่งซื้อจะถูกส่งไปยังเซิร์ฟเวอร์หลักทันที คุณสามารถติดตามสถานะการทำงานได้ที่เมนู <strong className="text-gray-800 font-bold">"ประวัติออเดอร์"</strong>
            </p>
            
            <div className="pt-4 flex justify-center md:justify-start">
              <a href="/dashboard" className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-gray-900/20">
                ลองสั่งซื้อเลยตอนนี้ <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
