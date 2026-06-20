"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Loader2, Send, BookOpenCheck } from "lucide-react";

export default function DusunceKayitPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Danışan Bilgileri
  const [patientInfo, setPatientInfo] = useState({
    AdSoyad: "",
    Telefon: "",
    Email: ""
  });

  // Dinamik tablo satırları (1 tane boş kayıt kartı ile başlar)
  const [entries, setEntries] = useState([
    { id: Date.now(), tarihSaat: "", durum: "", otomatikDusunce: "", duygularim: "", islevselTepki: "", sonuc: "" }
  ]);

  const addEntry = () => {
    if (entries.length < 15) {
      setEntries([...entries, { id: Date.now(), tarihSaat: "", durum: "", otomatikDusunce: "", duygularim: "", islevselTepki: "", sonuc: "" }]);
    }
  };

  const removeEntry = (id: number) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const handleEntryChange = (id: number, field: string, value: string) => {
    setEntries(entries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Dolu kayıtları filtrele
    const filledEntries = entries.filter(e => e.durum || e.otomatikDusunce || e.duygularim || e.islevselTepki || e.sonuc);

    if (filledEntries.length === 0) {
      setStatus({ type: "error", message: "Lütfen en az bir durum kaydı doldurunuz." });
      setLoading(false);
      return;
    }

    // E-posta ve Veritabanı için temiz veri objesi
    const cleanFormData: Record<string, string> = {};
    
    filledEntries.forEach((entry, index) => {
      cleanFormData[`Kayıt ${index + 1}`] = 
        `Tarih: ${entry.tarihSaat || "-"} | Durum: ${entry.durum || "-"} | Düşünce: ${entry.otomatikDusunce || "-"} | Duygu: ${entry.duygularim || "-"} | İşlevsel Tepki: ${entry.islevselTepki || "-"} | Sonuç: ${entry.sonuc || "-"}`;
    });

    // 1. Supabase 'intake_forms' tablosuna kaydet
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "dusunce_kayit",
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
      formTitle: "Düşünce Kayıt Formu",
      patientName: patientInfo.AdSoyad,
      patientEmail: patientInfo.Email,
      patientPhone: patientInfo.Telefon,
      formData: cleanFormData
    });

    if (mailResult.success) {
      setIsSuccess(true);
    } else {
      setStatus({ type: "error", message: "Form kaydedildi fakat e-posta iletilirken bir sorun yaşandı." });
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
            Düşünce kayıt formunuz uzmanımıza başarıyla iletilmiştir. Sürece katkınız için teşekkür ederiz.
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
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f4c5c] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#082b34] flex items-center gap-3">
            <BookOpenCheck className="w-8 h-8 text-[#6ec9c9]" />
            Düşünce Kayıt Formu
          </h1>
          <p className="text-slate-500 mt-2">Duygularınızı, düşüncelerinizi ve olaylara verdiğiniz tepkileri yapılandırılmış bir şekilde analiz etmek için aşağıdaki kayıtları kullanabilirsiniz.</p>
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
                <h3 className="font-bold text-[#082b34] text-lg">Düşünce Kayıtları</h3>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{entries.length} / 15</span>
              </div>

              {entries.map((entry, index) => (
                <div key={entry.id} className="relative bg-white border border-slate-200 p-6 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                  
                  {/* Kart Başlığı ve Silme Butonu */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#0f4c5c] text-white font-bold rounded-full flex items-center justify-center shadow-sm">
                        {index + 1}
                      </div>
                      <h4 className="font-bold text-[#082b34]">Kayıt Detayı</h4>
                    </div>
                    {entries.length > 1 && (
                      <button type="button" onClick={() => removeEntry(entry.id)} className="text-slate-300 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-semibold">
                        <Trash2 className="w-4 h-4" /> Sil
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sol Sütun */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Tarih / Saat</label>
                          <input type="text" value={entry.tarihSaat} onChange={(e) => handleEntryChange(entry.id, 'tarihSaat', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="Örn: Salı 14:30" />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Durum</label>
                          <span className="block text-[11px] text-slate-500 mb-1 leading-tight">1. Yaşadığınız olumsuz duyguya yol açan olay/anı neydi? <br/>2. Fiziksel bir duyum var mıydı?</span>
                          <textarea rows={2} value={entry.durum} onChange={(e) => handleEntryChange(entry.id, 'durum', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Otomatik Düşünceler</label>
                        <span className="block text-[11px] text-slate-500 mb-1 leading-tight">1. Aklınızdan ne tür düşünceler/görüntüler geçti? <br/>2. O sırada her birine ne kadar inandınız?</span>
                        <textarea rows={2} value={entry.otomatikDusunce} onChange={(e) => handleEntryChange(entry.id, 'otomatikDusunce', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Duygularım</label>
                        <span className="block text-[11px] text-slate-500 mb-1 leading-tight">1. O anda ne tür duygular yaşadınız? <br/>2. Bu duygu ne kadar güçlüydü?</span>
                        <textarea rows={2} value={entry.duygularim} onChange={(e) => handleEntryChange(entry.id, 'duygularim', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                      </div>
                    </div>

                    {/* Sağ Sütun */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">İşlevsel Tepki</label>
                        <span className="block text-[11px] text-slate-500 mb-1 leading-tight">1. O sırada ne tür düşünce çarpıtmaları yapmış olabilirsiniz? <br/>2. Otomatik düşüncenize karşıt olabilecek işlevsel tepkiniz nedir? <br/>3. Her tepkiye ne kadar inandığınızı belirtin.</span>
                        <textarea rows={4} value={entry.islevselTepki} onChange={(e) => handleEntryChange(entry.id, 'islevselTepki', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0f4c5c] uppercase mb-1">Sonuç</label>
                        <span className="block text-[11px] text-slate-500 mb-1 leading-tight">1. Her otomatik düşünceye şimdi ne kadar inanıyorsunuz? <br/>2. Şu anda ne tür duygular içindesiniz? (0-100 yoğunluğu nedir?) <br/>3. Şimdi ne yapacaksınız?</span>
                        <textarea rows={3} value={entry.sonuc} onChange={(e) => handleEntryChange(entry.id, 'sonuc', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="..." />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {entries.length < 15 && (
                <button type="button" onClick={addEntry} className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-[#6ec9c9] hover:text-[#0f4c5c] transition-all">
                  <Plus className="w-5 h-5" /> Yeni Düşünce Kaydı Ekle
                </button>
              )}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button disabled={loading || !patientInfo.AdSoyad || !patientInfo.Telefon} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:bg-slate-300 text-[#082b34] px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Formu Tamamla ve Gönder
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}