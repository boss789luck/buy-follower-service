"use client";

import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, AlertCircle, Search, Info, ShieldCheck, Zap, HelpCircle } from "lucide-react";

type Service = {
  id: number;
  originalId: number;
  name: string;
  category: string;
  price: number;
  min: number;
  max: number;
};

export default function OrderForm({ services }: { services: Service[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [customComments, setCustomComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract unique categories in the exact order of PanelSocial (Do NOT sort alphabetically!)
  const categories = useMemo(() => {
    const cats: string[] = [];
    services.forEach(s => {
      const c = s.category.trim();
      if (!cats.includes(c)) cats.push(c);
    });
    return cats;
  }, [services]);

  // Set initial category if not set
  useEffect(() => {
    if (!selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Filter services based on category and search
  const filteredServices = useMemo(() => {
    let list = services;
    if (selectedCategory) {
      list = list.filter(s => s.category.trim() === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) ||
        s.id.toString() === q ||
        s.originalId.toString() === q
      );
    }
    return list;
  }, [services, selectedCategory, searchQuery]);

  // Set initial service if category changes
  useEffect(() => {
    if (filteredServices.length > 0) {
      if (!selectedServiceId || !filteredServices.find(s => s.id === selectedServiceId)) {
        setSelectedServiceId(filteredServices[0].id);
      }
    } else {
      setSelectedServiceId("");
    }
  }, [filteredServices, selectedServiceId]);

  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId);
  }, [services, selectedServiceId]);

  const isCommentService = useMemo(() => {
    if (!selectedService) return false;
    const n = selectedService.name.toLowerCase();
    const c = selectedService.category.toLowerCase();
    return n.includes('คอมเม้นต์') || n.includes('comment') || n.includes('รีวิว') || c.includes('คอมเม้นต์') || n.includes('กำหนดเอง');
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !link || !quantity) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (quantity < selectedService.min || quantity > selectedService.max) {
      setError(`จำนวนต้องอยู่ระหว่าง ${selectedService.min} ถึง ${selectedService.max.toLocaleString()}`);
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          link,
          quantity,
          comments: isCommentService ? customComments : undefined
        })
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`สั่งซื้อสำเร็จเรียบร้อย! รหัสออเดอร์: #${data.order.id.substring(0, 8)}`);
        setLink("");
        setQuantity("");
        setCustomComments("");
      }
    } catch (err) {
      setError("ระบบขัดข้อง ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = selectedService && typeof quantity === 'number' 
    ? (quantity * selectedService.price) / 1000 
    : 0;

  // Generate helper description
  const getServiceNotes = (s: Service) => {
    const isGuarantee = s.name.includes("♻️") || s.name.includes("รับประกัน") || s.name.includes("ไม่ลด");
    const isThai = s.name.includes("🇹🇭") || s.name.includes("คนไทย");
    const isFast = s.name.includes("⚡") || s.name.includes("เร็ว") || s.name.includes("ทันที");

    return {
      guarantee: isGuarantee ? "มีรับประกันยอดลดเติมฟรี (ตามเงื่อนไขเซิร์ฟเวอร์)" : "ไม่มีรับประกันยอดลด (No Refill)",
      target: isThai ? "บัญชีคนไทยแท้ มีตัวตนจริง 🇹🇭" : "บัญชีต่างชาติ ผสมทั่วโลก 🌐",
      speed: isFast ? "เริ่มงานทันที - 1 ชั่วโมง" : "เริ่มงานภายใน 0 - 24 ชั่วโมง",
      linkType: s.category.includes("โปรไฟล์") || s.name.includes("ผู้ติดตาม") || s.name.includes("เพื่อน")
        ? "ลิงก์โปรไฟล์ เช่น https://instagram.com/username หรือ https://facebook.com/username"
        : "ลิงก์โพสต์ / คลิป เช่น https://instagram.com/p/... หรือ https://tiktok.com/@user/video/..."
    };
  };

  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden transition-all">
      <div className="border-b border-gray-100 px-6 py-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h2 className="text-lg font-black text-gray-800 tracking-tight">สั่งซื้อบริการ (New Order)</h2>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200/50">
          PanelSocial 100%
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400 font-medium"
            placeholder="ค้นหาชื่อบริการ, หมวดหมู่, หรือรหัสบริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
            <span>หมวดหมู่บริการ (Category)</span>
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-semibold rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3.5 outline-none shadow-sm transition-all cursor-pointer"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat} className="py-1">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Service Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
            <span>บริการ (Service)</span>
            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded-lg">
              พบ {filteredServices.length} รายการ
            </span>
          </label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-semibold rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3.5 outline-none shadow-sm transition-all cursor-pointer"
            disabled={filteredServices.length === 0}
          >
            {filteredServices.map(s => (
              <option key={s.id} value={s.id} className="py-1">
                #{s.originalId} - {s.name} — ฿{s.price.toFixed(2)} / 1000
              </option>
            ))}
            {filteredServices.length === 0 && <option value="">ไม่มีบริการในหมวดหมู่นี้</option>}
          </select>
        </div>

        {/* Service Description Box (Like PanelSocial) */}
        {selectedService && (() => {
          const notes = getServiceNotes(selectedService);
          return (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border border-gray-200/80 rounded-2xl p-5 space-y-3 text-xs leading-relaxed shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-3">
                <span className="font-bold text-gray-800 text-sm flex items-center">
                  <Info className="w-4 h-4 mr-1.5 text-blue-600" />
                  รายละเอียดบริการ #{selectedService.originalId}
                </span>
                <span className="font-black text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                  ฿{selectedService.price.toFixed(2)} / 1,000
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-1 text-gray-600 font-medium">
                <div>
                  <span className="text-gray-400 block text-[11px]">จำนวนต่ำสุด - สูงสุด:</span>
                  <span className="font-bold text-gray-800">{selectedService.min.toLocaleString()} - {selectedService.max.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">การรับประกัน:</span>
                  <span className="font-bold text-gray-800">{notes.guarantee}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">ประเภทเป้าหมาย:</span>
                  <span className="font-bold text-gray-800">{notes.target}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[11px]">ความเร็วโดยประมาณ:</span>
                  <span className="font-bold text-gray-800">{notes.speed}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200/60 text-gray-500 space-y-1">
                <p>📌 <strong>รูปแบบลิงก์:</strong> {notes.linkType}</p>
                <p>⚠️ <strong>ข้อควรระวัง:</strong> โปรดตั้งค่าบัญชี/โพสต์เป็นสาธารณะก่อนสั่งซื้อ และห้ามสั่งงานซ้ำขณะที่งานเดิมยังไม่เสร็จ</p>
              </div>
            </div>
          );
        })()}

        {/* Link Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ลิงก์เป้าหมาย (Link)</label>
          <input 
            type="url" 
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm placeholder:text-gray-400"
            placeholder="https://..."
            required
          />
        </div>

        {/* Custom Comments Box (If applicable) */}
        {isCommentService && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center justify-between">
              <span>ข้อความคอมเมนต์ (1 บรรทัด = 1 คอมเมนต์)</span>
              {typeof quantity === 'number' && quantity > 0 && (
                <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  รวม {quantity} ข้อความ
                </span>
              )}
            </label>
            <textarea 
              value={customComments}
              onChange={(e) => {
                setCustomComments(e.target.value);
                const lines = e.target.value.split('\n').filter(l => l.trim().length > 0).length;
                setQuantity(lines || '');
              }}
              className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-2xl p-4 min-h-[140px] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm placeholder:text-gray-400 font-sans leading-relaxed"
              placeholder="ข้อความที่ 1&#10;ข้อความที่ 2&#10;ข้อความที่ 3"
              required
            />
          </div>
        )}

        {/* Quantity and Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              จำนวน (Quantity)
            </label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className={`w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm placeholder:text-gray-400 ${
                isCommentService ? 'opacity-70 bg-gray-50 cursor-not-allowed' : ''
              }`}
              placeholder={selectedService ? `ขั้นต่ำ ${selectedService.min} - สูงสุด ${selectedService.max.toLocaleString()}` : ''}
              min={selectedService?.min}
              max={selectedService?.max}
              readOnly={isCommentService}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ค่าบริการสุทธิ (Charge)</label>
            <div className="w-full bg-gray-50 border border-gray-200 text-gray-900 font-black text-lg rounded-2xl px-4 py-3 shadow-inner flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase">ยอดรวม:</span>
              <span className="text-blue-600">฿{currentPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3 pt-2">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm font-bold flex items-center shadow-sm">
              <AlertCircle className="w-5 h-5 mr-2.5 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-bold flex items-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 mr-2.5 flex-shrink-0 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || !selectedService}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-base shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span>กำลังประมวลผลคำสั่งซื้อ...</span>
            ) : (
              <span>ยืนยันการสั่งซื้อ</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
