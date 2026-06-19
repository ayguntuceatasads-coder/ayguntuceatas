import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Navbar() {
  // Supabase'den ayarları çekip logo URL'sini alıyoruz
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('logo_url')
    .eq('id', 1)
    .maybeSingle();

  // Veritabanında logo yoksa senin belirttiğin dizini varsayılan yapıyoruz
  const logoSrc = settings?.logo_url || '/images/logo/logo.png';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* LOGO ALANI - DİNAMİK */}
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

          <Link href="/yazilarimiz" className="hover:text-[#00878a] transition-colors">Yazılarımız</Link>
          <Link href="/iletisim" className="hover:text-[#00878a] transition-colors">İletişim</Link>
        </nav>

        {/* Sağ Taraf: Randevu Butonu */}
        <div className="hidden md:block">
          {/* Buton rengini logodaki mor tonuyla (veya teal ile) vurgulayabiliriz */}
          <Link href="/randevu" className="bg-[#00878a] hover:bg-[#0f4c5c] text-white px-6 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all">
            Online Randevu
          </Link>
        </div>

        {/* Mobil Menü İkonu */}
        <button className="md:hidden p-2 text-[#082b34]">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}