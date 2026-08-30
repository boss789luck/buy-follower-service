import { HelpCircle, FileText, AlertTriangle, Info } from "lucide-react";

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 pb-1">
          คำถามที่พบบ่อย & เงื่อนไข (FAQ)
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide">
          ข้อตกลงการใช้งานและคำศัพท์ที่ควรทราบก่อนทำการสั่งซื้อ
        </p>
      </div>

      {/* Terms of Service Section */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex items-center">
          <FileText className="w-6 h-6 text-white mr-3" />
          <h2 className="text-lg font-bold text-white tracking-wide">เงื่อนไขการให้บริการ (โปรดอ่าน!)</h2>
        </div>
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
            <p><strong>ตั้งโปรไฟล์เป็นสาธารณะ (Public):</strong> ตลอดระยะเวลาที่สั่งซื้อ ห้ามตั้งค่าบัญชีเป็นส่วนตัว (Private) เด็ดขาด หากตั้งเป็นส่วนตัวระบบจะไม่สามารถทำงานได้ และจะไม่มีการคืนเงินทุกกรณี</p>
          </div>
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
            <p><strong>ห้ามสั่งซื้อลิงก์ซ้ำ:</strong> ห้ามสั่งซื้อบริการในลิงก์เดียวกันซ้อนกัน ในขณะที่ออเดอร์เก่ายังไม่เสร็จสมบูรณ์ โปรดรอให้ออเดอร์แรกขึ้นสถานะ "เสร็จสิ้น" ก่อนสั่งเพิ่ม มิฉะนั้นยอดอาจทับซ้อนกันและไม่มีการคืนเงิน</p>
          </div>
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
            <p><strong>นโยบายการคืนเงิน:</strong> ยอดเงินที่เติมเข้าสู่ระบบแล้ว จะไม่สามารถถอนคืนเข้าบัญชีธนาคารได้ทุกกรณี เงินในระบบสามารถใช้สั่งซื้อบริการภายในเว็บเท่านั้น</p>
          </div>
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
            <p><strong>ความเร็วของบริการ:</strong> ความเร็วที่ระบุเป็นเพียงการประเมินเบื้องต้น อาจมีการล่าช้าจากเซิร์ฟเวอร์หลัก (เช่น การอัปเดตของโซเชียลมีเดีย) หากเกิน 24-48 ชั่วโมง โปรดติดต่อแอดมินเพื่อตรวจสอบ</p>
          </div>
        </div>
      </section>

      {/* Glossary Section */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-xl shadow-gray-200/40 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center">
          <Info className="w-6 h-6 text-white mr-3" />
          <h2 className="text-lg font-bold text-white tracking-wide">คำศัพท์ที่ต้องรู้ (Glossary)</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center"><span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs mr-2">[NR] / No Refill</span></h3>
            <p className="text-xs text-gray-600"><strong>ไม่มีการรับประกัน:</strong> หากยอดลดลงหลังจากทำงานเสร็จสิ้น จะไม่มีการเติมยอดให้ใหม่หรือคืนเงินใดๆ (ราคาจะถูกที่สุด)</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center"><span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs mr-2">[R30] / Refill</span></h3>
            <p className="text-xs text-gray-600"><strong>มีรับประกัน:</strong> ตัวเลข (เช่น 30) หมายถึงรับประกัน 30 วัน หากยอดลดในช่วงเวลาประกัน สามารถกดปุ่ม Refill เพื่อเติมยอดที่หายไปฟรี</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center"><span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded text-xs mr-2">Partial</span></h3>
            <p className="text-xs text-gray-600"><strong>สำเร็จบางส่วน:</strong> ยอดเข้าไม่ครบตามที่สั่ง ระบบจะคืนเงินเข้าเว็บอัตโนมัติตามสัดส่วนที่ขาดหายไป</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center"><span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-xs mr-2">Canceled</span></h3>
            <p className="text-xs text-gray-600"><strong>ถูกยกเลิก:</strong> ระบบทำงานไม่สำเร็จ อาจเกิดจากใส่ลิงก์ผิด, บัญชีตั้งเป็นส่วนตัว ระบบจะคืนเงินกลับเข้าไอดีคุณอัตโนมัติ 100%</p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white shadow-xl shadow-gray-200/40 overflow-hidden p-2">
        <div className="px-4 py-4 flex items-center mb-2">
          <HelpCircle className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-lg font-bold text-gray-800 tracking-wide">คำถามที่พบบ่อย</h2>
        </div>
        
        <div className="space-y-2 px-2 pb-4">
          <details className="group bg-white rounded-2xl border border-gray-100 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-gray-900 font-semibold">
              ออเดอร์ขึ้นสถานะ Pending (รอคิว) นานแค่ไหน?
              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 group-open:bg-blue-50 text-gray-500 group-open:text-blue-500">
                <svg className="size-5 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              โดยปกติสถานะ Pending จะใช้เวลา 0-24 ชั่วโมงในการเปลี่ยนเป็น Processing (กำลังทำงาน) หากผ่านไป 48 ชั่วโมงแล้วสถานะยังไม่เปลี่ยน โปรดแจ้งหมายเลขออเดอร์ให้แอดมินทราบครับ
            </div>
          </details>

          <details className="group bg-white rounded-2xl border border-gray-100 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-gray-900 font-semibold">
              สามารถเติมเงินผ่านช่องทางไหนได้บ้าง?
              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 group-open:bg-blue-50 text-gray-500 group-open:text-blue-500">
                <svg className="size-5 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              ปัจจุบันระบบรองรับการโอนผ่านธนาคาร (แสกน QR Code), ทรูมันนี่วอลเล็ท (TrueMoney Wallet) ยอดเงินจะเข้าสู่ระบบแบบอัตโนมัติภายใน 1-3 นาทีครับ
            </div>
          </details>
          
          <details className="group bg-white rounded-2xl border border-gray-100 shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-4 text-gray-900 font-semibold">
              หากต้องการยอดฟอลหลักล้าน ทำได้หรือไม่?
              <span className="shrink-0 rounded-full bg-gray-50 p-1.5 group-open:bg-blue-50 text-gray-500 group-open:text-blue-500">
                <svg className="size-5 transition duration-300 group-open:-rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </summary>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              ทำได้ครับ แต่ระบบจะมีขีดจำกัดสูงสุดต่อ 1 บริการ (Max) หากต้องการสั่งเกินกว่า Max แนะนำให้สั่งจนครบ Max ก่อน แล้วรอจนสถานะ "เสร็จสิ้น" ค่อยกดสั่งซื้อบริการเดิมซ้ำอีกครั้งครับ
            </div>
          </details>
        </div>
      </section>

    </div>
  );
}
