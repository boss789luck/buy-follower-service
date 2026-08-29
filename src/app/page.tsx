import { redirect } from "next/navigation";
import { auth } from "@/auth";
import LoginForm from "./components/LoginForm";

export default async function Home() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">PanelSocial.club</h1>
          <p className="text-gray-500 text-sm mt-1">เข้าสู่ระบบ (Clone)</p>
        </div>
        <LoginForm />
        <div className="mt-4 flex justify-between text-sm">
          <a href="/signup" className="text-blue-500 hover:underline">สมัครสมาชิก</a>
          <a href="/services" className="text-blue-500 hover:underline">รายชื่อบริการ</a>
        </div>
      </div>
    </div>
  );
}
