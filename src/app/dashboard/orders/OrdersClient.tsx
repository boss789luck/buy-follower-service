"use client";

import { useState } from "react";
import { Search, CheckCircle2, Clock, Loader2, XCircle, FileText, Copy, ExternalLink, ShoppingCart, ArrowRight } from "lucide-react";

type OrderType = {
  id: string;
  createdAt: Date;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  service: {
    name: string;
  };
};

const statuses = [
  { id: "ALL", label: "ทั้งหมด", icon: null },
  { id: "PENDING", label: "รอคิว", icon: <Clock className="w-3.5 h-3.5 mr-1.5" /> },
  { id: "PROCESSING", label: "กำลังทำงาน", icon: <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> },
  { id: "COMPLETED", label: "เสร็จสิ้น", icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> },
  { id: "CANCELED", label: "ยกเลิกแล้ว", icon: <XCircle className="w-3.5 h-3.5 mr-1.5" /> },
];

export default function OrdersClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Filtering Logic
  const filteredOrders = initialOrders.filter(order => {
    const matchesSearch = 
      order.service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> เสร็จสมบูรณ์</span>;
      case 'PROCESSING':
        return <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200"><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> กำลังดำเนินการ</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold border border-amber-200"><Clock className="w-3.5 h-3.5 mr-1.5" /> รอดำเนินการ</span>;
      case 'CANCELED':
        return <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200"><XCircle className="w-3.5 h-3.5 mr-1.5" /> ยกเลิกแล้ว</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">{status}</span>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Optional: add a tiny toast notification here if desired
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-10">
      
      {/* Header Area */}
      <div className="flex items-center mb-2">
        <FileText className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 pb-1">
            ประวัติการสั่งซื้อ
          </h1>
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            ประวัติคำสั่งซื้อทั้งหมดของคุณ
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statuses.map(s => (
          <button
            key={s.id}
            onClick={() => setStatusFilter(s.id)}
            className={`flex items-center px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
              statusFilter === s.id 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 scale-105" 
                : "bg-white/70 text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="flex items-center max-w-md relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-12 py-3 bg-white/90 backdrop-blur-md border border-gray-300 rounded-2xl text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-sm">
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white/70 backdrop-blur-2xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden relative min-h-[400px]">
        
        {/* Ambient background blur inside table area for depth */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />

        <div className="overflow-x-auto relative z-10 p-2">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="text-gray-500 font-bold border-b border-gray-200/60">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">ID ออเดอร์</th>
                <th className="px-6 py-5 whitespace-nowrap">วันที่</th>
                <th className="px-6 py-5 whitespace-nowrap">ลิงก์</th>
                <th className="px-6 py-5 whitespace-nowrap">ค่าบริการ</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">ปริมาณ</th>
                <th className="px-6 py-5 whitespace-nowrap">บริการ</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium text-base">ไม่พบข้อมูลออเดอร์</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/60 transition-colors">
                  
                  {/* ID */}
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md text-xs">
                      {order.id.substring(0,8)}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-medium text-xs">
                    {new Date(order.createdAt).toLocaleString('th-TH', { 
                      year: 'numeric', month: '2-digit', day: '2-digit', 
                      hour: '2-digit', minute:'2-digit', second:'2-digit' 
                    }).replace(',', '')}
                  </td>

                  {/* Link */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => copyToClipboard(order.link)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-md transition-colors" title="คัดลอกลิงก์">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a href={order.link} target="_blank" rel="noreferrer" className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-md transition-colors" title="เปิดลิงก์">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <div className="max-w-[120px] lg:max-w-[180px] truncate text-gray-700 font-medium text-xs ml-1" title={order.link}>
                        {order.link}
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div className="font-bold text-emerald-600">
                      ฿{order.charge.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </div>
                  </td>

                  {/* Quantity */}
                  <td className="px-6 py-4 text-center">
                    <span className="font-black text-gray-800">
                      {order.quantity.toLocaleString()}
                    </span>
                  </td>
                  
                  {/* Service Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <ShoppingCart className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                      <div className="text-gray-800 font-bold max-w-[200px] lg:max-w-[300px] truncate text-sm" title={order.service.name}>
                        {order.service.name}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
