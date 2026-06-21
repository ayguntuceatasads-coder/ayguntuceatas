"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, CalendarPlus, ChevronRight, MessageSquare, AlertCircle, ChevronLeft } from "lucide-react";
import Image from "next/image"; // Görsel optimizasyonu için eklendi

export default function HomeClient({ initialData }: { initialData: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const data = initialData; // Veriler artık sunucudan hazır (SEO uyumlu) geliyor

  const slides = data.settings?.hero_slides || [];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [slides.length, currentSlide]); 

  return (
    <main className="min-h-screen bg-slate-50 overflow-hidden">
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen bg-[#061d24] overflow-hidden group">
        
        {slides.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#082b34] text-white z-50 px-4 text-center">
            <AlertCircle className="w-16 h-16 text-amber-400 mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Anasayfa İçerikleri Bekleniyor</h2>
            <p className="text-slate-400">Eğer admin panelinden veri eklediyseniz, tarayıcı önbelleğinizi temizleyin (CTRL + F5).</p>
          </div>
        )}

        {slides.map((slide: any, index: number) => (
          <div 
            key={index} 
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-110 z-0"}`}
          >
            <div className="absolute inset-0">
              <Image 
                src={slide.image || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"} 
                alt="Klinik Hero" 
                fill
                priority={index === 0} // İlk görseli anında yükle (LCP SEO)
                className="w-full h-full object-cover filter blur-[5px] brightness-[0.40] scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#082b34]/85 via-black/30 to-transparent"></div>
            </div>
            
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12 lg:px-24 max-w-7xl mx-auto w-full">
              <div className="max-w-3xl space-y-8 text-left">
                <span className="inline-block text-[#6ec9c9] font-bold text-sm tracking-widest uppercase bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
                  Özel Sağlık Meslek Hizmet Birimi
                </span>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
                  {slide.title}
                </h1>
                
                <p className="text-lg md:text-2xl text-slate-200 drop-shadow-lg font-medium leading-relaxed max-w-2xl">
                  {slide.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5 justify-start pt-6">
                  <Link href="/randevu" className="bg-[#00878a] text-white px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-[#6ec9c9] hover:text-[#082b34] transition-all transform hover:-translate-y-1 shadow-2xl shadow-[#00878a]/30 flex items-center justify-center gap-3">
                    <CalendarPlus className="w-6 h-6" /> Hemen Randevu Al
                  </Link>
                  <Link href="/iletisim" className="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white px-10 py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg hover:bg-white hover:text-[#082b34] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 shadow-xl">
                    <MessageSquare className="w-6 h-6" /> Bizimle İletişime Geç
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button onClick={prevSlide} aria-label="Önceki Slayt" className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl">
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <button onClick={nextSlide} aria-label="Sonraki Slayt" className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md border border-white/20 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl">
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            <div className="absolute bottom-12 left-0 right-0 z-30 flex justify-center gap-3">
              {slides.map((_slide: any, i: number) => (
                <button key={i} onClick={() => setCurrentSlide(i)} aria-label={`Slayt ${i + 1}`} className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? "bg-[#6ec9c9] w-12" : "bg-white/30 w-4 hover:bg-white/60"}`}></button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. HİZMETLER CAROUSEL */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#082b34] tracking-tight">Uzmanlık Alanları</h2>
            <p className="text-slate-500 mt-2 text-base">Merkezimizde aktif olarak verilen profesyonel terapi hizmetleri.</p>
          </div>
          <Link href="/hizmetlerimiz" className="hidden md:flex text-[#00878a] font-bold items-center gap-1 hover:gap-2 transition-all">Tümünü Gör <ArrowRight className="w-4 h-4" /></Link>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {data.services.map((service: any) => (
            <div key={service.id} className="min-w-[85vw] md:min-w-[calc(33.333%-1rem)] snap-start bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
              <div className="h-56 overflow-hidden relative">
                <Image src={service.image_url || "https://images.unsplash.com/photo-1544027993-37db48d5f06d"} alt={service.title} fill sizes="(max-width: 768px) 85vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-[#082b34] mb-3">{service.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3 mb-6 flex-1">{service.short_description || "Detaylı bilgi ve danışmanlık süreci için tıklayın."}</p>
                <Link href={`/hizmetlerimiz/${service.slug}`} className="text-[#00878a] font-bold flex items-center justify-between group-hover:text-[#082b34] transition-colors pt-2 border-t border-slate-50">
                  Detaylı İncele <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GÜNCEL YAZILAR CAROUSEL */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-white rounded-[3.5rem] shadow-sm border border-slate-100/80 my-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#082b34] tracking-tight">Güncel Yazılar & Makaleler</h2>
            <p className="text-slate-500 mt-2 text-base">Ruh sağlığı, farkındalık ve güncel psikoloji okumaları.</p>
          </div>
          <Link href="/yazilarimiz" className="hidden md:flex text-[#00878a] font-bold items-center gap-1 hover:gap-2 transition-all">Tüm Yazılar <ArrowRight className="w-4 h-4" /></Link>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {data.posts.map((post: any) => (
            <div key={post.id} className="min-w-[85vw] md:min-w-[calc(33.333%-1rem)] snap-start bg-slate-50 rounded-3xl border border-slate-200/60 overflow-hidden group hover:bg-[#082b34] hover:border-[#082b34] transition-all duration-300 flex flex-col">
              <div className="h-48 w-full overflow-hidden relative bg-slate-200 border-b border-slate-100">
                <Image 
                  src={post.image_url || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800"} 
                  alt={post.title} 
                  fill sizes="(max-width: 768px) 85vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-[#00878a] mb-3 block">Makale / Bilgi</span>
                <h3 className="text-lg font-bold text-[#082b34] group-hover:text-white mb-2 line-clamp-2 transition-colors">{post.title}</h3>
                <p className="text-slate-500 group-hover:text-slate-300 text-sm line-clamp-3 mb-6 flex-1 transition-colors">{post.summary || "İçeriğin tamamını okumak için tıklayın."}</p>
                <Link href={`/yazilarimiz/${post.slug}`} className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-[#082b34] group-hover:bg-[#00878a] group-hover:text-white group-hover:border-[#00878a] flex items-center justify-center transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HAKKIMIZDA ÖZETİ */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2 relative h-[400px]">
          <div className="absolute -inset-4 bg-[#00878a]/10 rounded-[3rem] -z-10 transform rotate-2"></div>
          <Image src={data.settings?.about_image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000"} alt="Hakkımızda Özet" fill className="rounded-[3rem] shadow-xl object-cover" />
        </div>
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#082b34] tracking-tight mb-6">{data.settings?.about_title || "Hakkımızda"}</h2>
          <p className="text-slate-600 leading-relaxed text-base md:text-lg mb-8 whitespace-pre-wrap">{data.settings?.about_text || "Hakkımızda içerikleri yükleniyor..."}</p>
          <Link href="/hakkimda" className="inline-block border-2 border-[#082b34] text-[#082b34] px-8 py-3 rounded-xl font-bold hover:bg-[#082b34] hover:text-white transition-colors">
            Detaylı Kurumsal Bilgi
          </Link>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="bg-gradient-to-r from-[#082b34] to-[#0f4c5c] py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">{data.settings?.cta_title || "Bizimle İletişime Geçin"}</h2>
          <p className="text-slate-300 text-base md:text-lg mb-10 max-w-2xl mx-auto">{data.settings?.cta_text || "Randevu ve bilgi almak için aşağıdaki butonları kullanabilirsiniz."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/iletisim" className="w-full sm:w-auto bg-white text-[#082b34] px-8 py-4 rounded-xl font-bold text-base hover:bg-[#6ec9c9] transition-all flex items-center justify-center gap-2 shadow-lg">
              <PhoneCall className="w-4 h-4 text-[#00878a]" /> Bizimle İletişime Geç
            </Link>
            <Link href="/randevu" className="w-full sm:w-auto bg-[#00878a] text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white hover:text-[#082b34] transition-all flex items-center justify-center gap-2 border border-white/10 shadow-lg">
              <CalendarPlus className="w-4 h-4" /> Randevu Talebi Oluştur
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}