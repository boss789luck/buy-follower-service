"use client";
import { useState, useMemo, useEffect } from "react";
import { CheckCircle2, ChevronRight, AlertCircle, Search } from "lucide-react";

type Service = {
  id: number;
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

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return Array.from(cats).sort();
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
      list = list.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }
    return list;
  }, [services, selectedCategory, searchQuery]);

  // Set initial service if category changes
  useEffect(() => {
    if (filteredServices.length > 0 && (!selectedServiceId || !filteredServices.find(s => s.id === selectedServiceId))) {
      setSelectedServiceId(filteredServices[0].id);
    } else if (filteredServices.length === 0) {
      setSelectedServiceId("");
    }
  }, [selectedCategory, filteredServices]);

  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || null;
  }, [services, selectedServiceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || typeof quantity !== 'number' || quantity < selectedService.min || quantity > selectedService.max) {
      setError("จำนวนไม่ถูกต้องตามเงื่อนไขบริการ");
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
          comments: customComments || undefined
        })
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`สั่งซื้อสำเร็จ! รหัสออเดอร์: ${data.order.id}`);
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

  const requiresCustomComments = selectedService?.name.toLowerCase().includes('custom') || selectedService?.name.includes('กำหนด');

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-800">สั่งซื้อบริการ</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="ค้นหาบริการ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">หมวดหมู่บริการ</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
          >
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Service Dropdown */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">บริการ (ราคาต่อ 1000)</label>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(Number(e.target.value))}
            className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none"
            disabled={filteredServices.length === 0}
          >
            {filteredServices.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} - ฿{(s.price).toFixed(2)}
              </option>
            ))}
            {filteredServices.length === 0 && <option value="">ไม่มีบริการในหมวดหมู่นี้</option>}
          </select>
        </div>

        {/* Link Input */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">ลิงก์เป้าหมาย</label>
          <input 
            type="url" 
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
            placeholder="https://..."
            required
          />
        </div>

        {/* Custom Comments */}
        {requiresCustomComments && (
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">คอมเมนต์ (1 บรรทัดต่อ 1 คอมเมนต์)</label>
            <textarea 
              value={customComments}
              onChange={(e) => {
                setCustomComments(e.target.value);
                const lines = e.target.value.split('\n').filter(l => l.trim().length > 0).length;
                setQuantity(lines || '');
              }}
              className="w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              placeholder="สวยมากเลยครับ&#10;เยี่ยมยอดไปเลย&#10;สุดยอด"
              required
            />
          </div>
        )}

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">จำนวน</label>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className={`w-full bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none ${
                requiresCustomComments ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
              }`}
              placeholder={selectedService ? `${selectedService.min} - ${selectedService.max.toLocaleString()}` : ''}
              min={selectedService?.min}
              max={selectedService?.max}
              readOnly={requiresCustomComments}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ค่าบริการ</label>
            <div className="w-full bg-gray-100 border border-gray-300 text-gray-900 font-bold rounded-lg px-4 py-3 cursor-not-allowed">
              ฿{currentPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {selectedService && (
           <p className="text-xs text-gray-500 mt-1">
             ขั้นต่ำ: {selectedService.min} | สูงสุด: {selectedService.max.toLocaleString()}
           </p>
        )}

        {/* Submit */}
        <div className="pt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-bold flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error.includes('Provider Error') ? 'ระบบขัดข้องชั่วคราว กรุณาติดต่อแอดมิน' : error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-bold flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" />
              {success}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading || !selectedService}
            className="w-full flex items-center justify-center py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "กำลังประมวลผล..." : "สั่งซื้อบริการ"}
          </button>
        </div>

      </form>
    </div>
  );
}
