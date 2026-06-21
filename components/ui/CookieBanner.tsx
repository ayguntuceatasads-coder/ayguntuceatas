"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Kullanıcı daha önce seçim yapmış mı?
    if (!localStorage.getItem("cookie_consent")) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookie_consent", "all");
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem("cookie_consent", "necessary");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-in slide-in-from-bottom-10">
      <div className="max-w-4xl mx-auto bg-[#082b34] text-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border border-slate-700">
        
        <div className="flex items-start gap-4">
          <Cookie className="w-10 h-10 text-[#6ec9c9] shrink-0" />
          <div>
            <h4 className="font-bold text-lg mb-1">Çerez Kullanımı</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sitemizde deneyiminizi iyileştirmek için çerezler kullanıyoruz. 
              <Link href="/yasal/cerez-politikasi" className="text-[#6ec9c9] font-bold hover:underline ml-1">Detaylı Bilgi</Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handleAcceptNecessary}
            className="px-6 py-3 rounded-xl text-sm font-bold border border-slate-600 hover:bg-slate-700 transition-all"
          >
            Sadece Zorunlular
          </button>
          <button 
            onClick={handleAcceptAll}
            className="px-6 py-3 rounded-xl text-sm font-bold bg-[#00878a] hover:bg-[#6ec9c9] hover:text-[#082b34] transition-all"
          >
            Tümünü Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}