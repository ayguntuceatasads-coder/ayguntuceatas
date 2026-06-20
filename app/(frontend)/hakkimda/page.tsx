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

  // Uzmanlık alanlarını virgülle ayrılmış düz yazıya çeviriyoruz
  const clinicalAreasText = clinicalAreas.length > 0 
    ? clinicalAreas.map((item: any) => typeof item === 'string' ? item : item.title).join(", ")
    : "";

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <PageHero 
        title="Uzmanımız Hakkında" 
        breadcrumbs={[{ label: "Hakkımda" }]}
        bgImage="https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=2069"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl -mt-16 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-14">
          
          {/* PROFİL VE BİYOGRAFİ */}
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
                
                {/* DÜZ YAZI UZMANLIK ALANLARI */}
                {clinicalAreasText && (
                  <p className="font-medium text-[#082b34] mt-8 bg-slate-50 p-6 rounded-xl border-l-4 border-[#6ec9c9] shadow-sm">
                    Çalışma alanlarından bazıları; {clinicalAreasText}'dır.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* DİĞER BÖLÜMLER (Hocamızın İstediği Sıralama ile) */}
          <div className="pt-12 border-t border-slate-100 flex flex-col gap-16">

            {/* 1. SERTİFİKALAR / EĞİTİMLER */}
            {certifications.length > 0 && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3">
                  <div className="p-2 bg-[#00878a]/10 rounded-lg text-[#00878a]"><Award className="w-6 h-6" /></div> 
                  Uluslararası Terapi Sertifikasyonları ve Eğitimler
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {certifications.map((group: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                      <h4 className="text-lg font-bold text-[#082b34] border-b border-slate-200 pb-2 inline-block">
                        {group.category}
                      </h4>
                      <ul className="space-y-3">
                        {group.items?.map((item: any, i: number) => (
                          <li key={i} className="text-slate-700 leading-relaxed flex items-start gap-2">
                            <span className="text-[#00878a] mt-1 shrink-0">•</span>
                            <div>
                               <span className="font-medium text-[#082b34]">{item.title}</span> 
                               {item.detail && <span className="text-slate-500 block text-sm"> {item.detail}</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. KİTAPLAR VE YAYINLAR */}
            {books.length > 0 && (
              <div className="space-y-8 pt-6 border-t border-slate-100 border-dashed">
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

            {/* 3. KONGRELER VE SEMİNERLER */}
            {congressText && congressText.length > 10 && (
              <div className="space-y-8 pt-6 border-t border-slate-100 border-dashed">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3">
                  <div className="p-2 bg-[#5e338d]/10 rounded-lg text-[#5e338d]"><Mic className="w-6 h-6" /></div> 
                  Kongreler, Seminerler ve Çalıştaylar
                </h3>
                <div className="prose prose-slate max-w-none prose-ul:space-y-2 prose-li:text-[#082b34] prose-li:marker:text-[#00878a] bg-slate-50 p-8 rounded-2xl">
                  <div dangerouslySetInnerHTML={{ __html: congressText }} />
                </div>
              </div>
            )}

            {/* 4. İŞ DENEYİMİ (EN ALTTA) */}
            {experience.length > 0 && (
              <div className="space-y-8 pt-6 border-t border-slate-100 border-dashed">
                <h3 className="text-2xl font-bold text-[#082b34] flex items-center gap-3"><div className="p-2 bg-[#5e338d]/10 rounded-lg text-[#5e338d]"><Briefcase className="w-6 h-6" /></div> İş Deneyimi</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {experience.map((item: any, i: number) => (
                    <div key={i} className="relative pl-8 border-l-2 border-slate-200 pb-2">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-2 border-[#5e338d] rounded-full"></div>
                      <h4 className="font-bold text-[#082b34] text-lg">{item.title}</h4>
                      <p className="text-slate-500 mt-2">{item.detail}</p>
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