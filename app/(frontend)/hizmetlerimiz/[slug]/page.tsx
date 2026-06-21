import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

// YENİDEN DOĞRULAMA (Hızlı sayfa yüklenmesi için)
export const revalidate = 60;

// Next.js 15+ uyumlu Params tipi (Promise bazlı)
type Props = {
  params: Promise<{ slug: string }>;
};

// 1. DİNAMİK METADATA (Her hizmet için özel Google başlığı ve açıklaması)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .maybeSingle();

  if (!service) return { title: "Hizmet Bulunamadı | Uzm. Psk. Aygün Tuçe Ataş Önç" };

  return { 
    title: `${service.title} | Uzm. Psk. Aygün Tuçe Ataş Önç`,
    description: service.short_description || service.description || `${service.title} hakkında detaylı bilgi ve profesyonel psikoterapi süreçleri.`,
    openGraph: {
      title: `${service.title} | Antalya Psikolog`,
      description: service.short_description || service.description,
      url: `https://www.ayguntuceatas.com/hizmetlerimiz/${service.slug}`,
      siteName: "Aygün Tuçe Ataş Önç Psikoloji Kliniği",
      locale: "tr_TR",
      type: "article",
    }
  };
}

export default async function SingleServicePage({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .maybeSingle();

  // Hizmet bulunamazsa direkt Next.js'in 404 sayfasına gönder
  if (!service) notFound();

  // 2. GOOGLE SCHEMA (JSON-LD) - Terapi / Sağlık Prosedürü İşaretlemesi
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "TherapeuticProcedure",
    "name": service.title,
    "description": service.short_description || service.description,
    "url": `https://www.ayguntuceatas.com/hizmetlerimiz/${service.slug}`,
    "provider": {
      "@type": "MedicalClinic",
      "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Antalya",
        "addressCountry": "TR"
      }
    }
  };

  return (
    <>
      {/* Schema'yı DOM'a Enjekte Ediyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      
      <div className="min-h-screen bg-[#F8F9FA] pb-32">
        <PageHero 
          title={service.title} 
          breadcrumbs={[
            { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
            { label: service.title }
          ]}
          bgImage={service.image_url || "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000"}
        />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl -mt-16 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* SOL ALAN: Hizmet İçeriği */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-14">
              <Link href="/hizmetlerimiz" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#00878a] transition-colors mb-10">
                <ArrowLeft className="w-4 h-4" /> Tüm Hizmetlere Dön
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold text-[#082b34] mb-8">{service.title}</h1>
              
              {/* Daha önce dışarıda kalan div bloğunu buraya güvenli şekilde entegre ettik */}
              <div className="prose prose-lg prose-slate max-w-none prose-headings:text-[#082b34] prose-a:text-[#00878a] prose-strong:text-[#082b34]">
                {service.content ? (
                  <div dangerouslySetInnerHTML={{ 
                    __html: service.content.replace(/&nbsp;|\u00A0/g, ' ') 
                  }} />
                ) : (
                  <p>{service.description}</p>
                )}
              </div>
            </div>

            {/* SAĞ ALAN: Hızlı Randevu Kartı */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-[#082b34] rounded-3xl p-8 text-white shadow-2xl">
                <div className="w-16 h-16 bg-[#00878a] rounded-2xl flex items-center justify-center mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Profesyonel Destek Alın</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                  {service.title} süreci hakkında detaylı bilgi almak veya ilk seansınızı planlamak için bizimle iletişime geçebilirsiniz.
                </p>
                <Link href="/randevu" className="block w-full text-center bg-[#00878a] hover:bg-white hover:text-[#082b34] text-white font-bold py-4 rounded-xl transition-all duration-300">
                  Hemen Randevu Al
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}