import { prisma } from "@/lib/prisma";
import { BellRing, ArrowUpRight, ArrowDownRight, Sparkles, AlertTriangle, ArrowRight } from "lucide-react";

export default async function UpdatesPage() {
  const updates = await prisma.serviceUpdate.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100 // Get latest 100 updates
  });

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
      case 'NEW': return <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">บริการใหม่ล่าสุด!</span>;
      case 'PRICE_UP': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">ราคาขึ้น</span>;
      case 'PRICE_DOWN': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">ลดราคา</span>;
      case 'DISABLED': return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">ปิดบริการชั่วคราว</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
          <BellRing className="w-6 h-6 text-sky-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">อัปเดตบริการ (System Updates)</h1>
          <p className="text-gray-500 text-sm mt-1">ติดตามข่าวสาร บริการมาใหม่ และการปรับเปลี่ยนราคาแบบ Real-time</p>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-gray-200/50 rounded-3xl p-6 relative overflow-hidden min-h-[500px]">
        {updates.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <BellRing className="w-12 h-12 mb-4 text-gray-300 opacity-50" />
            <p className="font-medium text-lg">ยังไม่มีข่าวสารอัปเดตในขณะนี้</p>
            <p className="text-sm mt-1">อัปเดตใหม่ๆ จะแสดงที่นี่โดยอัตโนมัติ</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((u) => (
              <div key={u.id} className="bg-white border border-gray-100 p-4 rounded-2xl flex items-start space-x-4 hover:shadow-md transition-shadow">
                <div className="mt-1">
                  {getIcon(u.type)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                    <h3 className="font-bold text-gray-800 text-sm">{u.serviceName}</h3>
                    <div className="flex-shrink-0">
                      {getBadge(u.type)}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2 flex items-center">
                    {u.type === 'NEW' && u.newPrice && (
                      <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        เริ่มต้นเพียง ฿{u.newPrice.toFixed(2)}
                      </span>
                    )}
                    
                    {u.type === 'PRICE_UP' && u.oldPrice && u.newPrice && (
                      <span className="flex items-center space-x-2">
                        <span className="line-through">฿{u.oldPrice.toFixed(2)}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-red-600 font-bold">฿{u.newPrice.toFixed(2)}</span>
                      </span>
                    )}

                    {u.type === 'PRICE_DOWN' && u.oldPrice && u.newPrice && (
                      <span className="flex items-center space-x-2">
                        <span className="line-through">฿{u.oldPrice.toFixed(2)}</span>
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-emerald-600 font-bold">฿{u.newPrice.toFixed(2)}</span>
                      </span>
                    )}

                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-[10px]">
                      {u.createdAt.toLocaleString('th-TH')}
                    </span>
                    
                    {u.serviceId && (
                      <>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded">ID: {u.serviceId}</span>
                      </>
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
