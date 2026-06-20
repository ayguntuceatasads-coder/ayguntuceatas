"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Trash2, Copy, CheckCircle2, Edit } from "lucide-react";
import Link from "next/link";

export default function AdminOlceklerPage() {
  const [scales, setScales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchScales();
  }, []);

  async function fetchScales() {
    setLoading(true);
    // console.log ile isteğin başladığını doğruluyoruz
    console.log("Supabase 'scales' tablosundan veri çekiliyor...");
    
    const { data, error } = await supabase
      .from("scales")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      // EĞER BİR HATA VARSA BURADA KIPKIRMIZI GÖRÜNECEK
      console.error("Ölçekler çekilirken Supabase hatası oluştu:", error);
      alert("Veri çekme hatası: " + error.message);
    } else {
      console.log("Gelen Veri:", data);
      setScales(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu ölçeği ve ona ait TÜM SONUÇLARI silmek istediğinize emin misiniz?")) return;
    await supabase.from("scales").delete().eq("id", id);
    fetchScales();
  };

  const copyToClipboard = (slug: string, id: string) => {
    const url = `${window.location.origin}/olcekler/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00878a]" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#082b34]">Psikolojik Ölçekler</h1>
          <p className="text-slate-500 text-sm mt-1">Hastalarınıza gönderebileceğiniz dinamik formlar.</p>
        </div>
        <Link href="/admin/olcekler/yeni" className="bg-[#00878a] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#082b34] transition-colors">
          <Plus className="w-5 h-5" /> Yeni Ölçek Ekle
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Ölçek Adı</th>
              <th className="px-6 py-4">Soru Sayısı</th>
              <th className="px-6 py-4">Mail Bildirimi</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scales.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-500">Henüz ölçek oluşturulmamış veya veri yüklenemedi. Tarayıcı konsolunu (F12) kontrol edin.</td></tr>}
            {scales.map((scale) => (
              <tr key={scale.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#082b34]">{scale.title}</td>
                <td className="px-6 py-4"><span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{scale.questions?.length || 0} Soru</span></td>
                <td className="px-6 py-4">
                  {scale.send_email_to_patient ? <span className="text-green-600 font-medium">Aktif</span> : <span className="text-slate-400">Pasif</span>}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  
                  {/* LİNKİ KOPYALA BUTONU */}
                  <button 
                    onClick={() => copyToClipboard(scale.slug, scale.id)}
                    className="flex items-center gap-1 p-2 bg-slate-100 text-[#00878a] hover:bg-[#00878a] hover:text-white rounded-lg transition-colors"
                    title="Müşteriye gönderilecek linki kopyala"
                  >
                    {copiedId === scale.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs font-bold">{copiedId === scale.id ? "Kopyalandı" : "Linki Al"}</span>
                  </button>

                  {/* DÜZENLE BUTONU (YENİ EKLENEN) */}
                  <Link 
                    href={`/admin/olcekler/duzenle/${scale.id}`} 
                    className="p-2 text-[#00878a] bg-slate-100 hover:bg-[#00878a] hover:text-white rounded-lg transition-colors"
                    title="Ölçeği Düzenle"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>

                  {/* SİL BUTONU */}
                  <button 
                    onClick={() => handleDelete(scale.id)} 
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Ölçeği Sil"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}