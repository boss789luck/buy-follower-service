"use client";
import { useState, useMemo } from "react";
import { Info, ShoppingCart, X } from "lucide-react";

type Service = {
  id: number;
  name: string;
  category: string;
  price: number;
  min: number;
  max: number;
  provider: string;
};

export default function ServicesClient({ services }: { services: Service[] }) {
  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Group services by category
  const groupedServices = useMemo(() => {
    let filtered = services;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = services.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }

    const groups: Record<string, Service[]> = {};
    filtered.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [services, search]);

  const generateDescription = (s: Service) => {
    const isNR = s.name.includes("[NR]") || s.name.includes("ไม่ลด") === false;
    const isR = s.name.includes("[R") || s.name.includes("รับประกัน") || s.name.includes("ยอดไม่ลด");
    const speedMatch = s.name.match(/\[(.*?[sS]peed.*?)\]|\[(เริ่ม.*?)\]|\[(.*?[kK]\/วัน.*?)\]/g);
    
    return (
      <div className="space-y-3 text-sm text-gray-300">
        <p><strong className="text-white">เริ่มต้น:</strong> {speedMatch ? speedMatch.join(" ") : "เริ่ม 0-24 ชั่วโมง"}</p>
        <p><strong className="text-white">ความเร็ว:</strong> ตามระบุในชื่อบริการ</p>
        <p><strong className="text-white">การรับประกัน:</strong> {isR ? "มีรับประกัน" : isNR ? "ไม่มีรับประกัน (NR)" : "ตามเงื่อนไขเซิร์ฟเวอร์"}</p>
        <p><strong className="text-white">คุณภาพ:</strong> คุณภาพสูง / บัญชีผสม</p>
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg space-y-1">
          <p className="text-red-400 font-semibold text-xs">⚠️ หมายเหตุ:</p>
          <p className="text-xs">📌 ตรวจสอบลิงก์ให้ละเอียดก่อนทำการสั่งซื้อ</p>
          <p className="text-xs">🔓 โปรดตรวจสอบให้แน่ใจว่าบัญชีของคุณเป็นสาธารณะ ไม่ใช่ส่วนตัว</p>
          <p className="text-xs">📌 อย่าสั่งซื้อลิงก์เดิมซ้ำจนกว่าคำสั่งซื้อเก่าของคุณจะเสร็จสมบูรณ์</p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="ค้นหาบริการ..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 bg-white/70 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
        />
      </div>

      <div className="space-y-6">
        {Object.entries(groupedServices).map(([category, items]) => (
          <div key={category} className="bg-[#1c1c28] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-[#2a2a3c] to-[#1c1c28] p-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 border border-blue-500/30">
                <span className="text-blue-400 font-bold text-xs">{items.length}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">{category}</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1c1c28] text-gray-400 text-xs uppercase border-b border-gray-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">บริการ</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">เรทราคา / 1000</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">ขั้นต่ำ-สูงสุด</th>
                    <th className="px-6 py-4 font-semibold text-right">แอคชั่น</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {items.map(s => (
                    <tr key={s.id} className="hover:bg-[#252536] transition-colors">
                      <td className="px-6 py-4 text-gray-500">#{s.id}</td>
                      <td className="px-6 py-4 text-gray-200 font-medium min-w-[300px]">{s.name}</td>
                      <td className="px-6 py-4 text-emerald-400 font-bold whitespace-nowrap">฿{s.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-400 text-xs whitespace-nowrap">{s.min} - {s.max.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setSelectedService(s)}
                          className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors"
                          title="รายละเอียด"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <a href={`/dashboard`} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-purple-500/20 transition-all flex items-center">
                          <ShoppingCart className="w-3 h-3 mr-1.5" /> สั่งซื้อ
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Popup for Service Description */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1c1c28] border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start p-5 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white pr-4 leading-tight">{selectedService.name}</h3>
              <button onClick={() => setSelectedService(null)} className="text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg p-1.5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {generateDescription(selectedService)}
              
              <div className="mt-6 pt-5 border-t border-gray-800 flex justify-end">
                <a href={`/dashboard`} className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-center hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                  🛒 สั่งซื้อบริการนี้
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
