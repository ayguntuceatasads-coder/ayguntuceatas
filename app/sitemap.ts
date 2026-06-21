import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = 'https://www.ayguntuceatas.com'; // Canlı site adresiniz

  // Statik Sayfalar
  const staticRoutes = [
    '',
    '/hakkimda',
    '/iletisim',
    '/sss'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dinamik Verileri Çek
  const { data: services } = await supabase.from('services').select('slug, updated_at');
  const { data: posts } = await supabase.from('posts').select('slug, created_at');
  const { data: legals } = await supabase.from('legal_documents').select('slug, updated_at');

  // Hizmetleri Haritaya Ekle
  const serviceRoutes = (services || []).map((service) => ({
    url: `${baseUrl}/hizmetlerimiz/${service.slug}`,
    lastModified: new Date(service.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // Blog Yazılarını Haritaya Ekle
  const postRoutes = (posts || []).map((post) => ({
    url: `${baseUrl}/yazilarimiz/${post.slug}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Yasal Belgeleri Haritaya Ekle
  const legalRoutes = (legals || []).map((doc) => ({
    url: `${baseUrl}/yasal/${doc.slug}`,
    lastModified: new Date(doc.updated_at),
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [...staticRoutes, ...serviceRoutes, ...postRoutes, ...legalRoutes];
}