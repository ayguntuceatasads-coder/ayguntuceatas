import { createClient } from "@/lib/supabase/server";
import YazilarimizClient from "@/components/frontend/YazilarimizClient";
import type { Metadata } from "next";

// YENİDEN DOĞRULAMA (Sayfanın hızlı çalışması ve önbellekte kalması için)
export const revalidate = 60;

// 1. DİNAMİK METADATA (Google Arama Sonuçları İçin)
export const metadata: Metadata = {
  title: "Yazılarımız, Kitaplar ve Videolar | Uzm. Psk. Aygün Tuçe Ataş Önç",
  description: "Psikoloji, EMDR terapisi, kaygı bozuklukları, çocuk gelişimi ve ruh sağlığı üzerine yazdığımız güncel makaleler, kitap önerileri ve videolar.",
  keywords: ["Psikoloji makaleleri", "EMDR nedir", "Psikolog blog", "Kitap önerileri", "Psikoloji videoları", "Antalya psikolog yazıları"],
  openGraph: {
    title: "İçeriklerimiz | Aygün Tuçe Ataş Önç Kliniği",
    description: "Güncel psikoloji makaleleri ve ruh sağlığı içerikleri.",
    url: "https://www.ayguntuceatas.com/yazilarimiz",
    siteName: "Aygün Tuçe Ataş Önç Psikoloji Kliniği",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: "https://www.ayguntuceatas.com/yazilarimiz",
  }
};

export default async function YazilarimizPage() {
  const supabase = await createClient();
  
  // 2. SUNUCUDA TEK SEFERDE TÜM İÇERİKLERİ ÇEKİYORUZ
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. GOOGLE SCHEMA (JSON-LD) - Blog/Makale Listesi (ItemList)
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Psikoloji Blogu",
    "url": "https://www.ayguntuceatas.com/yazilarimiz",
    "description": "Psikoloji ve ruh sağlığı üzerine makaleler.",
    "publisher": {
      "@type": "MedicalClinic",
      "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.ayguntuceatas.com/logo.png"
      }
    },
    "blogPost": posts?.slice(0, 10).map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description || post.summary,
      "url": `https://www.ayguntuceatas.com/yazilarimiz/${post.slug}`,
      "datePublished": new Date(post.created_at).toISOString(),
      "image": post.image_url || "https://www.ayguntuceatas.com/default-blog.jpg"
    })) || []
  };

  return (
    <>
      {/* Schema'yı DOM'a Enjekte Ediyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      
      {/* Çekilen veri Client bileşenine aktarılıyor */}
      <YazilarimizClient initialPosts={posts || []} />
    </>
  );
}