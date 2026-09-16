"use client";

import { useState, useMemo } from "react";
import { Info, ShoppingCart, X, Search, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, Layers } from "lucide-react";
import Link from "next/link";

type Service = {
  id: number;
  originalId: number;
  name: string;
  category: string;
  price: number;
  min: number;
  max: number;
  provider: string;
};

export default function ServicesClient({ services }: { services: Service[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Extract unique categories preserving exact PanelSocial order
  const categories = useMemo(() => {
    const cats: string[] = [];
    services.forEach(s => {
      const c = s.category.trim();
      if (!cats.includes(c)) cats.push(c);
    });
    return cats;
  }, [services]);

  // Group services by category
  const groupedServices = useMemo(() => {
    let filtered = services;
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(s => s.category.trim() === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q) ||
        s.originalId.toString() === q ||
        s.id.toString() === q
      );
    }

    const groups: Record<string, Service[]> = {};
    filtered.forEach(s => {
      const c = s.category.trim();
      if (!groups[c]) groups[c] = [];
      groups[c].push(s);
    });
    return groups;
  }, [services, selectedCategory, search]);

  const generateDescription = (s: Service) => {
    const isGuarantee = s.name.includes("♻️") || s.name.includes("รับประกัน") || s.name.includes("ไม่ลด");
    const isThai = s.name.includes("🇹🇭") || s.name.includes("คนไทย");
    const isFast = s.name.includes("⚡") || s.name.includes("เร็ว") || s.name.includes("ทันที");

    return (
      <div className="space-y-4 text-sm text-gray-700">
        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100/80 space-y-2">
          <div className="flex justify-between items-center text-xs text-blue-900 font-bold">
            <span>รหัสบริการ: #{s.originalId}</span>
            <span className="text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">฿{s.price.toFixed(2)} / 1,000</span>
          </div>
          <p className="font-bold text-gray-900 text-sm">{s.name}</p>
        </div>

        <div className="space-y-2.5 text-xs text-gray-600 font-medium">
          <p>⚡ <strong>เวลาเริ่มงาน:</strong> {isFast ? "เริ่มงานทันที - 1 ชั่วโมง" : "เริ่มงานภายใน 0 - 24 ชั่วโมง"}</p>
          <p>🛡️ <strong>การรับประกันยอด:</strong> {isGuarantee ? "มีรับประกันยอดลดเติมฟรี (ตามเงื่อนไข)" : "ไม่มีรับประกันยอดลด (No Refill)"}</p>
          <p>👥 <strong>คุณภาพผู้ใช้งาน:</strong> {isThai ? "คนไทยแท้ มีตัวตนจริง 🇹🇭" : "บัญชีต่างชาติ ผสมทั่วโลก 🌐"}</p>
          <p>📊 <strong>ขั้นต่ำ - สูงสุด:</strong> {s.min.toLocaleString()} ถึง {s.max.toLocaleString()}</p>
        </div>

        <div className="p-4 bg-amber-50/80 border border-amber-200/70 rounded-2xl space-y-1.5 text-xs text-amber-900">
          <p className="font-bold flex items-center text-amber-800">⚠️ เงื่อนไขและข้อควรระวัง:</p>
          <p>• ตรวจสอบลิงก์ให้ถูกต้องก่อนกดสั่งซื้อ</p>
          <p>• ต้องเปิดบัญชี / โพสต์ เป็นสาธารณะเสมอ</p>
          <p>• ห้ามสั่งงานซ้ำในลิงก์เดิมขณะที่งานก่อนหน้ายังไม่เสร็จสมบูรณ์</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-5 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อบริการ, รหัสบริการ (ID)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 text-gray-900 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Category Pills (Horizontal scrollable) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ทุกหมวดหมู่ ({services.length})</span>
          </button>

          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Services List Grouped by Category */}
      <div className="space-y-6">
        {Object.keys(groupedServices).length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-12 text-center text-gray-500 space-y-2">
            <Search className="w-10 h-10 mx-auto text-gray-300" />
            <p className="font-bold text-base">ไม่พบบริการที่ค้นหา</p>
            <p className="text-xs text-gray-400">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นดูครับ</p>
          </div>
        ) : (
          Object.entries(groupedServices).map(([category, items]) => (
            <div key={category} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white overflow-hidden shadow-xl shadow-gray-200/40">
              
              {/* Category Header */}
              <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-purple-50/30 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                    {items.length}
                  </div>
                  <h3 className="text-base font-black text-gray-800 tracking-tight">{category}</h3>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-50/60 text-gray-400 text-xs font-bold uppercase border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3.5 whitespace-nowrap">ID</th>
                      <th className="px-6 py-3.5 whitespace-nowrap">บริการ (Service)</th>
                      <th className="px-6 py-3.5 whitespace-nowrap text-right">ราคา / 1,000</th>
                      <th className="px-6 py-3.5 whitespace-nowrap text-center">ขั้นต่ำ - สูงสุด</th>
                      <th className="px-6 py-3.5 whitespace-nowrap text-right">ดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-medium">
                    {items.map(s => (
                      <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                        
                        {/* ID */}
                        <td className="px-6 py-4 text-gray-500 font-mono font-bold whitespace-nowrap">
                          #{s.originalId}
                        </td>

                        {/* Name */}
                        <td className="px-6 py-4 text-gray-800 font-bold min-w-[280px] max-w-[420px]">
                          <div className="line-clamp-2 leading-relaxed group-hover:text-blue-600 transition-colors">
                            {s.name}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <span className="font-black text-blue-600 text-sm bg-blue-50 px-2.5 py-1 rounded-lg">
                            ฿{s.price.toFixed(2)}
                          </span>
                        </td>

                        {/* Min - Max */}
                        <td className="px-6 py-4 text-center whitespace-nowrap text-gray-600 font-semibold">
                          {s.min.toLocaleString()} - {s.max.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => setSelectedService(s)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all flex items-center space-x-1"
                              title="ดูรายละเอียดบริการ"
                            >
                              <Info className="w-3.5 h-3.5" />
                              <span>รายละเอียด</span>
                            </button>

                            <Link 
                              href={`/dashboard`} 
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span>สั่งซื้อ</span>
                            </Link>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Modal / Popup for Service Description */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-gray-50/50">
              <div>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  #{selectedService.originalId}
                </span>
                <h3 className="text-base font-black text-gray-900 mt-1 leading-tight">{selectedService.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedService(null)} 
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {generateDescription(selectedService)}
              
              <div className="pt-3 border-t border-gray-100">
                <Link 
                  href={`/dashboard`} 
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>ไปหน้าสั่งซื้อบริการนี้</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
