import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BrainCircuit } from "lucide-react";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. GOOGLE SEO İÇİN DİNAMİK META VERİSİ ÜRETİMİ
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: service } = await supabase
    .from('services')
    .select('title, description, seo_title, seo_description')
    .eq('slug', resolvedParams.slug)
    .single();

  if (!service) return { title: 'Hizmet Bulunamadı' };

  return {
    // Admin'den SEO başlığı girilmişse onu, girilmemişse standart başlığı kullan
    title: service.seo_title || `${service.title} | Uzm. Psk. Aygün Tuce Ataş`,
    description: service.seo_description || service.description,
  };
}

// 2. SAYFA İÇERİĞİ
export default async function ServiceDetail({ params }: Props) {
  const resolvedParams = await params;
  
  const { data: service, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .single();

  if (error || !service) notFound();

  return (
    <article className="min-h-screen bg-white pb-24 flex flex-col">
      
      {/* YENİ HERO VE BREADCRUMB BİLEŞENİ */}
      <PageHero 
        title={service.title}
        bgImage={service.image_url || undefined}
        breadcrumbs={[
          { label: "Hizmetlerimiz", href: "/hizmetlerimiz" },
          { label: service.title }
        ]}
      />

      {/* İÇERİK ALANI */}
      <div className="container mx-auto px-4 md:px-8 max-w-4xl -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
          
          <div className="mb-10 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-3 text-[#0f4c5c] mb-4 bg-[#6ec9c9]/10 px-4 py-1.5 rounded-full w-fit text-sm font-semibold">
              <BrainCircuit className="w-5 h-5 text-[#00878a]" />
              PSİKOLOJİK DANIŞMANLIK
            </div>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
              {service.description}
            </p>
          </div>

          <div className="prose prose-lg prose-slate prose-headings:text-[#082b34] prose-a:text-[#00878a] hover:prose-a:text-[#6ec9c9] prose-img:rounded-xl max-w-none">
            {service.content ? (
              <div dangerouslySetInnerHTML={{ __html: service.content }} />
            ) : (
              <div className="text-slate-500 bg-slate-50 p-8 rounded-xl border border-dashed border-slate-200 text-center italic">
                Bu hizmetin detaylı içeriği henüz eklenmedi.
              </div>
            )}
          </div>

          {/* Aksiyon Formu (CTA) */}
          <div className="mt-16 bg-[#082b34] rounded-2xl p-8 text-center text-white shadow-xl shadow-[#082b34]/10">
            <h3 className="text-2xl font-bold mb-3">Uzman Desteği Almaya Hazır mısınız?</h3>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm leading-relaxed">
              <strong>{service.title}</strong> konusunda detaylı bilgi almak veya seans planlamak için bizimle iletişime geçin.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/randevu" className="px-8 py-3.5 bg-[#00878a] text-white font-bold rounded-lg hover:bg-[#5e338d] transition-all shadow-md">
                Randevu Talep Et
              </Link>
            </div>
          </div>
          
        </div>
      </div>

    </article>
  );
}