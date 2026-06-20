"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Loader2, Send } from "lucide-react";

export default function OlayDuyguDusuncePage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Temel iletişim bilgileri
  const [patientInfo, setPatientInfo] = useState({
    AdSoyad: "",
    Telefon: "",
    Email: ""
  });

  // Dinamik tablo satırları (1 tane boş satır ile başlar)
  const [entries, setEntries] = useState([
    { id: Date.now(), olay: "", dusunce: "", duygu: "", davranis: "" }
  ]);

  // Yeni satır ekleme fonksiyonu
  const addEntry = () => {
    if (entries.length < 15) {
      setEntries([...entries, { id: Date.now(), olay: "", dusunce: "", duygu: "", davranis: "" }]);
    }
  };

  // Satır silme fonksiyonu
  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  // Input değişimlerini yakalama
  const handleEntryChange = (id: number, field: string, value: string) => {
    setEntries(entries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Boş bırakılmış kayıtları filtrele ve e-posta için şık bir formata çevir
    const cleanFormData: Record<string, string> = {};
    const filledEntries = entries.filter(e => e.olay || e.dusunce || e.duygu || e.davranis);

    if (filledEntries.length === 0) {
      setStatus({ type: "error", message: "Lütfen en az bir olay kaydı giriniz." });
      setLoading(false);
      return;
    }

    filledEntries.forEach((entry, index) => {
      cleanFormData[`Kayıt ${index + 1}`] = 
        `Olay: ${entry.olay || "-"} | Düşünce: ${entry.dusunce || "-"} | Duygu: ${entry.duygu || "-"} | Davranış: ${entry.davranis || "-"}`;
    });

    // 1. Supabase 'intake_forms' tablosuna kaydet
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "olay_duygu_dusunce",
      patient_name: patientInfo.AdSoyad,
      patient_email: patientInfo.Email,
      patient_phone: patientInfo.Telefon,
      form_data: cleanFormData,
      is_read: false
    });

    if (dbError) {
      setStatus({ type: "error", message: "Veritabanı kayıt hatası: " + dbError.message });
      setLoading(false);
      return;
    }

    // 2. Mail Gönderimi
    const mailResult = await sendIntakeFormEmail({
      formTitle: "Olay, Duygu, Düşünce ve Davranış Formu",
      patientName: patientInfo.AdSoyad,
      patientEmail: patientInfo.Email,
      patientPhone: patientInfo.Telefon,
      formData: cleanFormData
    });

    if (mailResult.success) {
      setIsSuccess(true);
    } else {
      setStatus({ type: "error", message: "Form kaydedildi fakat e-posta gönderilirken bir aksama yaşandı." });
    }
    setLoading(false);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center max-w-lg w-full animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#6ec9c9]/20 text-[#0f4c5c] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#082b34] mb-3">Kayıt Başarılı!</h2>
          <p className="text-slate-600 mb-8">
            Formunuz güvenli sistemimize kaydedilmiş ve uzmanımıza iletilmiştir. Sürece katkınız için teşekkür ederiz.
          </p>
          <Link href="/" className="inline-flex items-center text-[#0f4c5c] font-bold text-sm hover:text-[#6ec9c9] transition-colors bg-slate-50 px-6 py-3 rounded-xl border border-slate-200">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f4c5c] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#082b34]">Olay, Duygu, Düşünce ve Davranış Formu</h1>
          <p className="text-slate-500 mt-2">Günlük hayatta karşılaştığınız zorlayıcı durumları ve bunlara verdiğiniz tepkileri analiz etmemiz için aşağıdaki alanları doldurabilirsiniz.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm">
          {status && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Danışan Bilgileri */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-[#082b34] mb-4">Danışan Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ad Soyad *</label>
                  <input required type="text" value={patientInfo.AdSoyad} onChange={(e) => setPatientInfo({...patientInfo, AdSoyad: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Adınız Soyadınız" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon *</label>
                  <input required type="tel" value={patientInfo.Telefon} onChange={(e) => setPatientInfo({...patientInfo, Telefon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="İletişim Numaranız" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
                  <input type="email" value={patientInfo.Email} onChange={(e) => setPatientInfo({...patientInfo, Email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Opsiyonel" />
                </div>
              </div>
            </div>

            {/* Dinamik Kayıt Alanı */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="font-bold text-[#082b34] text-lg">Durum Analizi Kayıtları</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{entries.length} / 15</span>
              </div>

              {entries.map((entry, index) => (
                <div key={entry.id} className="relative bg-white border border-slate-200 p-5 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#0f4c5c] text-white font-bold rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    {index + 1}
                  </div>
                  
                  {entries.length > 1 && (
                    <button type="button" onClick={() => removeEntry(entry.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Olay</label>
                      <span className="block text-[11px] text-slate-500 mb-2 leading-tight h-8">Ne oldu? Kiminleydiniz? Neredeydiniz?</span>
                      <textarea rows={3} value={entry.olay} onChange={(e) => handleEntryChange(entry.id, 'olay', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Otomatik Düşünce</label>
                      <span className="block text-[11px] text-slate-500 mb-2 leading-tight h-8">Tam o sırada aklınızdan ne geçti?</span>
                      <textarea rows={3} value={entry.dusunce} onChange={(e) => handleEntryChange(entry.id, 'dusunce', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Duygu</label>
                      <span className="block text-[11px] text-slate-500 mb-2 leading-tight h-8">O an ne hissettiniz? (Öfke, üzüntü, kaygı vb.)</span>
                      <textarea rows={3} value={entry.duygu} onChange={(e) => handleEntryChange(entry.id, 'duygu', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Davranış</label>
                      <span className="block text-[11px] text-slate-500 mb-2 leading-tight h-8">Sonucunda ne yaptınız? Nasıl davrandınız?</span>
                      <textarea rows={3} value={entry.davranis} onChange={(e) => handleEntryChange(entry.id, 'davranis', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                    </div>
                  </div>
                </div>
              ))}

              {entries.length < 15 && (
                <button type="button" onClick={addEntry} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-[#6ec9c9] hover:text-[#0f4c5c] transition-all">
                  <Plus className="w-5 h-5" /> Yeni Kayıt Ekle
                </button>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button disabled={loading || !patientInfo.AdSoyad || !patientInfo.Telefon} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:bg-slate-300 text-[#082b34] px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                Formu Gönder
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}