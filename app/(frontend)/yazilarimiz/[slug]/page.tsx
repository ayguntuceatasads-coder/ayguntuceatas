"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Calendar, Home, ChevronRight } from "lucide-react";

export default function YazilarimizDetayPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (!error && data) setPost(data);
      setLoading(false);
    }
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-10 h-10 animate-spin text-[#00878a]" /></div>;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4 pt-20">
        <h1 className="text-3xl font-bold text-[#082b34] mb-4">Yazı Bulunamadı</h1>
        <Link href="/yazilarimiz" className="bg-[#00878a] text-white px-6 py-3 rounded-lg font-bold">Yazılara Geri Dön</Link>
      </div>
    );
  }

  return (
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
              Yazılarımız
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
          {post.image_url && (
            <div className="w-full h-[300px] md:h-[450px]">
              <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="p-8 md:p-14 min-w-0 overflow-hidden">
            <div className="prose prose-lg prose-slate max-w-none w-full break-words [&_*]:whitespace-normal [&_*]:break-words [&_*]:max-w-full">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <p>{post.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}