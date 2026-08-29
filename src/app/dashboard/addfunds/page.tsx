"use client";
import { useState } from "react";

export default function AddFundsPage() {
  const [method, setMethod] = useState("promptpay");
  const [amount, setAmount] = useState("");

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("ระบบกำลังเชื่อมต่อ Payment Gateway เพื่อสร้างรายการเติมเงิน " + amount + " บาท\n(กำลังอยู่ในระหว่างพัฒนาส่วนเชื่อมต่อ API ธนาคาร)");
  };

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-800">เติมเงิน</h2>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setMethod("promptpay")}
          className={`px-4 py-2 rounded ${method === 'promptpay' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          สแกน QR Code (พร้อมเพย์)
        </button>
        <button 
          onClick={() => setMethod("bank")}
          className={`px-4 py-2 rounded ${method === 'bank' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          โอนผ่านบัญชีธนาคาร
        </button>
        <button 
          onClick={() => setMethod("truemoney")}
          className={`px-4 py-2 rounded ${method === 'truemoney' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          TrueMoney Wallet
        </button>
      </div>

      <form onSubmit={handleDeposit} className="space-y-4">
        {method === "promptpay" && (
          <div className="p-4 border rounded bg-blue-50 text-blue-800 text-sm">
            ระบบจะสร้าง QR Code อัตโนมัติ ให้คุณสแกนผ่านแอปธนาคาร ยอดเงินจะเข้าทันทีหลังจากชำระเสร็จ
          </div>
        )}
        {method === "bank" && (
          <div className="p-4 border rounded bg-blue-50 text-blue-800 text-sm">
            กรุณาโอนเงินเข้าบัญชี: <strong>123-4-56789-0</strong> ธ.กสิกรไทย (นายทดสอบ ระบบโคลน)<br/>
            และแนบสลิปเพื่อยืนยัน
          </div>
        )}
        {method === "truemoney" && (
          <div className="p-4 border rounded bg-orange-50 text-orange-800 text-sm">
            โอนเข้าเบอร์: <strong>080-000-0000</strong> (นายทดสอบ ระบบโคลน)<br/>
            จากนั้นกรอกเลขอ้างอิง (Reference No.) จากสลิป
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">จำนวนเงินที่ต้องการเติม (บาท)</label>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 text-gray-900"
            min="10"
            required
            placeholder="ขั้นต่ำ 10 บาท"
          />
        </div>

        {method === "bank" && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">แนบสลิปโอนเงิน</label>
            <input type="file" className="w-full text-gray-700" />
          </div>
        )}

        {method === "truemoney" && (
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">เลขอ้างอิง (Reference No.)</label>
            <input type="text" className="w-full border rounded px-3 py-2 text-gray-900" placeholder="กรอกเลขอ้างอิง 14 หลัก" />
          </div>
        )}

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          แจ้งเติมเงิน
        </button>
      </form>
    </div>
  );
}
