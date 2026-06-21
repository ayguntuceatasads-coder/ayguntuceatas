"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, FileSignature, AlertCircle, FileText } from "lucide-react";

export default function YasalBelgelerAdmin() {
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    setFetchLoading(true);
    const { data, error } = await supabase
      .from("legal_documents")
      .select("*")
      .order("title", { ascending: true });
    
    if (error) {
      console.error("Yasal belgeler çekilemedi:", error);
    } else if (data) {
      setDocs(data);
      if (data.length > 0) {
        setSelectedDoc(data[0]);
        setContent(data[0].content);
      }
    }
    setFetchLoading(false);
  };

  const handleUpdate = async () => {
    if (!selectedDoc) return;
    setLoading(true);

    const { error } = await supabase
      .from("legal_documents")
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq("id", selectedDoc.id);

    if (error) {
      alert("Hata oluştu: " + error.message);
    } else {
      setDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, content } : d));
      alert("Yasal sözleşme başarıyla güncellendi, ön yüzde anlık olarak değişti.");
    }
    setLoading(false);
  };

  if (fetchLoading) {
    return (
      <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#6ec9c9] rounded-full animate-spin mb-3"></div>
        Yasal sözleşme modülü yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Üst Başlık Bilgisi */}
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <FileSignature className="text-[#6ec9c9] w-8 h-8" />
          Yasal Belgeler & Sözleşme CMS Paneli
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Sitede yayınlanan aydınlatma, çerez, gizlilik metinlerini ve başvuru formlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sol Menü: 5 Yasal Metin Seçimi */}
        <div className="space-y-2.5">
          <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Sözleşme Listesi</span>
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              onClick={() => { setSelectedDoc(doc); setContent(doc.content); }}
              className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                selectedDoc?.id === doc.id 
                  ? "bg-[#082b34] text-white border-[#082b34] shadow-sm font-semibold" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText className={`w-4 h-4 shrink-0 ${selectedDoc?.id === doc.id ? "text-[#6ec9c9]" : "text-slate-400"}`} />
              <span className="text-sm truncate">{doc.title}</span>
            </button>
          ))}
        </div>

        {/* Sağ Alan: HTML/Zengin Metin Editörü */}
        <div className="lg:col-span-3">
          {selectedDoc ? (
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedDoc.title}</h2>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">Dinamik URL Slug: /yasal/{selectedDoc.slug}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" /> HTML Etiketleri Desteklenir
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Metin İçeriği (HTML Formatında)</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-[450px] p-5 border border-slate-200 rounded-xl font-mono text-xs bg-slate-50 focus:bg-white focus:border-[#6ec9c9] outline-none shadow-inner leading-relaxed"
                  placeholder="Sözleşme metnini buraya yapıştırın veya HTML etiketleri yardımıyla zenginleştirin..."
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <p className="text-xs text-slate-400">Son Güncelleme: {new Date(selectedDoc.updated_at).toLocaleString('tr-TR')}</p>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleUpdate}
                  className="flex items-center gap-2 bg-[#082b34] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0f4c5c] transition-colors disabled:bg-slate-300 shadow-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Değişiklikleri Kaydet
                </button>
              </div>

            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-2xl bg-white">
              Lütfen düzenlemek istediğiniz yasal sözleşmeyi soldan seçin.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}