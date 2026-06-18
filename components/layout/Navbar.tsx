import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold tracking-tight text-slate-900">
          Aygün Tuce Ataş
        </Link>

        {/* Masaüstü Menü */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-slate-900 transition-colors">Anasayfa</Link>
          <Link href="/hakkimda" className="hover:text-slate-900 transition-colors">Hakkımda</Link>

          {/* Hizmetlerimiz Dropdown */}
          <div className="relative group py-2">
            <Link href="/hizmetlerimiz" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              Hizmetlerimiz
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </Link>
            <div className="absolute top-full left-0 hidden w-48 flex-col bg-white border rounded-md shadow-lg group-hover:flex">
              <Link href="/hizmetlerimiz/yetiskin-terapisi" className="px-4 py-2 hover:bg-slate-50 transition-colors">Yetişkin Terapisi</Link>
              <Link href="/hizmetlerimiz/cocuk-terapisi" className="px-4 py-2 hover:bg-slate-50 transition-colors">Çocuk Terapisi</Link>
              <Link href="/hizmetlerimiz/ergen-terapisi" className="px-4 py-2 hover:bg-slate-50 transition-colors">Ergen Terapisi</Link>
              <Link href="/hizmetlerimiz/aile-terapisi" className="px-4 py-2 hover:bg-slate-50 transition-colors">Aile Terapisi</Link>
              <Link href="/hizmetlerimiz/cift-terapisi" className="px-4 py-2 hover:bg-slate-50 transition-colors">Çift Terapisi</Link>
              <Link href="/hizmetlerimiz/psikolojik-testler" className="px-4 py-2 hover:bg-slate-50 transition-colors">Psikolojik Testler</Link>
            </div>
          </div>

          {/* Yazılarımız Dropdown */}
          <div className="relative group py-2">
            <Link href="/yazilarimiz" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              İçerikler
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </Link>
            <div className="absolute top-full left-0 hidden w-40 flex-col bg-white border rounded-md shadow-lg group-hover:flex">
              <Link href="/yazilarimiz" className="px-4 py-2 hover:bg-slate-50 transition-colors">Yazılar</Link>
              <Link href="/kitaplarimiz" className="px-4 py-2 hover:bg-slate-50 transition-colors">Kitaplar</Link>
              <Link href="/videolarimiz" className="px-4 py-2 hover:bg-slate-50 transition-colors">Videolar</Link>
            </div>
          </div>

          <Link href="/iletisim" className="hover:text-slate-900 transition-colors">İletişim</Link>
        </nav>

        {/* Randevu Butonu (Opsiyonel ama dönüşüm için iyi olur) */}
        <div className="hidden md:block">
          <Link href="/iletisim" className="bg-slate-900 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">
            Randevu Al
          </Link>
        </div>

        {/* Mobil Menü İkonu (Burayı daha sonra Shadcn Sheet ile detaylandıracağız) */}
        <button className="md:hidden p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </header>
  );
}