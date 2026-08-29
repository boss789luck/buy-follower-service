"use client";
import { useState, useMemo } from "react";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaLine, FaGlobe } from "react-icons/fa";
import { CheckCircle2, ChevronRight, Zap, Sparkles } from "lucide-react";

type Service = {
  id: number;
  name: string;
  category: string;
  price: number;
  min: number;
  max: number;
};

const platforms = [
  { id: "facebook", name: "Facebook", icon: <FaFacebook className="w-9 h-9" />, color: "from-[#1877F2] to-[#3b5998]", shadow: "shadow-blue-500/30", keywords: ["facebook", "เฟซ", "เพจ"] },
  { id: "instagram", name: "Instagram", icon: <FaInstagram className="w-9 h-9" />, color: "from-[#f09433] via-[#e6683c] to-[#bc1888]", shadow: "shadow-pink-500/30", keywords: ["instagram", "ไอจี"] },
  { id: "tiktok", name: "TikTok", icon: <FaTiktok className="w-9 h-9" />, color: "from-[#000000] to-[#434343]", shadow: "shadow-gray-500/30", keywords: ["tiktok", "ติ๊กต๊อก"] },
  { id: "line", name: "LINE", icon: <FaLine className="w-9 h-9" />, color: "from-[#00B900] to-[#009900]", shadow: "shadow-green-500/30", keywords: ["line"] },
  { id: "twitter", name: "X (Twitter)", icon: <FaTwitter className="w-9 h-9" />, color: "from-[#1DA1F2] to-[#1a91da]", shadow: "shadow-sky-500/30", keywords: ["twitter", "ทวิต", "x"] },
  { id: "other", name: "อื่นๆ", icon: <FaGlobe className="w-9 h-9" />, color: "from-gray-500 to-gray-600", shadow: "shadow-gray-400/20", keywords: [] },
];

