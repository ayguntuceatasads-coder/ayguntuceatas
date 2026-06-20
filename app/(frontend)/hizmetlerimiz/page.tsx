import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Uzm. Psk. Aygün Tuce Ataş",
  description: "EMDR, Kognitif Davranışçı Terapi, Yetişkin ve Ergen Terapisi gibi klinik uzmanlık alanlarımız.",
};

export default async function ServicesArchivePage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from('services').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <PageHero 
        title="Uzmanlık Alanlarımız" 
        breadcrumbs={[{ label: "Hizmetlerimiz" }]}
        bgImage="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <Link href={`/hizmetlerimiz/${service.slug}`} key={service.id} className="group bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col hover:-translate-y-2 transition-all duration-500">
              <div className="relative h-64 shrink-0 overflow-hidden">
                <img 
                  src={service.image_url || "/images/placeholder.jpg"} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={service.title} 
                />
                <div className="absolute inset-0 bg-[#082b34]/10 group-hover:bg-[#082b34]/30 transition-colors duration-500"></div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h2 className="text-2xl font-bold text-[#082b34] mb-4 group-hover:text-[#00878a] transition-colors">{service.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1">{service.description}</p>
                <div className="flex items-center gap-2 text-[#00878a] font-bold text-sm tracking-wide mt-auto">
                  Detaylı İncele <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}