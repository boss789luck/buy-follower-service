import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { category: 'asc' }
  });

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-500 pb-1">
          บริการทั้งหมด
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium tracking-wide">
          อัปเดตราคาล่าสุดจากระบบอัตโนมัติ
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-white p-1 shadow-xl shadow-gray-200/40">
        <div className="overflow-x-auto rounded-3xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100/50 text-gray-500 sticky top-0 backdrop-blur-md z-10">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">หมวดหมู่</th>
                <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">ชื่อบริการ</th>
                <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">ราคา / 1,000</th>
                <th className="px-6 py-4 font-bold tracking-wider uppercase text-xs">ขั้นต่ำ-สูงสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-white/80 transition-colors duration-150">
                  <td className="px-6 py-4 text-gray-500 font-semibold whitespace-nowrap">{s.category}</td>
                  <td className="px-6 py-4 text-gray-800 font-medium">{s.name}</td>
                  <td className="px-6 py-4 font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600 whitespace-nowrap">
                    ฿{(s.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-semibold whitespace-nowrap">
                    {s.min} - {s.max.toLocaleString()}
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