export default function OrderForm({ services }: { services: Service[] }) {
  const [platform, setPlatform] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredServices = useMemo(() => {
    if (!platform) return [];
    let list = [];
    if (platform === "other") {
      list = services.filter(s => !platforms.slice(0, 5).some(p => p.keywords.some(kw => s.name.toLowerCase().includes(kw) || s.category.toLowerCase().includes(kw))));
    } else {
      const p = platforms.find(x => x.id === platform);
      list = services.filter(s => p?.keywords.some(kw => s.name.toLowerCase().includes(kw) || s.category.toLowerCase().includes(kw)));
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
    }
    return list;
  }, [platform, services, searchQuery]);

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
          quantity
        })
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess(`สั่งซื้อสำเร็จ! รหัสออเดอร์: ${data.order.id}`);
        setLink("");
        setQuantity("");
        setSelectedService(null);
        setPlatform(null);
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

  return (
    <div className="space-y-10">
      
      {/* Messages */}
      {error && <div className="p-4 bg-red-50/80 backdrop-blur-md text-red-600 rounded-2xl text-sm font-semibold border border-red-100 shadow-sm">{error}</div>}
      {success && <div className="p-4 bg-green-50/80 backdrop-blur-md text-green-700 rounded-2xl text-sm font-semibold border border-green-100 shadow-sm flex items-center"><CheckCircle2 className="w-5 h-5 mr-2"/>{success}</div>}

      {/* Step 1: Platform Selection */}
      <section>
        <div className="flex items-center mb-5">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-xs font-black mr-3 shadow-md shadow-blue-500/20">1</div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">เลือกแพลตฟอร์มเป้าหมาย</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {platforms.map(p => {
            const isSelected = platform === p.id;
            
            // Define platform-specific identity animation classes
            let identityAnimation = "";
            let baseColorClass = "";
            if (p.id === 'instagram') {
              identityAnimation = isSelected || "group-hover:animate-ig";
              baseColorClass = "text-[#E4405F]";
            } else if (p.id === 'tiktok') {
              identityAnimation = isSelected ? "animate-tiktok" : "group-hover:animate-tiktok";
              baseColorClass = "text-black";
            } else if (p.id === 'line') {
              identityAnimation = isSelected ? "animate-line" : "group-hover:animate-line";
              baseColorClass = "text-[#00B900]";
            } else if (p.id === 'facebook') {
              identityAnimation = isSelected ? "animate-pulse" : "group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300";
              baseColorClass = "text-[#1877F2]";
            } else if (p.id === 'twitter') {
              identityAnimation = isSelected ? "animate-bounce" : "group-hover:animate-bounce";
              baseColorClass = "text-[#1DA1F2]";
            } else {
              identityAnimation = isSelected ? "animate-pulse" : "group-hover:rotate-12 transition-transform duration-300";
              baseColorClass = "text-gray-500";
            }

            return (
              <button
                key={p.id}
                onClick={() => { setPlatform(p.id); setSelectedService(null); setSearchQuery(""); }}
                className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 ${
                  isSelected 
                    ? `bg-gradient-to-br ${p.color} shadow-lg ${p.shadow} scale-[1.03] text-white border-transparent` 
                    : 'bg-white/80 backdrop-blur-md border border-white hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 text-gray-500'
                }`}
              >
                {/* Glow behind icon when selected */}
                {isSelected && <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl pointer-events-none" />}
                
                <div className={`mb-4 transition-transform duration-300 ${isSelected ? 'scale-110 drop-shadow-md text-white' : `${baseColorClass} opacity-80 group-hover:opacity-100 animate-float`} ${identityAnimation}`} style={{animationDelay: isSelected ? '0s' : `${Math.random()}s`}}>
                  {p.icon}
                </div>
                <span className={`text-sm font-bold tracking-wide relative z-10 ${isSelected ? 'text-white' : 'text-gray-700 group-hover:text-black'}`}>
                  {p.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Step 2: Service Selection (Conditional) */}
      {platform && (
        <section className="animate-in fade-in slide-in-from-top-6 duration-500 ease-out">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-xs font-black mr-3 shadow-md shadow-blue-500/20">2</div>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">บริการที่คุณต้องการ</h2>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-48 md:w-64">
              <input 
                type="text" 
                placeholder="ค้นหาบริการ..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/70 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
              />
            </div>
          </div>
          <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white p-3 shadow-xl shadow-gray-200/40 max-h-[340px] overflow-y-auto scrollbar-hide">
            {filteredServices.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-semibold flex flex-col items-center">
                <Sparkles className="w-8 h-8 mb-3 opacity-30" />
                ไม่พบบริการในหมวดหมู่นี้
              </div>
            ) : (
              <div className="space-y-2">
                {filteredServices.map(s => {
                  const isSelected = selectedService?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`w-full text-left flex items-center justify-between p-5 rounded-2xl transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 border-gray-800 text-white shadow-lg shadow-gray-900/20 scale-[1.01]' 
                          : 'bg-white border-transparent hover:bg-gray-50/80 hover:border-gray-100 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center pr-4">
                        {isSelected && <Zap className="w-5 h-5 mr-3 text-yellow-400 flex-shrink-0 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" fill="currentColor"/>}
                        <span className={`font-semibold text-sm leading-relaxed ${isSelected ? 'text-white' : 'text-gray-800'}`}>{s.name}</span>
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg mb-1.5 ${isSelected ? 'bg-white/10 text-white backdrop-blur-md' : 'bg-gray-100 text-gray-600'}`}>
                          ฿{(s.price/1000).toFixed(2)} / 1K
                        </span>
                        <span className={`text-[10px] font-medium tracking-wide ${isSelected ? 'text-gray-400' : 'text-gray-400'}`}>
                          MIN {s.min} • MAX {s.max.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 3: Order Details (Conditional) */}
      {selectedService && (
        <section className="animate-in fade-in slide-in-from-top-6 duration-500 ease-out delay-100">
          <div className="flex items-center mb-5">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-xs font-black mr-3 shadow-md shadow-blue-500/20">3</div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">เป้าหมายและจำนวน</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white shadow-xl shadow-gray-200/40 relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2 ml-1">Link (เป้าหมาย)</label>
                <input 
                  type="url" 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-white/80 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm font-medium"
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <label className="block text-xs font-bold tracking-wider text-gray-500 uppercase mb-2 ml-1">Quantity (จำนวน)</label>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white/80 border border-gray-200 text-gray-900 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-black text-xl shadow-sm"
                    placeholder={`${selectedService.min} - ${selectedService.max.toLocaleString()}`}
                    min={selectedService.min}
                    max={selectedService.max}
                    required
                  />
                </div>
                <div className="md:w-56 flex flex-col justify-end">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-5 text-center flex items-center justify-center shadow-xl shadow-gray-900/20">
                    <span className="text-xs text-gray-400 mr-2 uppercase tracking-widest font-bold">Total:</span>
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
                      ฿{currentPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 relative z-10">
              <button 
                type="submit" 
                disabled={loading}
                className="group w-full flex items-center justify-center py-5 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 focus:ring-4 focus:ring-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 animate-gradient-x"
              >
                {loading ? "กำลังประมวลผล..." : "ยืนยันการสั่งซื้อ"}
                {!loading && <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={3} />}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
