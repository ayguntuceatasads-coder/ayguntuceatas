import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

// YENİDEN DOĞRULAMA (Sayfa hızını artırır ve güncelliği korur)
export const revalidate = 60;

// 1. ZENGİNLEŞTİRİLMİŞ METADATA (Arama Motoru Optimizasyonu)
export const metadata: Metadata = {
  title: "Uzmanlık Alanlarımız & Hizmetler | Uzm. Psk. Aygün Tuçe Ataş Önç",
  description: "Antalya'da uyguladığımız EMDR Terapisi, Kognitif Davranışçı Terapi, Bireysel Yetişkin ve Ergen Terapisi gibi profesyonel klinik uzmanlık alanlarımızı detaylı inceleyin.",
  keywords: ["Antalya psikoterapi hizmetleri", "EMDR terapisi Antalya", "Yetişkin terapisi", "Ergen psikoloğu", "Bireysel terapi", "Klinik uzmanlık alanları"],
  openGraph: {
    title: "Uzmanlık Alanlarımız | Aygün Tuçe Ataş Önç Kliniği",
    description: "Kliniğimizde sunulan profesyonel psikoterapi ve danışmanlık hizmetlerini keşfedin.",
    url: "https://www.ayguntuceatas.com/hizmetlerimiz",
    siteName: "Aygün Tuçe Ataş Önç Psikoloji Kliniği",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: "https://www.ayguntuceatas.com/hizmetlerimiz",
  }
};

export default async function ServicesArchivePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. GOOGLE SCHEMA (JSON-LD) - Hizmet Listesi (ItemList) İşaretlemesi
  // Bu sayede Google arama sonuçlarında hizmetleriniz alt başlıklar halinde çıkabilir.
  const serviceItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": services?.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "name": service.title,
        "description": service.short_description || service.description || "Profesyonel psikolojik danışmanlık hizmeti.",
        "url": `https://www.ayguntuceatas.com/hizmetlerimiz/${service.slug}`,
        "provider": {
          "@type": "MedicalClinic",
          "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği"
        }
      }
    })) || []
  };

  return (
    <>
      {/* Schema'yı DOM'a Enjekte Ediyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceItemListSchema) }}
      />

      <div className="min-h-screen bg-[#F8F9FA] pb-32">
        <PageHero 
          title="Uzmanlık Alanlarımız" 
          breadcrumbs={[{ label: "Hizmetlerimiz" }]}
          bgImage="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000"
        />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Link 
                href={`/hizmetlerimiz/${service.slug}`} 
                key={service.id} 
                className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:-translate-y-2 transition-all duration-500"
              >
                {/* 3. RESİM OPTİMİZASYONU (Next/Image ile WebP/AVIF formatı sağlandı) */}
                <div className="relative h-64 shrink-0 overflow-hidden bg-slate-100">
                  <Image 
                    src={service.image_url || "https://images.unsplash.com/photo-1544027993-37db48d5f06d?q=80&w=800"} 
                    alt={service.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-[#082b34]/10 group-hover:bg-[#082b34]/30 transition-colors duration-500"></div>
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="text-2xl font-bold text-[#082b34] mb-4 group-hover:text-[#00878a] transition-colors">{service.title}</h2>
                  <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-4">
                    {service.short_description || service.description}
                  </p>
                  <div className="flex items-center gap-2 text-[#00878a] font-bold text-sm tracking-wide mt-auto">
                    Detaylı İncele <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}