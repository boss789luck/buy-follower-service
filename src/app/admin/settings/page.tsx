import { Settings as SettingsIcon } from "lucide-react";
import SettingsClient from "./SettingsClient";
import { getAdminConfig } from "./actions";

export default async function AdminSettingsPage() {
  const config = await getAdminConfig();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
          <SettingsIcon className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">ตั้งค่าระบบ (Settings)</h1>
          <p className="text-gray-400 mt-1">กำหนดผลกำไร และอัปเดตข้อมูลบริการจากผู้ให้บริการหลัก</p>
        </div>
      </div>

      <SettingsClient config={config} />
    </div>
  );
}
