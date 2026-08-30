"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, User, Wallet } from "lucide-react";

const thaiNames = [
  "สมชาย***", "Ploy***", "Kittipong***", "Nadech***", "Yaya***", "Mario***", "Sakchai***", 
  "Aum***", "Boy***", "Ken***", "Toon***", "Bank***", "Nong***", "Mew***", "Gulf***",
  "Win***", "Bright***", "Chompoo***", "Mai***", "Baifern***"
];

const actions = [
  { text: "กำลังใช้งานเว็บนี้อยู่", icon: <User className="w-4 h-4 text-blue-500" /> },
  { text: "เพิ่งสั่งซื้อบริการสำเร็จ", icon: <CheckCircle2 className="w-4 h-4 text-green-500" /> },
  { text: "เพิ่งเติมเครดิตเข้าระบบ", icon: <Wallet className="w-4 h-4 text-purple-500" /> }
];

export default function SocialProof() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentProof, setCurrentProof] = useState({ name: "", action: actions[0] });

  useEffect(() => {
    let lastNames: string[] = [];
    
    const showProof = () => {
      // Pick random name that wasn't used recently
      let availableNames = thaiNames.filter(n => !lastNames.includes(n));
      if (availableNames.length === 0) {
        lastNames = [];
        availableNames = thaiNames;
      }
      
      const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
      lastNames.push(randomName);
      if (lastNames.length > 5) lastNames.shift();
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      setCurrentProof({ name: randomName, action: randomAction });
      setIsVisible(true);
      
      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    // Initial delay before first popup
    const initialTimer = setTimeout(showProof, 3000);
    
    // Then show a popup every 8-15 seconds
    const interval = setInterval(() => {
      showProof();
    }, Math.floor(Math.random() * 7000) + 8000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 ease-in-out transform ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 rounded-2xl flex items-center space-x-3 max-w-xs">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 border border-white shadow-inner">
          {currentProof.action.icon}
        </div>
        <div>
          <p className="text-xs font-bold text-gray-800">{currentProof.name}</p>
          <p className="text-xs text-gray-500 font-medium">{currentProof.action.text}</p>
        </div>
      </div>
    </div>
  );
}
