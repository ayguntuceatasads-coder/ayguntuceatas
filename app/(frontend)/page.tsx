import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/frontend/HomeClient';

// YENİDEN DOĞRULAMA (Sitenin güncel kalması için)
export const revalidate = 60; // Her 60 saniyede bir önbelleği günceller

// 1. DİNAMİK VE GÜÇLÜ SEO METADATA (Google Arama Sonuçları İçin)
export const metadata: Metadata = {
  title: 'Uzm. Psk. Aygün Tuçe Ataş Önç | Antalya Psikolog ve EMDR Terapisi',
  description: 'Antalya\'da uzman psikolog Aygün Tuçe Ataş Önç ile online ve yüz yüze psikoterapi, EMDR terapisi, çocuk ve ergen danışmanlığı hizmetleri.',
  keywords: ['Antalya psikolog', 'EMDR terapisi Antalya', 'online terapi', 'çocuk psikoloğu', 'ergen terapisi', 'Aygün Tuçe Ataş Önç'],
  openGraph: {
    title: 'Uzm. Psk. Aygün Tuçe Ataş Önç | Antalya Psikolog',
    description: 'Antalya\'da uzman psikolog ile profesyonel terapi desteği.',
    url: 'https://www.ayguntuceatas.com',
    siteName: 'Aygün Tuçe Ataş Önç Psikoloji Kliniği',
    locale: 'tr_TR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.ayguntuceatas.com',
  }
};

// 2. GOOGLE SCHEMA (JSON-LD) - Kliniğinizin Kurumsal İşaretlemesi
const clinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği",
  "image": "https://www.ayguntuceatas.com/logo.png", // Logo adresinizi kontrol edin
  "@id": "https://www.ayguntuceatas.com",
  "url": "https://www.ayguntuceatas.com",
  "telephone": "+905000000000", // Gerçek telefon numaranızı girin
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Fener Mh. Bülent Ecevit Bulvarı, No: 44",
    "addressLocality": "Muratpaşa",
    "addressRegion": "Antalya",
    "postalCode": "07100",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 36.852, 
    "longitude": 30.742
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "18:00"
  },
  "medicalSpecialty": "Psychiatric"
};

export default async function HomePage() {
  // 3. SUNUCU TARAFINDA VERİ ÇEKME (Google veriyi anında HTML'de görür)
  const supabase = await createClient();
  
  const { data: settingsData } = await supabase.from("homepage_settings").select("*").order('id', { ascending: true });
  const { data: servicesData } = await supabase.from("services").select("*").order("created_at", { ascending: true });
  const { data: postsData } = await supabase.from("posts").select("*").order("created_at", { ascending: true });

  const activeSettings = settingsData && settingsData.length > 0 ? settingsData[0] : null;

  const initialData = {
    settings: activeSettings,
    services: servicesData || [],
    posts: postsData || []
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
      />
      {/* Çekilen veri Client bileşenine aktarılıyor */}
      <HomeClient initialData={initialData} />
    </>
  );
}