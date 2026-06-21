"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Sayfa 300 pikselden fazla aşağı kaydırıldıysa butonu göster
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div 
      className={`fixed right-6 bottom-6 md:right-10 md:bottom-10 z-50 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Yukarı Çık"
        className="w-12 h-12 md:w-14 md:h-14 bg-[#082b34] text-white rounded-2xl shadow-xl shadow-[#082b34]/30 flex items-center justify-center hover:bg-[#00878a] hover:-translate-y-1 transition-all group"
      >
        <ChevronUp className="w-6 h-6 md:w-7 md:h-7 group-hover:animate-bounce" />
      </button>
    </div>
  );
}