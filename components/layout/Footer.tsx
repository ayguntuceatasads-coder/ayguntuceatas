import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Aygün Tuce Ataş</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Antalya'da uzman psikolog olarak yetişkin, çocuk, ergen, aile ve çift terapisi hizmetleri vermektedir.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/hakkimda" className="hover:text-slate-900">Hakkımda</Link></li>
              <li><Link href="/hizmetlerimiz" className="hover:text-slate-900">Hizmetlerimiz</Link></li>
              <li><Link href="/yazilarimiz" className="hover:text-slate-900">Blog & Yazılar</Link></li>
              <li><Link href="/iletisim" className="hover:text-slate-900">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>Antalya, Türkiye</li>
              <li>info@ayguntuceatas.com</li>
              {/* Telefon numarasını buraya ekleyebiliriz */}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Aygün Tuce Ataş. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}