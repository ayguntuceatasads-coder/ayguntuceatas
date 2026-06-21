"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Phone, Mail, MapPin, ArrowRight, Shield } from "lucide-react";

export default function Footer() {
  const [services, setServices] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // 1. Hizmet başlıklarını dinamik olarak çekiyoruz (İlk 5 Hizmet)
        const { data: servicesData } = await supabase
          .from("services")
          .select("title, slug")
          .limit(5);
        if (servicesData) setServices(servicesData);

        // 2. İletişim ve genel site ayarlarını site_settings tablosundan çekiyoruz
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();
        if (settingsData) setSettings(settingsData);
      } catch (err) {
        console.error("Footer veri çekme hatası:", err);
      }
    };

    fetchFooterData();
  }, []);

  // Telefon linki için boşluk temizleme optimizasyonu
  const phoneLink = settings?.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : "#";

  // Kurumsal başlık ve açıklama için yedekli (fallback) yapı
  const clinicTitle = settings?.clinic_name || "Uzm. Psk. Aygün Tuçe Ataş Önç";
  const clinicDesc = settings?.about_summary || "Antalya'da online ve yüz yüze psikoterapi, EMDR terapisi ve kurumsal danışmanlık hizmetleri sunan modern psikoloji kliniği.";

  return (
    <footer className="bg-[#082b34] text-slate-300 border-t border-slate-800/60 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        
        {/* 1. KISIM: Sol Baş Alan (Genel Ayarlardan Gelen Başlık ve Tanım) */}
        <div className="space-y-4">
          <h3 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2">
            <span className="text-[#6ec9c9]">●</span> {clinicTitle}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {clinicDesc}
          </p>
          <div className="pt-2 flex gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800/60 text-[#6ec9c9] px-2.5 py-1 rounded-md border border-slate-700/50">
              Psikolog v2.0
            </span>
          </div>
        </div>

        {/* 2. KISIM: Hizmet Başlıkları (Dinamik ve Otomatik Bağlantılar) */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Uzmanlık Alanları</h4>
          <ul className="space-y-2.5 text-sm">
            {services.length > 0 ? (
              services.map((service, idx) => (
                <li key={idx}>
                  <Link 
                    href={`/hizmetlerimiz/${service.slug}`} 
                    className="hover:text-[#6ec9c9] transition-colors flex items-center group gap-1 text-slate-400"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-[#6ec9c9] group-hover:translate-x-0.5 transition-all shrink-0" />
                    <span className="truncate">{service.title}</span>
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/hizmetlerimiz" className="hover:text-[#6ec9c9] text-slate-400 transition-colors">Yetişkin Terapisi</Link></li>
                <li><Link href="/hizmetlerimiz" className="hover:text-[#6ec9c9] text-slate-400 transition-colors">EMDR Terapisi</Link></li>
                <li><Link href="/hizmetlerimiz" className="hover:text-[#6ec9c9] text-slate-400 transition-colors">Bireysel Terapi</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* 3. KISIM: Yasal Belgeler (CMS Paneline Bağlı Rotalar) */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">Kurumsal & Yasal</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>
              <Link href="/yasal/aydinlatma-metni" className="hover:text-[#6ec9c9] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#6ec9c9]/60" /> Aydınlatma Metni
              </Link>
            </li>
            <li>
              <Link href="/yasal/cerez-politikasi" className="hover:text-[#6ec9c9] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#6ec9c9]/60" /> Çerez Politikası
              </Link>
            </li>
            <li>
              <Link href="/yasal/gizlilik-politika" className="hover:text-[#6ec9c9] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#6ec9c9]/60" /> Gizlilik Politikası
              </Link>
            </li>
            <li>
              <Link href="/yasal/kullanim-sartlari" className="hover:text-[#6ec9c9] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#6ec9c9]/60" /> Kullanım Şartları
              </Link>
            </li>
            <li>
              <Link href="/yasal/veri-basvuru-formu" className="hover:text-[#6ec9c9] transition-colors flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#6ec9c9]/60" /> Kişisel Veri Başvuru Formu
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. KISIM: İletişim Bilgileri (YENİ: site_settings Tablosundan Tamamen Dinamik) */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">İletişim & Ulaşım</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#6ec9c9] mt-0.5 shrink-0" />
              <span className="leading-relaxed">{settings?.address || "Yükleniyor..."}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#6ec9c9] shrink-0" />
              <a href={phoneLink} className="hover:text-white transition-colors">
                {settings?.phone || "Yükleniyor..."}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#6ec9c9] shrink-0" />
              <a href={`mailto:${settings?.email}`} className="hover:text-white transition-colors">
                {settings?.email || "Yükleniyor..."}
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* ALT ŞERİT: Altyapı ve Telif İmza Alanı */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
        <div>
          © {new Date().getFullYear()} {clinicTitle}. Tüm Hakları Saklıdır.
        </div>
        <div className="flex items-center gap-1">
          <span>Altyapı:</span>
          <a 
            href="https://www.eladesign.org" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-[#6ec9c9] font-bold transition-colors border-b border-dashed border-slate-600 hover:border-[#6ec9c9] pb-0.5"
          >
            Ela Teknoloji
          </a>
        </div>
      </div>

    </footer>
  );
}