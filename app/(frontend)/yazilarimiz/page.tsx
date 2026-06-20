"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Loader2, ArrowRight, Calendar, Home, ChevronRight, FileText, Book, Video } from "lucide-react";

export default function YazilarimizPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Varsayılan olarak "makale" sekmesi açık gelsin
  const [activeTab, setActiveTab] = useState("makale"); 

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      
      // Eski kaydettiğin "blog" verilerini de kaybetmemek için makale sekmesinde ikisini birden çağırıyoruz
      const typesToFetch = activeTab === "makale" ? "type.eq.makale,type.eq.blog" : `type.eq.${activeTab}`;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .or(typesToFetch) // Seçili sekmeye göre filtreler
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data);
      }
      setLoading(false);
    }
    fetchPosts();
  }, [activeTab]); // activeTab değiştiğinde verileri baştan çeker

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* HERO & BREADCRUMB BÖLÜMÜ */}
      <div className="bg-[#082b34] text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm text-slate-300 mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Anasayfa
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#00878a] font-medium">İçeriklerimiz</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">İçeriklerimiz</h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Sizin için hazırladığımız güncel makaleler, önerdiğimiz kitaplar ve bilgilendirici videolar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* FİLTRELEME SEKMELERİ (TABS) */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("makale")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "makale" ? "bg-[#00878a] text-white shadow-lg shadow-[#00878a]/30" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-5 h-5" /> Yazılarımız
          </button>
          
          <button 
            onClick={() => setActiveTab("kitap")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "kitap" ? "bg-[#00878a] text-white shadow-lg shadow-[#00878a]/30" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Book className="w-5 h-5" /> Kitaplarımız
          </button>

          <button 
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
              activeTab === "video" ? "bg-[#00878a] text-white shadow-lg shadow-[#00878a]/30" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Video className="w-5 h-5" /> Videolarımız
          </button>
        </div>

        {/* İÇERİK LİSTESİ */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#00878a]" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <p>Bu kategoriye henüz içerik eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col">
                {post.image_url && (
                  <div className="h-52 overflow-hidden">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00878a] mb-4 uppercase tracking-wider">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-[#082b34] mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">{post.description}</p>
                  
                  <Link href={`/yazilarimiz/${post.slug}`} className="inline-flex items-center gap-2 text-[#00878a] font-bold hover:text-[#082b34] transition-colors mt-auto">
                    Detayları İncele <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}