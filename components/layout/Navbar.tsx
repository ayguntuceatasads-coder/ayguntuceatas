"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Client supabase istemcini kullanıyoruz
import { Menu, X } from "lucide-react"; // İkonlar için

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/logo/logo.png');

  useEffect(() => {
    // Logo'yu client tarafında çekiyoruz
    async function fetchLogo() {
      const { data } = await supabase
        .from('site_settings')
        .select('logo_url')
        .eq('id', 1)
        .maybeSingle();
      if (data?.logo_url) setLogoSrc(data.logo_url);
    }
    fetchLogo();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* LOGO ALANI */}
        <Link href="/" className="flex items-center">
          <img 
            src={logoSrc} 
            alt="Uzm. Psk. Aygün Tuce Ataş" 
            className="h-12 w-auto object-contain" 
          />
        </Link>

        {/* Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#082b34]">
          <Link href="/" className="hover:text-[#00878a] transition-colors">Anasayfa</Link>
          <Link href="/hakkimda" className="hover:text-[#00878a] transition-colors">Hakkımda</Link>

          {/* Hizmetlerimiz Dropdown */}
          <div className="relative group py-2">
            <Link href="/hizmetlerimiz" className="hover:text-[#00878a] transition-colors flex items-center gap-1">
              Hizmetlerimiz
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <div className="absolute top-full left-0 hidden w-56 flex-col bg-white border border-slate-100 rounded-lg shadow-xl py-2 group-hover:flex z-50">
              <Link href="/hizmetlerimiz/yetiskin-terapisi" className="px-4 py-2.5 hover:bg-slate-50 text-[#082b34] hover:text-[#00878a] transition-colors">Yetişkin Terapisi</Link>
              <Link href="/hizmetlerimiz/cocuk-terapisi" className="px-4 py-2.5 hover:bg-slate-50 text-[#082b34] hover:text-[#00878a] transition-colors">Çocuk Terapisi</Link>
              <Link href="/hizmetlerimiz/ergen-terapisi" className="px-4 py-2.5 hover:bg-slate-50 text-[#082b34] hover:text-[#00878a] transition-colors">Ergen Terapisi</Link>
              <Link href="/hizmetlerimiz/aile-terapisi" className="px-4 py-2.5 hover:bg-slate-50 text-[#082b34] hover:text-[#00878a] transition-colors">Aile Terapisi</Link>
              <Link href="/hizmetlerimiz/cift-terapisi" className="px-4 py-2.5 hover:bg-slate-50 text-[#082b34] hover:text-[#00878a] transition-colors">Çift Terapisi</Link>
              <Link href="/hizmetlerimiz/psikolojik-testler" className="px-4 py-2.5 hover:bg-slate-50 text-[#082b34] hover:text-[#00878a] transition-colors">Psikolojik Testler</Link>
            </div>
          </div>

          <Link href="/sikca-sorulan-sorular" className="hover:text-[#00878a] transition-colors">S.S.S.</Link>
          <Link href="/yazilarimiz" className="hover:text-[#00878a] transition-colors">Yazılarımız</Link>
          <Link href="/iletisim" className="hover:text-[#00878a] transition-colors">İletişim</Link>
        </nav>

        {/* Randevu Butonu */}
        <div className="hidden md:block">
          <Link href="/randevu" className="bg-[#00878a] hover:bg-[#0f4c5c] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all">
            Online Randevu
          </Link>
        </div>

        {/* Mobil Menü Butonu (Çalışır Hale Getirildi) */}
        <button className="md:hidden p-2 text-[#082b34]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobil Menü İçeriği (Yeni Eklendi) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-6 flex flex-col gap-4 text-[#082b34] font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)}>Anasayfa</Link>
          <Link href="/hakkimda" onClick={() => setIsOpen(false)}>Hakkımda</Link>
          <Link href="/hizmetlerimiz" onClick={() => setIsOpen(false)}>Hizmetlerimiz</Link>
          <Link href="/sikca-sorulan-sorular" onClick={() => setIsOpen(false)}>S.S.S.</Link>
          <Link href="/yazilarimiz" onClick={() => setIsOpen(false)}>Yazılarımız</Link>
          <Link href="/iletisim" onClick={() => setIsOpen(false)}>İletişim</Link>
          <Link href="/randevu" className="bg-[#00878a] text-white px-4 py-3 rounded-md text-center mt-2" onClick={() => setIsOpen(false)}>Online Randevu</Link>
        </div>
      )}
    </header>
  );
}