import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { data: post } = await supabase.from('posts').select('title, excerpt, seo_title, seo_description').eq('slug', resolvedParams.slug).single();
  if (!post) return { title: 'İçerik Bulunamadı' };
  return {
    title: post.seo_title || `${post.title} | Uzm. Psk. Aygün Tuce Ataş`,
    description: post.seo_description || post.excerpt,
  };
}

export default async function PostDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const { data: post } = await supabase.from('posts').select('*').eq('slug', resolvedParams.slug).single();

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white pb-24">
      <PageHero 
        title={post.title} 
        breadcrumbs={[{ label: "Yazılarımız", href: "/yazilarimiz" }, { label: post.title }]} 
        bgImage={post.image_url || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073"}
      />
      
      <div className="container mx-auto px-4 md:px-8 max-w-4xl -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-12">
          <div className="prose prose-lg prose-slate max-w-none prose-headings:text-[#082b34] prose-a:text-[#00878a] hover:prose-a:text-[#6ec9c9]">
            <div dangerouslySetInnerHTML={{ __html: post.content || "" }} />
          </div>
        </div>
      </div>
    </div>
  );
}