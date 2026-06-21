"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight, Plus, Minus, MessageCircleQuestion } from "lucide-react";

export default function FAQClient({ initialFaqs }: { initialFaqs: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* HERO & BREADCRUMB BÖLÜMÜ */}
      <div className="bg-[#082b34] text-white pt-32 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <nav className="flex justify-center items-center gap-2 text-sm text-slate-300 mb-6">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" /> Anasayfa
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#00878a] font-medium">Sıkça Sorulan Sorular</span>
          </nav>

          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6">
            <MessageCircleQuestion className="w-8 h-8 text-[#00878a]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Aklınıza Takılanlar</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Terapi süreci, işleyiş ve çalışma prensiplerimiz hakkında en çok merak edilen soruları sizin için derledik.
          </p>
        </div>
      </div>

      {/* AKORDİYON LİSTESİ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-10 border border-slate-100">
          
          {initialFaqs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              Henüz soru eklenmemiş.
            </div>
          ) : (
            <div className="space-y-4">
              {initialFaqs.map((faq, index) => {
                const isOpen = openIndex === index;
                
                return (
                  <div 
                    key={faq.id} 
                    className={`border border-slate-200 rounded-2xl overflow-hidden transition-colors duration-300 ${
                      isOpen ? "bg-slate-50 border-[#00878a]/30" : "bg-white hover:border-slate-300"
                    }`}
                  >
                    {/* Soru Başlığı */}
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className={`font-bold text-lg md:text-xl transition-colors pr-4 ${isOpen ? "text-[#00878a]" : "text-[#082b34]"}`}>
                        {faq.question}
                      </span>
                      
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isOpen ? "bg-[#00878a] text-white" : "bg-slate-100 text-slate-500"
                      }`}>
                        {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* Cevap Kısmı */}
                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          )}

          {/* İletişim Yönlendirmesi */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 mb-4">Aradığınız cevabı bulamadınız mı?</p>
            <Link href="/iletisim" className="inline-flex items-center gap-2 bg-[#082b34] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#00878a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Bizimle İletişime Geçin
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}