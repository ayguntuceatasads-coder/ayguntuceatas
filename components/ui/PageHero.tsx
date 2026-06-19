import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  bgImage?: string;
}

export default function PageHero({ 
  title, 
  breadcrumbs, 
  bgImage = "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2070" 
}: PageHeroProps) {
  return (
    <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-[#082b34]">
      {/* Arka Plan Görseli ve Koyu Kaplama */}
      <div className="absolute inset-0">
        <img 
          src={bgImage} 
          alt={title} 
          className="w-full h-full object-cover opacity-25 scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082b34] via-[#082b34]/80 to-transparent"></div>
      </div>

      {/* İçerik: Başlık ve Breadcrumb (Yol İzleri) */}
      <div className="relative z-10 container mx-auto px-4 text-center mt-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          {title}
        </h1>
        
        <nav className="flex items-center justify-center gap-2 text-sm font-medium text-slate-300 flex-wrap">
          <Link href="/" className="flex items-center gap-1.5 hover:text-[#6ec9c9] transition-colors">
            <Home className="w-4 h-4" /> Anasayfa
          </Link>
          
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-slate-500" />
              {item.href ? (
                <Link href={item.href} className="hover:text-[#6ec9c9] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#6ec9c9]">{item.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}