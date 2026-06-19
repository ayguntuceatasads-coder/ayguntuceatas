import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. Ayarları çek (Hero için)
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

  // 2. Son eklenen 3 hizmeti çek
  const { data: services } = await supabase.from('services').select('*').order('created_at', { ascending: false }).limit(3);

  return (
    <div className="flex flex-col">
      
      {/* --- SECTION 1: DİNAMİK HERO (ADMİNDEN GÜNCELLENİR) --- */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-[#082b34]">
        {/* Arka Plan Resmi */}
        <div className="absolute inset-0">
          <img 
            src={settings?.hero_image_url || "https://images.unsplash.com/photo-1527689368864-3a821dbccc48?q=80&w=2070"} 
            className="w-full h-full object-cover opacity-60 scale-105"
            alt="Klinik Psikolog"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#082b34] via-[#082b34]/70 to-transparent"></div>
        </div>

        <div className="container relative mx-auto px-4 md:px-8 z-10 max-w-7xl">
          <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00878a]/20 border border-[#00878a]/30 text-[#6ec9c9] text-sm font-bold tracking-widest mb-6">
              ANTALYA PSİKOLOJİK DANIŞMANLIK
            </span>
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-6">
              {settings?.hero_title || 'Ruh Sağlığınızda Güvenilir Rehberiniz'}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
              {settings?.hero_subtitle || 'Antalya’da uzman kadromuzla, bilimsel ve etik ilkeler ışığında yanınızdayız.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/randevu" className="bg-[#00878a] hover:bg-[#0f4c5c] text-white px-8 py-4 rounded-lg font-bold transition-all shadow-xl shadow-[#00878a]/20 flex items-center gap-2">
                Hemen Randevu Al <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/hizmetlerimiz" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-lg font-bold transition-all backdrop-blur-md">
                Hizmetlerimizi İncele
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: HİZMETLER ÖNİZLEME --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-[#00878a] font-bold text-sm tracking-widest uppercase mb-3 block">UZMANLIKLARIMIZ</span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#082b34]">Size Nasıl Yardımcı Olabiliriz?</h2>
            </div>
            <Link href="/hizmetlerimiz" className="text-[#00878a] font-bold flex items-center gap-2 group">
              Tüm Hizmetleri Gör <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Link href={`/hizmetlerimiz/${service.slug}`} key={service.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
                <div className="relative h-64">
                  <img src={service.image_url || "/images/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={service.title} />
                  <div className="absolute inset-0 bg-[#082b34]/20 group-hover:bg-[#082b34]/40 transition-colors"></div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-[#082b34] mb-3 group-hover:text-[#00878a] transition-colors">{service.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: NEDEN BİZ? --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#6ec9c9]/10 rounded-full -z-10"></div>
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974" className="rounded-3xl shadow-2xl" alt="Terapi Süreci" />
              <div className="absolute -bottom-10 -right-10 bg-[#00878a] p-8 rounded-2xl text-white shadow-xl hidden md:block">
                <HeartPulse className="w-10 h-10 mb-4" />
                <p className="text-2xl font-bold">23+ Yıl</p>
                <p className="text-sm opacity-80">Klinik Deneyim</p>
              </div>
            </div>
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-[#082b34] leading-tight">Bilimsel Temelli ve Etik <br /> Terapi Yaklaşımı</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Her danışanımızın hikayesi benzersizdir. Biz de bu benzersizliğe saygı duyarak, EMDR ve Kognitif Davranışçı Terapi gibi kanıta dayalı yöntemlerle kalıcı iyileşmeyi hedefliyoruz.
              </p>
              <div className="space-y-4">
                {[
                  "Uluslararası Akredite Terapi Ekolleri",
                  "Tam Gizlilik ve Etik Standartlar",
                  "Kişiye Özel Yapılandırılmış Süreçler",
                  "Online ve Yüz Yüze Seans Seçenekleri"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#082b34] font-semibold">
                    <CheckCircle2 className="w-6 h-6 text-[#00878a]" /> {item}
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Link href="/hakkimda" className="inline-flex items-center gap-2 font-bold text-[#00878a] border-b-2 border-[#00878a] pb-1 hover:text-[#5e338d] hover:border-[#5e338d] transition-all">
                  Uzmanımız Hakkında Daha Fazla Bilgi <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}