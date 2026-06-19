"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
}

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);

  // Otomatik geçiş (6 saniyede bir)
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  // Eğer slayt yoksa render etme
  if (!slides || slides.length === 0) return null;

  const next = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);
  const prev = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] bg-[#082b34] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Arka Plan Resmi */}
          <div className="absolute inset-0">
            <img
              src={slide.image_url}
              className={`w-full h-full object-cover opacity-60 transition-transform duration-[7000ms] ease-linear ${
                index === current ? "scale-110" : "scale-100"
              }`}
              alt={slide.title}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#082b34] via-[#082b34]/70 to-transparent"></div>
          </div>

          {/* İçerik */}
          <div className="container relative mx-auto px-4 md:px-8 h-full flex items-center z-20 max-w-7xl">
            <div className={`max-w-2xl transition-all duration-1000 transform ${
              index === current ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
            }`}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#00878a]/20 border border-[#00878a]/30 text-[#6ec9c9] text-sm font-bold tracking-widest mb-6 uppercase">
                Uzman Klinik Psikolog
              </span>
              <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
                {slide.title}
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
                {slide.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={slide.button_link} 
                  className="bg-[#00878a] hover:bg-[#0f4c5c] text-white px-8 py-4 rounded-lg font-bold transition-all shadow-xl flex items-center gap-2"
                >
                  {slide.button_text} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Kontrol Butonları (Sadece birden fazla slayt varsa) */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prev} 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
            aria-label="Önceki"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button 
            onClick={next} 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
            aria-label="Sonraki"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          
          {/* İndikatörler */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-8 bg-[#00878a]" : "w-2 bg-white/30"
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}