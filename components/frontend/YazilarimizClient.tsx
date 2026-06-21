"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Home, ChevronRight, FileText, Book, Video } from "lucide-react";

export default function YazilarimizClient({ initialPosts }: { initialPosts: any[] }) {
  const [activeTab, setActiveTab] = useState("makale");

  // Veritabanına tekrar istek atmadan, sunucudan gelen veriyi anında filtreliyoruz (Şimşek hızında sekme geçişi)
  const filteredPosts = initialPosts.filter((post) => {
    if (activeTab === "makale") {
      return post.type === "makale" || post.type === "blog" || !post.type; 
    }
    return post.type === activeTab;
  });

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
            <span className="text-[#6ec9c9] font-medium">İçeriklerimiz</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">İçeriklerimiz</h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            Sizin için hazırladığımız güncel makaleler, klinik deneyimler, önerdiğimiz kitaplar ve bilgilendirici videolar.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
        
        {/* FİLTRELEME SEKMELERİ (TABS) */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button 
            onClick={() => setActiveTab("makale")}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === "makale" ? "bg-[#00878a] text-white shadow-xl shadow-[#00878a]/30 -translate-y-1" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#00878a]/30"
            }`}
          >
            <FileText className="w-5 h-5" /> Yazılarımız
          </button>
          
          <button 
            onClick={() => setActiveTab("kitap")}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === "kitap" ? "bg-[#00878a] text-white shadow-xl shadow-[#00878a]/30 -translate-y-1" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#00878a]/30"
            }`}
          >
            <Book className="w-5 h-5" /> Kitaplarımız
          </button>

          <button 
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === "video" ? "bg-[#00878a] text-white shadow-xl shadow-[#00878a]/30 -translate-y-1" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-[#00878a]/30"
            }`}
          >
            <Video className="w-5 h-5" /> Videolarımız
          </button>
        </div>

        {/* İÇERİK LİSTESİ */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 border-dashed shadow-sm">
            <p className="text-lg">Bu kategoriye henüz içerik eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link href={`/yazilarimiz/${post.slug}`} key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all border border-slate-100 flex flex-col hover:-translate-y-1 duration-300">
                
                {/* YENİ: Next.js <Image /> ile Optimizasyon */}
                {post.image_url ? (
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <Image 
                      src={post.image_url} 
                      alt={post.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                ) : (
                  <div className="h-56 bg-slate-100 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-[#00878a] mb-3 uppercase tracking-widest bg-[#00878a]/10 w-fit px-3 py-1.5 rounded-lg">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-xl font-bold text-[#082b34] mb-3 line-clamp-2 group-hover:text-[#00878a] transition-colors">{post.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">{post.description || post.summary}</p>
                  
                  <div className="inline-flex items-center gap-2 text-[#082b34] font-bold group-hover:text-[#6ec9c9] transition-colors mt-auto pt-4 border-t border-slate-50">
                    İçeriği Oku <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}