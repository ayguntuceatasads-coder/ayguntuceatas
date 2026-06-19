import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

export default async function Footer() {
  const supabase = await createClient();
  
  // Veritabanından tüm ayarları çekiyoruz
  const { data: settings } = await supabase
    .from('site_settings')
    .select('logo_url, footer_text, phone, email, address, instagram')
    .eq('id', 1)
    .maybeSingle();

  // Telefon linkini uygun formata dönüştür (boşlukları sil)
  const phoneLink = settings?.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : "#";

  return (
    <footer className="bg-[#082b34] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Sütun: Logo ve Kurumsal Yazı (Sol Alt) */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6 bg-white/5 p-2 rounded-xl">
              <img 
                src={settings?.logo_url || '/images/logo/logo.png'} 
                alt="Uzm. Psk. Aygün Tuce Ataş" 
                className="h-12 w-auto object-contain brightness-0 invert opacity-90" 
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 mb-6">
              {settings?.footer_text || "Antalya Muratpaşa'da bilimsel temellere dayanan, etik ve güvenilir psikolojik danışmanlık hizmetleri sunuyoruz."}
            </p>
            {/* Sosyal Medya İkonu (Saf SVG) */}
            {settings?.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-[#5e338d] hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            )}
          </div>

          {/* 2. Sütun: Hızlı Bağlantılar */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li><Link href="/hakkimda" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Hakkımda</Link></li>
              <li><Link href="/hizmetlerimiz" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Terapi Hizmetleri</Link></li>
              <li><Link href="/yazilarimiz" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Psikoloji Makaleleri</Link></li>
              <li><Link href="/iletisim" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> İletişim ve Adres</Link></li>
            </ul>
          </div>

          {/* 3. Sütun: Hizmetlerimiz */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">Uzmanlık Alanları</h3>
            <ul className="space-y-3">
              <li><Link href="/hizmetlerimiz/yetiskin-terapisi" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Yetişkin Terapisi</Link></li>
              <li><Link href="/hizmetlerimiz/ergen-terapisi" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Ergen Terapisi</Link></li>
              <li><Link href="/hizmetlerimiz/cocuk-terapisi" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Çocuk Terapisi</Link></li>
              <li><Link href="/hizmetlerimiz/cift-terapisi" className="text-sm hover:text-[#6ec9c9] transition-colors flex items-center gap-2"><ArrowRight className="w-3 h-3"/> Çift ve Aile Terapisi</Link></li>
            </ul>
          </div>

          {/* 4. Sütun: İletişim Bilgileri (Sağ Alt) */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold text-lg mb-6">İletişim</h3>
            <ul className="space-y-4">
              {settings?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#6ec9c9] shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-400 leading-relaxed">{settings.address}</span>
                </li>
              )}
              {settings?.phone && (
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#6ec9c9] shrink-0" />
                  <a href={phoneLink} className="text-sm text-slate-400 hover:text-white transition-colors">{settings.phone}</a>
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#6ec9c9] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm text-slate-400 hover:text-white transition-colors">{settings.email}</a>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Alt Telif Hakkı (Copyright) Şeridi */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Uzm. Psk. Aygün Tuce Ataş. Tüm hakları saklıdır.</p>
          <p>
            Altyapı: <a href="#" className="text-slate-400 hover:text-[#6ec9c9] transition-colors">ELA Teknoloji & Tasarım</a>
          </p>
        </div>
      </div>
    </footer>
  );
}