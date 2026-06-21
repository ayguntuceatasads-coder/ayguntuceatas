import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Home, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

// YENİDEN DOĞRULAMA (İçeriklerin güncel kalması ve hızlı yüklenmesi için)
export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

// 1. DİNAMİK METADATA (Her makale için Google Arama başlığı ve açıklaması üretir)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', resolvedParams.slug)
    .maybeSingle();

  if (!post) return { title: "Yazı Bulunamadı | Uzm. Psk. Aygün Tuçe Ataş Önç" };

  return { 
    title: `${post.title} | Uzm. Psk. Aygün Tuçe Ataş Önç`,
    description: post.summary || post.description || `${post.title} başlıklı yazımızı okumak için tıklayın.`,
    openGraph: {
      title: post.title,
      description: post.summary || post.description,
      url: `https://www.ayguntuceatas.com/yazilarimiz/${post.slug}`,
      siteName: "Aygün Tuçe Ataş Önç Psikoloji Kliniği",
      images: post.image_url ? [{ url: post.image_url }] : [],
      locale: "tr_TR",
      type: "article",
      publishedTime: new Date(post.created_at).toISOString(),
    }
  };
}

export default async function YazilarimizDetayPage({ params }: Props) {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  // Veriyi sunucuda (server-side) çekiyoruz
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", resolvedParams.slug)
    .maybeSingle();

  // Yazı bulunamazsa Next.js'in yerleşik 404 sayfasına yönlendirir
  if (!post) {
    notFound();
  }

  // 2. GOOGLE SCHEMA (JSON-LD) - Makale (BlogPosting) İşaretlemesi
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.ayguntuceatas.com/yazilarimiz/${post.slug}`
    },
    "headline": post.title,
    "description": post.summary || post.description,
    "image": post.image_url || "https://www.ayguntuceatas.com/default-blog.jpg",
    "author": {
      "@type": "Person",
      "name": "Uzm. Psk. Aygün Tuçe Ataş Önç",
      "url": "https://www.ayguntuceatas.com/hakkimda"
    },
    "publisher": {
      "@type": "MedicalClinic",
      "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ayguntuceatas.com/logo.png"
      }
    },
    "datePublished": new Date(post.created_at).toISOString(),
    "dateModified": new Date(post.updated_at || post.created_at).toISOString()
  };

  return (
    <>
      {/* Schema Kodunu Sayfaya Enjekte Ediyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      
      <div className="bg-slate-50 min-h-screen pb-20">
        
        {/* HERO & BREADCRUMB */}
        <div className="bg-[#082b34] text-white pt-32 pb-24 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center flex-wrap gap-2 text-sm text-slate-300 mb-8">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" /> Anasayfa
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/yazilarimiz" className="hover:text-white transition-colors">
                İçeriklerimiz
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#00878a] font-medium truncate max-w-[200px] md:max-w-xs">{post.title}</span>
            </nav>

            <div className="flex items-center gap-2 text-sm font-bold text-[#00878a] mb-4 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
          </div>
        </div>

        {/* İÇERİK BÖLÜMÜ */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100">
            
            {/* 3. RESİM OPTİMİZASYONU (<Image> Kullanımı) */}
            {post.image_url && (
              <div className="relative w-full h-[300px] md:h-[450px] bg-slate-100">
                <Image 
                  src={post.image_url} 
                  alt={post.title} 
                  fill
                  priority // Üst görsel olduğu için hemen yüklenmesini sağlar (LCP iyileştirmesi)
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover" 
                />
              </div>
            )}
            
            <div className="p-8 md:p-14 min-w-0 overflow-hidden">
              <div className="prose prose-lg prose-slate max-w-none w-full break-words [&_*]:whitespace-normal [&_*]:break-words [&_*]:max-w-full prose-headings:text-[#082b34] prose-a:text-[#00878a]">
                {post.content ? (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                ) : (
                  <p>{post.description || post.summary}</p>
                )}
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </>
  );
}