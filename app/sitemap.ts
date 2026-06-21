import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = 'https://www.ayguntuceatas.com'; // Canlı site adresiniz

  // 1. Statik Ana Sayfalar ve Arşiv Sayfaları
  const staticRoutes = [
    '',                           // Anasayfa
    '/hakkimda',                  // Hakkımızda
    '/hizmetlerimiz',             // Hizmetlerimiz (Ana Sayfa)
    '/sikca-sorulan-sorular',     // S.S.S. (Güncel URL)
    '/yazilarimiz',               // Blog & İçerikler (Ana Sayfa)
    '/iletisim'                   // İletişim
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dinamik Verileri Çek
  // Not: services için updated_at sütunu olmama ihtimaline karşı created_at garantisi eklendi.
  const { data: services } = await supabase.from('services').select('slug, created_at');
  const { data: posts } = await supabase.from('posts').select('slug, created_at');
  const { data: legals } = await supabase.from('legal_documents').select('slug, updated_at');

  // 3. Dinamik Hizmet Detay Sayfalarını Ekle
  const serviceRoutes = (services || []).map((service) => ({
    url: `${baseUrl}/hizmetlerimiz/${service.slug}`,
    lastModified: service.created_at ? new Date(service.created_at) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // 4. Dinamik Blog/Makale Detay Sayfalarını Ekle
  const postRoutes = (posts || []).map((post) => ({
    url: `${baseUrl}/yazilarimiz/${post.slug}`,
    lastModified: post.created_at ? new Date(post.created_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 5. Dinamik Yasal Metin Sayfalarını Ekle
  const legalRoutes = (legals || []).map((doc) => ({
    url: `${baseUrl}/yasal/${doc.slug}`,
    lastModified: doc.updated_at ? new Date(doc.updated_at) : new Date(),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  // Tüm rotaları birleştir ve Google'a sun
  return [...staticRoutes, ...serviceRoutes, ...postRoutes, ...legalRoutes];
}