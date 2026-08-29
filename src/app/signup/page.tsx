import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SignupPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">PanelSocial.club</h1>
          <p className="text-gray-500 text-sm mt-1">สมัครสมาชิกใหม่</p>
        </div>
        <form className="space-y-4">
          <div>
            <input type="text" placeholder="ชื่อผู้ใช้" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>
          <div>
            <input type="email" placeholder="อีเมล" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>
          <div>
            <input type="password" placeholder="รหัสผ่าน" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>
          <div>
            <input type="password" placeholder="ยืนยันรหัสผ่าน" className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500 text-gray-900" />
          </div>
          <button type="button" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition" onClick={() => alert('กำลังพัฒนาระบบสมัครสมาชิก...')}>
            สมัครสมาชิก
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <a href="/" className="text-blue-500 hover:underline">มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</a>
        </div>
      </div>
    </div>
  );
}
