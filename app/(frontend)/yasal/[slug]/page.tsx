import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export default async function DinamikYasalSayfa({ params }: Props) {
  // GÜVENLİK KONTROLÜ: Eğer slug (uzantı) yoksa doğrudan 404'e at veya durdur.
  if (!params || !params.slug) {
    return notFound();
  }

  const supabase = await createClient();

  // Supabase'den veriyi çekerken .maybeSingle() kullanalım ki hata fırlatmak yerine null dönsün
  const { data: doc, error } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  // EĞER BELGE YOKSA VEYA HATA VARSA
  if (error || !doc) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-lg w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Belge Bulunamadı</h1>
          <p className="text-sm text-slate-500 mb-6">
            Sistem <b>/yasal/{params.slug}</b> adresinde bir belge aradı ancak bulamadı. Bu sözleşme silinmiş veya adresi değişmiş olabilir.
          </p>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-xl text-left border border-red-100 mb-6">
              <span className="block text-xs font-bold text-red-700 uppercase mb-1">Supabase Hata Detayı:</span>
              <code className="text-xs text-red-600 font-mono break-words">{error.message}</code>
            </div>
          )}

          <Link href="/" className="inline-flex items-center text-sm font-bold text-[#0f4c5c] hover:text-[#6ec9c9] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // BAŞARILI EKRAN: Belge bulunduğunda gösterilecek sayfa
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        
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

        <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-sm">
          <article 
            className="prose prose-slate max-w-none prose-headings:text-[#082b34] prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-p:text-sm md:prose-p:text-base prose-a:text-[#6ec9c9]"
            dangerouslySetInnerHTML={{ __html: doc.content }}
          />
        </div>

      </div>
    </div>
  );
}