import { createClient } from "@/lib/supabase/server";
import { ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Sayfanın agresif önbelleğe (cache) alınmasını engellemek için
export const revalidate = 0;
export const dynamic = "force-dynamic";

interface Props {
  params: any; // Esnek Promise/Object yapısı için any olarak tanımlıyoruz
}

export default async function DinamikYasalSayfa({ params }: Props) {
  // Next.js 15+ Promise yapısını ve Next.js 14 senkron yapısını eşzamanlı destekleyen güvenli çözüm:
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  // Eğer yönlendirmeden slug parametresi hiçbir şekilde çözülemezse
  if (!slug) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-lg w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">URL Parametresi Alınamadı</h1>
          <p className="text-sm text-slate-500">
            Next.js App Router yönlendirmesinden <b>slug</b> verisi çözülemedi. Klasör yapısının <b>[slug]</b> (köşeli parantezli) olduğundan emin olun.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();

  // .single() yerine .maybeSingle() kullanıyoruz ki eşleşme olmazsa kod çökmesin, null dönsün
  const { data: doc, error } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  // VERİTABANINDA BULUNAMAZSA VEYA RLS ENGELİ VARSA DETAYLI DEBUG EKRANI
  if (error || !doc) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 max-w-xl w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Belge Veritabanında Bulunamadı</h1>
          <p className="text-sm text-slate-500 mb-6">
            Sistem veritabanındaki <b>legal_documents</b> tablosunda bir arama yaptı ancak sonuç alamadı.
          </p>
          
          {/* Bilgisayar mühendisi gözüyle durumu anlık izlemek için izleme paneli */}
          <div className="bg-slate-50 p-4 rounded-xl text-left border border-slate-200 text-xs text-slate-600 space-y-2.5 mb-6 font-sans">
            <div>
              <span className="font-bold text-slate-400 block uppercase text-[10px] tracking-wider">Gelen URL Parametresi (Slug):</span>
              <code className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block">"{slug}"</code>
            </div>
            <div>
              <span className="font-bold text-slate-400 block uppercase text-[10px] tracking-wider">Supabase Hata Durumu:</span>
              {error ? (
                <code className="text-red-600 font-mono block mt-1 bg-red-50 p-2 rounded border border-red-100">{error.message}</code>
              ) : (
                <span className="text-amber-600 font-semibold block mt-1">
                  Supabase bağlantısı başarılı fakat tabloda <b>slug = "{slug}"</b> olan hiçbir satır/kayıt yok. Admin panelinden bu slug ile metin oluşturulduğundan emin olun.
                </span>
              )}
            </div>
          </div>

          <Link href="/" className="inline-flex items-center text-sm font-bold text-[#0f4c5c] hover:text-[#6ec9c9] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  // VERİ BAŞARIYLA GELDİĞİNDE BASILACAK KURUMSAL TASARIM
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Üst Bilgi Kartı */}
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0f4c5c]/10 text-[#0f4c5c] rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{doc.title}</h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">Uzm. Psk. Aygün Tuçe Ataş Önç Resmi Mevzuat Metni</p>
            </div>
          </div>
          <div className="text-[11px] font-mono font-bold text-slate-400 border bg-slate-50 px-3 py-1.5 rounded-xl">
            Son Güncelleme: {new Date(doc.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Makale İçeriği (HTML Render Alanı) */}
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