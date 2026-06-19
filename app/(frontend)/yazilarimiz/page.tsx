import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, BookOpen, Video, ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yazılarımız ve Kaynaklar | Uzm. Psk. Aygün Tuce Ataş",
  description: "Klinik psikoloji makaleleri, ebeveynler için kitap önerileri ve ruh sağlığı üzerine bilgilendirici video içerikler.",
};

export default async function PostsListPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'kitap': return { text: 'Kitap Önerisi', color: 'bg-purple-50 text-purple-700 border-purple-100', icon: <BookOpen className="w-3.5 h-3.5" /> };
      case 'video': return { text: 'Video İçerik', color: 'bg-red-50 text-red-700 border-red-100', icon: <Video className="w-3.5 h-3.5" /> };
      default: return { text: 'Makale', color: 'bg-teal-50 text-[#00878a] border-teal-100', icon: <FileText className="w-3.5 h-3.5" /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      <PageHero 
        title="Yazılarımız & Kaynaklar" 
        breadcrumbs={[{ label: "Yazılarımız" }]}
        bgImage="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073"
      />

      <section className="container mx-auto px-4 md:px-8 max-w-7xl mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.map((post) => {
            const badge = getTypeBadge(post.type);
            return (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                <div>
                  {post.image_url && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
                        {badge.icon} {badge.text}
                      </span>
                      {post.category && <span className="text-xs text-slate-400 font-medium"># {post.category}</span>}
                    </div>
                    <h3 className="text-lg font-bold text-[#082b34] mb-2 line-clamp-2 group-hover:text-[#5e338d] transition-colors">{post.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Link href={`/yazilarimiz/${post.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#00878a] hover:text-[#5e338d] transition-colors group/link w-fit">
                    Devamını Oku <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}