import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import { FileSignature, ShieldCheck } from "lucide-react";

export const revalidate = 0; // Her girişte veritabanındaki en güncel metni çekmesi için

interface Props {
  params: { slug: string };
}

export default async function DinamikYasalSayfa({ params }: Props) {
  // Veritabanından ilgili slug'a ait metni tekil olarak çekiyoruz
  const { data: doc } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!doc) {
    notFound(); // Sözleşme bulunamazsa 404 sayfasına yönlendirir
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Üst Tasarım Alanı */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0f4c5c]/10 text-[#0f4c5c] rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{doc.title}</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Uzm. Psk. Aygün Tuçe Ataş Önç Kliniği Resmi Mevzuat Metni</p>
            </div>
          </div>
          <div className="text-[11px] font-mono font-bold text-slate-400 border bg-slate-50 px-3 py-1.5 rounded-xl">
            Son Güncelleme: {new Date(doc.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Dinamik İçerik (Zengin Metin Çıktısı) */}
        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm">
          <article 
            className="prose prose-slate max-w-none prose-headings:text-[#082b34] prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-p:text-sm md:prose-p:text-base"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </div>

      </div>
    </div>
  );
}