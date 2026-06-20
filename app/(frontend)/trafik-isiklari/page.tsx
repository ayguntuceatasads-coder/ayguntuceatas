"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, CheckCircle2, Loader2, Send, Navigation } from "lucide-react";

export default function TrafikIsiklariPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Danışan Bilgileri
  const [patientInfo, setPatientInfo] = useState({
    AdSoyad: "",
    Telefon: "",
    Email: ""
  });

  // Trafik Işıkları Verileri
  const [formData, setFormData] = useState({
    kirmizi: "",
    sari: "",
    yesil: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // E-posta ve Veritabanı için temiz JSON formatı
    const cleanFormData = {
      "🔴 KIRMIZI IŞIK (DUR!)": "-------------------------",
      "Yaşanan Sorun": formData.kirmizi,
      
      "🟡 SARI IŞIK (DÜŞÜN!)": "-------------------------",
      "Olası Çözümler": formData.sari,
      
      "🟢 YEŞİL IŞIK (HAREKETE GEÇ!)": "-------------------------",
      "Uygulanan En İyi Çözüm": formData.yesil
    };

    // 1. Supabase 'intake_forms' tablosuna kaydet
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "trafik_isiklari",
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
      formTitle: "Trafik Işıkları Problem Çözme Formu",
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
          <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#082b34] mb-3">Harika Bir İşe İmza Attın!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Sorununu trafik ışıkları yöntemiyle başarıyla çözdün ve uzmanımıza gönderdin. Yeşil ışıkta ilerlemeye devam et!
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
      <div className="container mx-auto px-4 max-w-3xl">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f4c5c] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#082b34] flex items-center gap-3">
            <Navigation className="w-8 h-8 text-[#6ec9c9]" />
            Trafik Işıkları Formu
          </h1>
          <p className="text-slate-500 mt-2">Karşılaştığın bir sorunu daha kolay çözebilmek için trafik ışıklarını takip et.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-sm">
          {status && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Danışan Bilgileri */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-bold text-[#082b34] mb-4">Senin Bilgilerin</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ad Soyad *</label>
                  <input required type="text" value={patientInfo.AdSoyad} onChange={(e) => setPatientInfo({...patientInfo, AdSoyad: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Adın ve Soyadın" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon *</label>
                  <input required type="tel" value={patientInfo.Telefon} onChange={(e) => setPatientInfo({...patientInfo, Telefon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="İletişim Numaran" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta</label>
                  <input type="email" value={patientInfo.Email} onChange={(e) => setPatientInfo({...patientInfo, Email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Opsiyonel" />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              
              {/* KIRMIZI IŞIK */}
              <div className="flex gap-4 items-start bg-red-50/50 p-5 rounded-2xl border border-red-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -z-10"></div>
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.4)] shrink-0 mt-1 border-4 border-white"></div>
                <div className="flex-1">
                  <label className="block text-lg font-bold text-red-700 mb-1">DUR!</label>
                  <span className="block text-sm text-red-600/80 font-medium mb-3">Yaşadığın sorun ne? Neler oluyor?</span>
                  <textarea required rows={3} value={formData.kirmizi} onChange={(e) => setFormData({...formData, kirmizi: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-red-200 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all text-sm resize-none bg-white" placeholder="Sorunu buraya yaz..." />
                </div>
              </div>

              {/* SARI IŞIK */}
              <div className="flex gap-4 items-start bg-amber-50/50 p-5 rounded-2xl border border-amber-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-10"></div>
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)] shrink-0 mt-1 border-4 border-white"></div>
                <div className="flex-1">
                  <label className="block text-lg font-bold text-amber-700 mb-1">DÜŞÜN!</label>
                  <span className="block text-sm text-amber-600/80 font-medium mb-3">Aklına gelen çözümler neler? Seçeneklerini sırala.</span>
                  <textarea required rows={3} value={formData.sari} onChange={(e) => setFormData({...formData, sari: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-amber-200 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all text-sm resize-none bg-white" placeholder="Olası çözümlerini buraya yaz..." />
                </div>
              </div>

              {/* YEŞİL IŞIK */}
              <div className="flex gap-4 items-start bg-green-50/50 p-5 rounded-2xl border border-green-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -z-10"></div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] shrink-0 mt-1 border-4 border-white"></div>
                <div className="flex-1">
                  <label className="block text-lg font-bold text-green-700 mb-1">HAREKETE GEÇ!</label>
                  <span className="block text-sm text-green-600/80 font-medium mb-3">Bulduğun seçeneklerden en iyisini seç ve uygula. Sonucu nasıl oldu?</span>
                  <textarea required rows={3} value={formData.yesil} onChange={(e) => setFormData({...formData, yesil: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-green-200 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all text-sm resize-none bg-white" placeholder="Seçtiğin çözümü ve sonucunu buraya yaz..." />
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button disabled={loading || !patientInfo.AdSoyad || !patientInfo.Telefon} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:bg-slate-300 text-[#082b34] px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Formu Gönder
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}