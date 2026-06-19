import { createClient } from "@/lib/supabase/server";
import { Award, BookOpen, GraduationCap, Briefcase, CheckCircle2, Mic } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımda | Uzm. Psk. Aygün Tuce Ataş",
  description: "23 yılı aşkın klinik deneyimi, akademik geçmişi, katıldığı kongreler ve uzmanlık alanları.",
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: about } = await supabase.from('about_content').select('*').eq('id', 1).maybeSingle();

  const profileImg = about?.profile_image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800";
  const bioHtml = about?.bio_text && about.bio_text.length > 10 ? about.bio_text : "<p>Biyografi bilgileri henüz güncellenmedi.</p>";
  
  // Güvenli listeler
  const certifications = about?.certifications || [];
  const clinicalAreas = about?.clinical_areas || [];
  const experience = about?.experience || [];
  const books = about?.books || [];
  const congressText = about?.congress_text || "";

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <PageHero 
        title="Uzmanımız Hakkında" 
        breadcrumbs={[{ label: "Hakkımda" }]}
        bgImage="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2069"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-14">
          
          {/* PROFİL VE BİYOGRAFİ (Aynı Tasarım) */}
          <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
            <div className="w-full lg:w-[35%] shrink-0">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border border-slate-100 group bg-slate-50">
                <img src={profileImg} alt={about?.profile_title || "Uzman Profil"} className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#082b34] via-[#082b34]/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-8 left-0 right-0 text-center px-6">
                  <p className="text-[#6ec9c9] text-xs font-bold tracking-widest uppercase mb-1.5 drop-shadow-sm">{about?.profile_subtitle || "KLİNİK PSİKOLOG"}</p>
                  <h2 className="text-white text-3xl font-bold drop-shadow-md">{about?.profile_title || "Aygün Tuce Ataş"}</h2>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-[65%] pt-4">
              <span className="text-[#00878a] font-bold text-sm tracking-widest uppercase mb-6 block border-l-4 border-[#00878a] pl-3">PROFESYONEL ÖZGEÇMİŞ</span>
              <div className="prose prose-lg prose-slate max-w-none prose-headings:text-[#082b34] prose-p:text-slate-600 prose-p:leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: bioHtml }} />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* ÇALIŞMA ALANLARI */}
            {clinicalAreas.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3"><div className="p-2 bg-[#00878a]/10 rounded-lg text-[#00878a]"><GraduationCap className="w-6 h-6" /></div> Uzmanlık Alanları</h3>
                <div className="grid grid-cols-1 gap-3">
                  {clinicalAreas.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm"><CheckCircle2 className="w-5 h-5 text-[#00878a]" /><span className="text-slate-700 font-semibold">{typeof item === 'string' ? item : item.title}</span></div>
                  ))}
                </div>
              </div>
            )}

            {/* İŞ DENEYİMİ */}
            {experience.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3"><div className="p-2 bg-[#5e338d]/10 rounded-lg text-[#5e338d]"><Briefcase className="w-6 h-6" /></div> İş Deneyimi</h3>
                <div className="space-y-4">
                  {experience.map((item: any, i: number) => (
                    <div key={i} className="relative pl-8 border-l-2 border-slate-200 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-[#5e338d] rounded-full"></div>
                      <h4 className="font-bold text-[#082b34]">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AKADEMİK VE KATEGORİZE EDİLMİŞ EĞİTİMLER (GÖRSELDEKİ YAPI) */}
            {certifications.length > 0 && (
              <div className="md:col-span-2 pt-10 border-t border-slate-100 space-y-10">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3">
                  <div className="p-2 bg-[#00878a]/10 rounded-lg text-[#00878a]"><Award className="w-6 h-6" /></div> 
                  Eğitimler
                </h3>
                
                <div className="space-y-10">
                  {certifications.map((group: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      {/* Kategori Başlığı (Örn: EMDR Eğitimleri:) */}
                      <h4 className="text-lg font-bold text-[#082b34] border-b border-slate-200 pb-2 inline-block">
                        {group.category}
                      </h4>
                      {/* Kategori İçindeki Eğitim Maddeleri */}
                      <ul className="space-y-3">
                        {group.items?.map((item: any, i: number) => (
                          <li key={i} className="text-[#082b34] leading-relaxed flex items-start gap-2">
                            <span className="text-[#00878a] mt-1 shrink-0">•</span>
                            <div>
                               <span className="font-medium">{item.title}</span> 
                               {item.detail && <span className="text-slate-500"> ({item.detail})</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KONGRELER, SEMİNERLER, ÇALIŞTAYLAR (YENİ EDİTÖR ÇIKTISI) */}
            {congressText && congressText.length > 10 && (
              <div className="md:col-span-2 pt-10 border-t border-slate-100 space-y-6">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3">
                  <div className="p-2 bg-[#5e338d]/10 rounded-lg text-[#5e338d]"><Mic className="w-6 h-6" /></div> 
                  Kongreler, Seminerler ve Çalıştaylar
                </h3>
                {/* Editörden gelen HTML veriyi basıyoruz */}
                <div className="prose prose-slate max-w-none prose-ul:space-y-2 prose-li:text-[#082b34] prose-li:marker:text-[#00878a]">
                  <div dangerouslySetInnerHTML={{ __html: congressText }} />
                </div>
              </div>
            )}

            {/* KİTAPLAR */}
            {books.length > 0 && (
              <div className="md:col-span-2 pt-10 border-t border-slate-100 space-y-6">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3"><div className="p-2 bg-[#00878a]/10 rounded-lg text-[#00878a]"><BookOpen className="w-6 h-6" /></div> Yayınlar & Kitaplar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {books.map((item: any, i: number) => (
                    <div key={i} className="p-6 border border-slate-200 rounded-2xl bg-white flex flex-col items-center text-center shadow-sm hover:border-[#5e338d] transition-all">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4"><BookOpen className="w-6 h-6 text-[#5e338d]"/></div>
                      <h4 className="font-bold text-[#082b34] mb-2">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}