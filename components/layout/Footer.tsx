"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Phone, Mail, MapPin, ArrowRight, Shield, Heart } from "lucide-react";

export default function Footer() {
  const [services, setServices] = useState<any[]>([]);
  const [aboutText, setAboutText] = useState({
    title: "Uzm. Psk. Aygün Tuçe Ataş Önç",
    description: "Antalya'da online ve yüz yüze psikoterapi, EMDR terapisi ve kurumsal danışmanlık hizmetleri sunan modern psikoloji kliniği."
  });

  useEffect(() => {
    // Hizmet başlıklarını veritabanından dinamik ve otomatik çekiyoruz
    const fetchFooterData = async () => {
      // 1. Hizmetleri çek (Footer için en güncel ilk 5 hizmet)
      const { data: servicesData } = await supabase
        .from("services")
        .select("title, slug")
        .limit(5);
      
      if (servicesData) setServices(servicesData);

      // 2. Eğer genel ayarlardan firma bilgisi çekmek isterseniz (Opsiyonel)
      const { data: settingsData } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "footer_about")
        .single();
      
      if (settingsData?.value) {
        setAboutText(settingsData.value);
      }
    };

    fetchFooterData();
  }, []);

  return (
    <footer className="bg-[#082b34] text-slate-300 border-t border-slate-800/60 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        
        {/* 1. KISIM: Sol Baş Alan (Adminden/Veritabanından Gelen Başlık ve Tanım) */}
        <div className="space-y-4">
          <h3 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2">
            <span className="text-[#6ec9c9]">●</span> {aboutText.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {aboutText.description}
          </p>
          <div className="pt-2 flex gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800/60 text-[#6ec9c9] px-2.5 py-1 rounded-md border border-slate-700/50">
              Klinik v2.0
            </span>
          </div>
        </div>

        {/* 2. KISIM: Hizmet Başlıkları (Veritabanından Otomatik Gelen Dinamik Linkler) */}
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
              // Veritabanı boşsa veya yükleniyorsa yedek şık listeleme
              <>
                <li><Link href="/hizmetlerimiz/yetiskin-terapisi" className="hover:text-[#6ec9c9] text-slate-400 transition-colors">Yetişkin Terapisi</Link></li>
                <li><Link href="/hizmetlerimiz/online-terapi-online-emdr-terapi" className="hover:text-[#6ec9c9] text-slate-400 transition-colors">EMDR Terapisi</Link></li>
                <li><Link href="/hizmetlerimiz/bireysel-terapi" className="hover:text-[#6ec9c9] text-slate-400 transition-colors">Bireysel Terapi</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* 3. KISIM: Yasal Belgeler (CMS Paneline Bağlı Dinamik URL Yapısı) */}
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

        {/* 4. KISIM: İletişim Bilgileri (Sabit & Kurumsal) */}
        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">İletişim & Ulaşım</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#6ec9c9] mt-0.5 shrink-0" />
              <span className="leading-relaxed">Fener Mh. Bülent Ecevit Bulvarı, No: 44, Muratpaşa / Antalya</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#6ec9c9] shrink-0" />
              <a href="tel:+905000000000" className="hover:text-white transition-colors">+90 (5xx) xxx xx xx</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#6ec9c9] shrink-0" />
              <a href="mailto:info@ayguntuceatas.com" className="hover:text-white transition-colors">info@ayguntuceatas.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* ALT ŞERİT: Telif Hakları ve ELA Teknoloji Yeni Sekme Altyapı Linki */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
        <div>
          © {new Date().getFullYear()} {aboutText.title}. Tüm Hakları Saklıdır.
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