"use client";

import { useState } from "react";
import { Search, Edit, Wallet, User as UserIcon, Shield, X, Save } from "lucide-react";
import { updateUserBalance } from "./actions";

type UserType = {
  id: string;
  username: string;
  balance: number;
  role: string;
  createdAt: Date;
  _count: { orders: number };
};

export default function UsersTable({ initialUsers }: { initialUsers: UserType[] }) {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [balanceInput, setBalanceInput] = useState<string>("");
  const [modifyType, setModifyType] = useState<"add" | "deduct" | "set">("add");
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) || 
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (user: UserType) => {
    setSelectedUser(user);
    setBalanceInput("");
    setModifyType("add");
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUser || !balanceInput || isNaN(Number(balanceInput))) return;
    
    setIsSaving(true);
    const amount = Number(balanceInput);
    
    const result = await updateUserBalance(selectedUser.id, amount, modifyType);
    
    if (result.success) {
      // Update local state to reflect changes instantly without hard refresh
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, balance: result.newBalance! } : u
      ));
      setIsModalOpen(false);
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Search Bar */}
      <div className="flex justify-between items-center bg-[#1a1d24] p-4 rounded-2xl border border-gray-800">
        <div className="relative w-full max-w-md">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อผู้ใช้งาน หรือ ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0f1115] border border-gray-700 text-white pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="text-gray-400 text-sm font-medium">
          พบ {filteredUsers.length} บัญชี
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1a1d24] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1f222a] text-gray-400">
              <tr>
                <th className="px-6 py-4 font-medium">ข้อมูลผู้ใช้</th>
                <th className="px-6 py-4 font-medium">สิทธิ์ (Role)</th>
                <th className="px-6 py-4 font-medium text-right">ยอดเงินคงเหลือ</th>
                <th className="px-6 py-4 font-medium text-center">จำนวนออเดอร์</th>
                <th className="px-6 py-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    ไม่พบผู้ใช้งานที่ค้นหา
                  </td>
                </tr>
              ) : filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#252830] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold uppercase">
                        {user.username.substring(0,2)}
                      </div>
                      <div>
                        <p className="text-white font-bold">{user.username}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {user.id.substring(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role === 'ADMIN' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">
                        <Shield className="w-3 h-3 mr-1" /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded bg-gray-700 text-gray-300 text-xs font-bold">
                        <UserIcon className="w-3 h-3 mr-1" /> USER
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-black text-emerald-400">
                      ฿{user.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-300 bg-gray-800 px-3 py-1 rounded-full text-xs font-bold">
                      {user._count.orders} รายการ
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => openModal(user)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-bold transition-all"
                    >
                      <Wallet className="w-3 h-3 mr-1.5" /> จัดการยอดเงิน
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Balance Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1a1d24] border border-gray-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Edit className="w-5 h-5 mr-2 text-blue-500" />
                จัดการยอดเงินลูกค้า
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="bg-[#0f1115] p-4 rounded-xl border border-gray-800 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Username</p>
                  <p className="text-white font-bold text-lg">{selectedUser.username}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">ยอดปัจจุบัน</p>
                  <p className="text-emerald-400 font-black text-xl">฿{selectedUser.balance.toLocaleString()}</p>
                </div>
              </div>

              {/* Action Type Selector */}
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setModifyType("add")}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${modifyType === 'add' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#0f1115] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  บวกเพิ่ม (+)
                </button>
                <button 
                  onClick={() => setModifyType("deduct")}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${modifyType === 'deduct' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-[#0f1115] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  หักลบ (-)
                </button>
                <button 
                  onClick={() => setModifyType("set")}
                  className={`py-2 rounded-lg text-sm font-bold border transition-all ${modifyType === 'set' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-[#0f1115] border-gray-700 text-gray-400 hover:border-gray-500'}`}
                >
                  ตั้งค่าคงที่ (=)
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">จำนวนเงิน (บาท)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">฿</span>
                  <input 
                    type="number"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#0f1115] border border-gray-700 text-white font-black text-2xl pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {modifyType === 'add' && "ยอดรวมสุทธิจะเป็น: ฿" + (selectedUser.balance + Number(balanceInput || 0)).toLocaleString()}
                  {modifyType === 'deduct' && "ยอดรวมสุทธิจะเป็น: ฿" + Math.max(0, selectedUser.balance - Number(balanceInput || 0)).toLocaleString()}
                  {modifyType === 'set' && "ยอดรวมสุทธิจะเป็น: ฿" + Number(balanceInput || 0).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving || !balanceInput || Number(balanceInput) < 0}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex justify-center items-center transition-colors"
                >
                  {isSaving ? (
                    <span className="animate-pulse">กำลังบันทึกข้อมูล...</span>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" /> บันทึกยอดเงิน
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
