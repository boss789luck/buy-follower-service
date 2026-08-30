"use client";

import { useState } from "react";
import { Search, RefreshCw, XCircle, CheckCircle2, Clock, Loader2, Link2, ExternalLink } from "lucide-react";
import { refundOrder, updateOrderStatus, syncAllOrdersStatus } from "./actions";

type OrderType = {
  id: string;
  createdAt: Date;
  link: string;
  quantity: number;
  charge: number;
  status: string;
  providerOrderId: string | null;
  service: {
    name: string;
  };
  user: {
    username: string;
  }
};

export default function AdminOrdersClient({ initialOrders }: { initialOrders: OrderType[] }) {
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.user.username.toLowerCase().includes(search.toLowerCase()) ||
    o.service.name.toLowerCase().includes(search.toLowerCase()) ||
    o.link.toLowerCase().includes(search.toLowerCase()) ||
    (o.providerOrderId && o.providerOrderId.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSyncOrders = async () => {
    setIsSyncing(true);
    const result = await syncAllOrdersStatus();
    setIsSyncing(false);
    
    if (result.success) {
      alert(result.message);
      window.location.reload(); // Refresh to get updated data
    } else {
      alert(result.error);
    }
  };

  const handleRefund = async (orderId: string) => {
    if (!confirm("ยืนยันการยกเลิกออเดอร์และคืนเงินให้ลูกค้า? (ระบบจะบวกเงินกลับเข้ากระเป๋าลูกค้าทันที)")) return;
    
    setLoadingId(orderId);
    const result = await refundOrder(orderId);
    
    if (result.success) {
      alert("คืนเงินสำเร็จ");
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: "CANCELED" } : o));
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoadingId(orderId);
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">Completed</span>;
      case 'PROCESSING': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">Processing</span>;
      case 'PENDING': return <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">Pending</span>;
      case 'CANCELED': return <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">Canceled</span>;
      default: return <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs font-bold rounded">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info & Search */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96 flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="ค้นหา ID, ลูกค้า, ชื่อบริการ, ลิงก์..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-gray-400 text-sm font-medium mr-2">
            พบ {filteredOrders.length} ออเดอร์
          </div>
          <button 
            onClick={handleSyncOrders}
            disabled={isSyncing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl flex items-center transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> 
            {isSyncing ? 'กำลังซิงค์...' : 'อัปเดตสถานะ (API)'}
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1f222a] text-gray-400">
              <tr>
                <th className="px-4 py-4 font-medium">รหัส / ผู้ใช้</th>
                <th className="px-4 py-4 font-medium">บริการ & ลิงก์</th>
                <th className="px-4 py-4 font-medium text-center">ปริมาณ</th>
                <th className="px-4 py-4 font-medium text-right">ยอดตัด (฿)</th>
                <th className="px-4 py-4 font-medium text-center">สถานะ</th>
                <th className="px-4 py-4 font-medium text-center">อัปเดต / คืนเงิน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    ไม่พบออเดอร์
                  </td>
                </tr>
              ) : filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-[#252830] transition-colors">
                  
                  <td className="px-4 py-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-white font-bold">{o.user.username}</span>
                      <span className="text-xs font-mono text-gray-500">#{o.id.substring(0,8)}</span>
                      {o.providerOrderId && (
                        <span className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded w-fit">
                          API: {o.providerOrderId}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 max-w-[250px]">
                    <div className="flex flex-col space-y-1">
                      <span className="text-gray-300 font-medium truncate" title={o.service.name}>
                        {o.service.name}
                      </span>
                      <a href={o.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:text-blue-400 hover:underline flex items-center truncate">
                        <Link2 className="w-3 h-3 mr-1 flex-shrink-0" /> {o.link}
                      </a>
                    </div>
                  </td>

                  <td className="px-4 py-3 text-center text-gray-300 font-bold">
                    {o.quantity.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-emerald-400">
                      {o.charge.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <select
                      value={o.status}
                      disabled={loadingId === o.id || o.status === 'CANCELED'}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="bg-[#0f1115] border border-gray-700 text-xs text-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELED">Canceled (Refunded)</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-center">
                    {o.status !== 'CANCELED' ? (
                      <button 
                        onClick={() => handleRefund(o.id)}
                        disabled={loadingId === o.id}
                        className="inline-flex items-center px-2 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 rounded text-xs font-bold transition-colors disabled:opacity-50"
                        title="ยกเลิกออเดอร์และคืนเงินให้ลูกค้า"
                      >
                        {loadingId === o.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3 mr-1" />} คืนเงิน
                      </button>
                    ) : (
                      <span className="text-gray-600 text-xs font-bold">คืนเงินแล้ว</span>
                    )}
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
