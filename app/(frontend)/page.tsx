import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/frontend/HomeClient';

// Sitenin güncel kalması için 60 saniyelik cache (ISR) süresi
export const revalidate = 60; 

// Dinamik SEO Metadata Yapılandırması (Admin Panel -> Genel Ayarlar'dan beslenir)
export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("site_title, site_description")
    .eq("id", 1)
    .maybeSingle();

  const title = settings?.site_title || "Uzman Klinik Psikolog Aygün Tuçe Ataş Önç | Antalya & Online Terapi";
  const description = settings?.site_description || "Antalya Muratpaşa'da yüz yüze ve online terapi ile bilimsel temellere dayanan psikolojik danışmanlık hizmetleri.";

  return {
    title: {
      absolute: title, // Layout'taki şablonun tekrar ekleme yapmasını engeller, direkt admin başlığını basar
    },
    description: description,
    keywords: [
      'Antalya Psikolog',
      'Antalya terapi',
      'Antalya klinik psikolog',
      'Antalya psikoterapi',
      'online terapi',
      'EMDR terapi',
      'online emdr terapi',
      'bilişsel terapi',
      'kognitif terapi',
      'travma terapisi',
      'Antalya aile terapisi',
      'Antalya çocuk terapi',
      'sosyal fobi',
      'panik atak',
      'depresyon',
      'kaygı bozukluğu',
      'yetişkin terapi',
      'şema terapi',
      'obsesif kompulsif bozukluk',
      'takıntı',
      'sınav kaygısı',
      'sosyal beceriler',
      'ergen terapi',
      'Uzman Klinik Psikolog Aygün Tuçe Ataş Önç'
    ],
    openGraph: {
      title: title,
      description: description,
      url: 'https://www.ayguntuceatas.com',
      siteName: 'Uzman Klinik Psikolog Aygün Tuçe Ataş Önç',
      locale: 'tr_TR',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.ayguntuceatas.com',
    }
  };
}

export default async function HomePage() {
  const supabase = await createClient();
  
  // Paralel veri çekme: Hem genel ayarlar, hem anasayfa, hem hizmetler hem de yazılar aynı anda çekilir
  const [siteSettingsRes, settingsRes, servicesRes, postsRes] = await Promise.all([
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    supabase.from("homepage_settings").select("*").limit(1),
    supabase.from("services").select("*").order("created_at", { ascending: true }),
    supabase.from("posts").select("*").order("created_at", { ascending: false })
  ]);

  const siteSettings = siteSettingsRes.data;

  // Google Arama motorları için Kurumsal Schema (Veritabanındaki güncel adres ve telefonla)
  const clinicSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": siteSettings?.site_title || "Uzman Klinik Psikolog Aygün Tuçe Ataş Önç",
    "@id": "https://www.ayguntuceatas.com",
    "url": "https://www.ayguntuceatas.com",
    "telephone": siteSettings?.phone || "+905074654943",
    "email": siteSettings?.email || "info@ayguntuceatas.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteSettings?.address || "Yeşilbahçe Mah. Metin Kasapoğlu Cad. Saadet Apt. No:33 D:8",
      "addressLocality": "Muratpaşa",
      "addressRegion": "Antalya",
      "addressCountry": "TR"
    }
  };

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