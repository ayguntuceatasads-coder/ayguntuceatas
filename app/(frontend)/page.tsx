import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/frontend/HomeClient';

// Sitenin güncel kalması için 60 saniyelik cache (ISR) süresi
export const revalidate = 60; 

// SEO Metadata Yapılandırması
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

// Google Arama motorları için Kurumsal Schema
const clinicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  "name": "Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği",
  "@id": "https://www.ayguntuceatas.com",
  "url": "https://www.ayguntuceatas.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Fener Mh. Bülent Ecevit Bulvarı",
    "addressLocality": "Muratpaşa",
    "addressRegion": "Antalya",
    "addressCountry": "TR"
  }
};

export default async function HomePage() {
  const supabase = await createClient();
  
  // Paralel veri çekme: Hem anasayfa, hem hizmetler hem de yazılar aynı anda çekilir (Performans için)
  const [settingsRes, servicesRes, postsRes] = await Promise.all([
    supabase.from("homepage_settings").select("*").limit(1),
    supabase.from("services").select("*").order("created_at", { ascending: true }),
    supabase.from("posts").select("*").order("created_at", { ascending: false })
  ]);

  const initialData = {
    settings: settingsRes.data?.[0] || null,
    services: servicesRes.data || [],
    posts: postsRes.data || []
  };

  return (
    <>
      {/* Schema verisini sayfaya gömüyoruz */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
      />
      
      {/* HomeClient bileşeni anasayfadaki Hero, Hizmetler ve Yazıları görselleştirir */}
      <HomeClient initialData={initialData} />
    </>
  );
}