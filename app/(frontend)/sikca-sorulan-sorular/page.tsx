import { createClient } from "@/lib/supabase/server";
import FAQClient from "@/components/frontend/FAQClient";
import type { Metadata } from "next";

// YENİDEN DOĞRULAMA (Sitenin güncel kalması ve önbellekleme için)
export const revalidate = 60;

// 1. DİNAMİK METADATA
export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular | Uzm. Psk. Aygün Tuçe Ataş Önç",
  description: "Terapi süreçleri, seans ücretleri, EMDR terapisi ve online danışmanlık hakkında en çok merak edilen soruların cevapları.",
  keywords: ["Psikolog SSS", "Terapi ücretleri", "EMDR ne kadar sürer", "Online terapi nasıl yapılır", "Antalya psikolog iletişim"],
  openGraph: {
    title: "Sıkça Sorulan Sorular | Aygün Tuçe Ataş Önç Kliniği",
    description: "Psikoterapi süreçleri hakkında merak edilen tüm detaylar.",
    url: "https://www.ayguntuceatas.com/sikca-sorulan-sorular",
    siteName: "Aygün Tuçe Ataş Önç Psikoloji Kliniği",
    locale: "tr_TR",
    type: "website",
  },
  alternates: {
    canonical: "https://www.ayguntuceatas.com/sikca-sorulan-sorular",
  }
};

export default async function SSSPage() {
  const supabase = await createClient();
  
  // 2. SUNUCUDA VERİ ÇEKME İşlemi
  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .order("order_index", { ascending: true });

  // 3. GOOGLE SCHEMA (JSON-LD) - FAQPage İşaretlemesi
  // Google botları bu JSON verisini okuyarak arama sonuçlarında doğrudan sorularınızı sergileyecektir.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs?.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    })) || []
  };

  return (
    <>
      {/* Schema Kodunu Sayfaya Gizlice Enjekte Ediyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* Çekilen veriyi Client bileşenine gönderiyoruz */}
      <FAQClient initialFaqs={faqs || []} />
    </>
  );
}