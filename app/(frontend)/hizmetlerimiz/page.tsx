import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Brain, User, Users, Baby, Activity, Heart } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hizmetlerimiz | Uzm. Psk. Aygün Tuce Ataş",
  description: "Antalya kliniğimizde yetişkin, çocuk, ergen, çift ve aile terapisi alanlarında sunduğumuz profesyonel psikolojik danışmanlık hizmetleri.",
};

function ServiceIcon({ name }: { name: string }) {
  const iconMap: { [key: string]: React.ReactNode } = {
    user: <User className="w-6 h-6" />,
    baby: <Baby className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />,
    activity: <Activity className="w-6 h-6" />,
    brain: <Brain className="w-6 h-6" />,
    heart: <Heart className="w-6 h-6" />,
  };
  return iconMap[name.toLowerCase()] || <Brain className="w-6 h-6" />;
}

export default async function ServicesListPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <PageHero 
        title="Terapi Hizmetlerimiz" 
        breadcrumbs={[{ label: "Hizmetlerimiz" }]}
        bgImage="https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2070"
      />

      <section className="container mx-auto px-4 md:px-8 max-w-7xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img src={service.image_url || "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=600"} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5e338d]/10 to-transparent"></div>
                <div className="absolute -bottom-6 left-6 w-12 h-12 bg-[#00878a] text-white rounded-xl flex items-center justify-center shadow-lg z-10">
                  <ServiceIcon name={service.icon_name || "brain"} />
                </div>
              </div>
              <div className="p-6 pt-10 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#082b34] mb-3 group-hover:text-[#5e338d] transition-colors">{service.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">{service.description}</p>
                </div>
                <Link href={`/hizmetlerimiz/${service.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00878a] hover:text-[#5e338d] transition-colors group/link mt-auto w-fit">
                  Detayları İncele <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}