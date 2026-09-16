"use client";

import { useState, useMemo } from "react";
import { BellRing, ArrowUpRight, ArrowDownRight, Sparkles, AlertTriangle, ArrowRight, Search, Layers } from "lucide-react";

type ServiceUpdate = {
  id: string;
  serviceId: number | null;
  serviceName: string;
  type: string;
  oldPrice: number | null;
  newPrice: number | null;
  createdAt: Date;
};

const filterTabs = [
  { id: "ALL", label: "ทั้งหมด" },
  { id: "NEW", label: "บริการใหม่" },
  { id: "PRICE_DOWN", label: "ลดราคา" },
  { id: "PRICE_UP", label: "ราคาขึ้น" },
  { id: "DISABLED", label: "ปิดบริการ" },
];

export default function UpdatesClient({ updates }: { updates: ServiceUpdate[] }) {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredUpdates = useMemo(() => {
    let list = updates;
    if (activeTab !== "ALL") {
      list = list.filter(u => u.type === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u => 
        u.serviceName.toLowerCase().includes(q) || 
        (u.serviceId && u.serviceId.toString().includes(q))
      );
    }
    return list;
  }, [updates, activeTab, search]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW': return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'PRICE_UP': return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'PRICE_DOWN': return <ArrowDownRight className="w-5 h-5 text-emerald-500" />;
      case 'DISABLED': return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      default: return <BellRing className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case 'NEW': return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200">บริการใหม่</span>;
      case 'PRICE_UP': return <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200">ราคาขึ้น</span>;
      case 'PRICE_DOWN': return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">ลดราคา</span>;
      case 'DISABLED': return <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl border border-gray-200">ปิดบริการ</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search and Tabs */}
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-5 space-y-4">
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อบริการ หรือรหัสบริการ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 text-gray-900 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Updates List */}
      <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 min-h-[400px]">
        {filteredUpdates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[320px] text-gray-400 space-y-2">
            <BellRing className="w-10 h-10 text-gray-300 opacity-60" />
            <p className="font-bold text-base text-gray-500">ยังไม่มีประวัติการอัปเดตในหมวดนี้</p>
            <p className="text-xs text-gray-400">เมื่อมีการเพิ่มบริการหรือปรับราคา รายการจะแสดงที่นี่โดยอัตโนมัติ</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUpdates.map((u) => (
              <div key={u.id} className="py-4.5 flex items-start space-x-4 hover:bg-blue-50/20 transition-colors rounded-2xl px-3">
                <div className="mt-1 p-2 rounded-xl bg-gray-50 border border-gray-100">
                  {getIcon(u.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{u.serviceName}</h3>
                    <div className="flex-shrink-0">
                      {getBadge(u.type)}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2 flex flex-wrap items-center gap-2">
                    {u.type === 'NEW' && u.newPrice && (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200/60">
                        เรทเริ่มต้น: ฿{u.newPrice.toFixed(2)} / 1,000
                      </span>
                    )}
                    
                    {u.type === 'PRICE_UP' && u.oldPrice && u.newPrice && (
                      <span className="flex items-center space-x-1.5 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200/60">
                        <span className="line-through text-gray-400">฿{u.oldPrice.toFixed(2)}</span>
                        <ArrowRight className="w-3 h-3 text-red-500" />
                        <span className="text-red-600 font-bold">฿{u.newPrice.toFixed(2)}</span>
                      </span>
                    )}

                    {u.type === 'PRICE_DOWN' && u.oldPrice && u.newPrice && (
                      <span className="flex items-center space-x-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200/60">
                        <span className="line-through text-gray-400">฿{u.oldPrice.toFixed(2)}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 font-bold">฿{u.newPrice.toFixed(2)}</span>
                      </span>
                    )}

                    <span className="text-gray-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleString('th-TH', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    
                    {u.serviceId && (
                      <span className="font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[11px] font-bold">
                        ID: #{u.serviceId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
