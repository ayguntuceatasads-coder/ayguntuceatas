"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, CheckCircle2, Loader2, Send, Scale, BrainCircuit, Sparkles } from "lucide-react";

export default function KanitlariTaramaPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Danışan Bilgileri
  const [patientInfo, setPatientInfo] = useState({
    AdSoyad: "",
    Telefon: "",
    Email: ""
  });

  // Form Verileri
  const [formData, setFormData] = useState({
    olay: "",
    otomatikDusunce: "",
    duygu: "",
    davranis: "",
    destekleyenKanitlar: "",
    desteklemeyenKanitlar: "",
    yeniGercekciDusunce: "",
    yeniDuygu: "",
    yeniDavranis: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // E-posta ve veritabanı için okunabilir, şık veri objesi
    const cleanFormData = {
      "1. DURUM ANALİZİ": "-------------------------",
      "Olay": formData.olay,
      "Otomatik Düşünce": formData.otomatikDusunce,
      "Duygu Şiddeti (0-10)": formData.duygu,
      "Davranış": formData.davranis,
      "2. KANIT SORGULAMASI": "-------------------------",
      "Düşünceyi Destekleyen Kanıtlar": formData.destekleyenKanitlar,
      "Düşünceyi Desteklemeyen Kanıtlar": formData.desteklemeyenKanitlar,
      "3. YENİDEN YAPILANDIRMA": "-------------------------",
      "Yeni Gerçekçi Düşünce": formData.yeniGercekciDusunce,
      "Yeni Duygu Şiddeti (0-10)": formData.yeniDuygu,
      "Yeni Davranış": formData.yeniDavranis
    };

    // 1. Supabase Kaydı
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "kanitlari_tarama",
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
      formTitle: "Kanıtları Tarama Formu",
      patientName: patientInfo.AdSoyad,
      patientEmail: patientInfo.Email,
      patientPhone: patientInfo.Telefon,
      formData: cleanFormData
    });

    if (mailResult.success) {
      setIsSuccess(true);
    } else {
      setStatus({ type: "error", message: "Form kaydedildi fakat e-posta iletilirken bir aksama yaşandı." });
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
            Düşünce analizi formunuz sisteme güvenle kaydedilmiştir. Sürece olan katkınız için teşekkür ederiz.
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
          <h1 className="text-3xl font-bold text-[#082b34]">Kanıtları Tarama Formu</h1>
          <p className="text-slate-500 mt-2">Aklınızdan geçen otomatik düşüncelerin ne kadar gerçekçi olduğunu kanıtlar eşliğinde değerlendirmek için aşağıdaki adımları sırayla doldurunuz.</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-sm">
          {status && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
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

            {/* Bölüm 1: Mevcut Durum Analizi */}
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-6">
                <div className="p-2 bg-[#0f4c5c]/10 rounded-lg text-[#0f4c5c]"><BrainCircuit className="w-5 h-5" /></div>
                <h3 className="font-bold text-[#082b34] text-lg">1. Mevcut Durum Analizi</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Olay</label>
                  <textarea required rows={3} value={formData.olay} onChange={(e) => setFormData({...formData, olay: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="Ne oldu?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Otomatik Düşüncem</label>
                  <textarea required rows={3} value={formData.otomatikDusunce} onChange={(e) => setFormData({...formData, otomatikDusunce: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="Tam o sırada aklından ne geçti?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Duygum (0-10 Arası)</label>
                  <input required type="number" min="0" max="10" value={formData.duygu} onChange={(e) => setFormData({...formData, duygu: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm bg-slate-50 focus:bg-white transition-colors" placeholder="0 (Hissiz) - 10 (Çok yoğun)" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Davranışım</label>
                  <textarea required rows={1} value={formData.davranis} onChange={(e) => setFormData({...formData, davranis: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="Bunun sonucunda ne yaptın?" />
                </div>
              </div>
            </div>

            {/* Bölüm 2: Kanıt Sorgulaması */}
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-6">
                <div className="p-2 bg-[#6ec9c9]/10 rounded-lg text-[#0f4c5c]"><Scale className="w-5 h-5" /></div>
                <h3 className="font-bold text-[#082b34] text-lg">2. Kanıt Sorgulaması</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#082b34] mb-2">Düşüncemi DESTEKLEYEN Kanıtlar</label>
                  <textarea required rows={4} value={formData.destekleyenKanitlar} onChange={(e) => setFormData({...formData, destekleyenKanitlar: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="Bu düşüncenizin doğru olduğunu gösteren somut kanıtlar nelerdir?" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#082b34] mb-2">Düşüncemi DESTEKLEMEYEN Kanıtlar</label>
                  <textarea required rows={4} value={formData.desteklemeyenKanitlar} onChange={(e) => setFormData({...formData, desteklemeyenKanitlar: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm resize-none bg-slate-50 focus:bg-white transition-colors" placeholder="Bu düşüncenin %100 doğru olmadığını gösteren istisnalar veya kanıtlar nelerdir?" />
                </div>
              </div>
            </div>

            {/* Bölüm 3: Yeniden Yapılandırma */}
            <div>
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-6">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Sparkles className="w-5 h-5" /></div>
                <h3 className="font-bold text-[#082b34] text-lg">3. Yeniden Yapılandırma</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Yeni Gerçekçi Düşüncem</label>
                  <textarea required rows={3} value={formData.yeniGercekciDusunce} onChange={(e) => setFormData({...formData, yeniGercekciDusunce: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-amber-200/60 outline-none focus:border-amber-400 text-sm resize-none bg-amber-50/50 focus:bg-white transition-colors" placeholder="Kanıtları değerlendirdikten sonra bu duruma dair daha dengeli ve gerçekçi düşünceniz nedir?" />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Yeni Duygum (0-10 Arası)</label>
                  <input required type="number" min="0" max="10" value={formData.yeniDuygu} onChange={(e) => setFormData({...formData, yeniDuygu: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-amber-200/60 outline-none focus:border-amber-400 text-sm bg-amber-50/50 focus:bg-white transition-colors" placeholder="0 - 10 Arası Puanlayın" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-[#0f4c5c] uppercase mb-1">Yeni Davranışım</label>
                  <textarea required rows={1} value={formData.yeniDavranis} onChange={(e) => setFormData({...formData, yeniDavranis: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-amber-200/60 outline-none focus:border-amber-400 text-sm resize-none bg-amber-50/50 focus:bg-white transition-colors" placeholder="Bu yeni düşünceyle ne yapmayı seçerdiniz?" />
                </div>
              </div>
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