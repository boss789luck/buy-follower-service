import { redirect } from "next/navigation";
import { auth } from "@/auth";
import SignupClient from "./SignupClient";
import { Rocket } from "lucide-react";

export default async function SignupPage() {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1115] relative overflow-hidden p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo/Brand */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 border border-blue-400/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">NSPanelTHAI</h1>
          <p className="text-gray-400 text-sm mt-2 font-medium">สมัครสมาชิกใหม่ เพื่อเริ่มต้นใช้งาน</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#1a1d24]/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <SignupClient />
        </div>
        
      </div>
    </div>
  );
}
