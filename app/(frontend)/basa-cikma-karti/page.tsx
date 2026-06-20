"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Baby, Users, Home, FileText } from "lucide-react";

export default function CocukErgenOnGorusmePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState({
    // Çocuğun Bilgileri
    formuDolduran: "",
    cocugunIsmi: "",
    cinsiyet: "",
    dogumTarihi: "",
    adres: "",
    evTelefonu: "",
    cepTelAnne: "",
    cepTelBaba: "",
    email: "", // Sistem için gerekli (Onay maili gidecek)
    yonlendiren: "",
    doktor: "",

    // Baba Bilgileri
    babaIsmi: "",
    babaDogum: "",
    babaIs: "",
    babaEgitim: "",
    babaYukumlu: "",

    // Anne Bilgileri
    anneIsmi: "",
    anneDogum: "",
    anneIs: "",
    anneEgitim: "",
    anneYukumlu: "",

    // Aile Düzeni
    evlenmeTarihi: "",
    medeniDurum: "",
    kimleYasiyor: "",
    bosanmaTarihi: "",
    evdeYasiyanlar: "",
    bakanBaskaKisiler: "",

    onay: false
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.onay) {
      alert("Lütfen bilgilendirme ve onam formunu onaylayın.");
      return;
    }

    setLoading(true);
    setStatus(null);

    // E-posta ve veritabanı için düzenli bir obje oluşturuyoruz
    const cleanFormData = {
      "1. GENEL BİLGİLER": "-------------------------",
      "Formu Dolduran": formData.formuDolduran || "Belirtilmemiş",
      "Çocuğun İsmi": formData.cocugunIsmi,
      "Cinsiyet": formData.cinsiyet || "Belirtilmemiş",
      "Doğum Tarihi": formData.dogumTarihi || "Belirtilmemiş",
      "Adres": formData.adres || "Belirtilmemiş",
      "Ev Telefonu": formData.evTelefonu || "Belirtilmemiş",
      "Anne Cep": formData.cepTelAnne || "Belirtilmemiş",
      "Baba Cep": formData.cepTelBaba || "Belirtilmemiş",
      "Çocuğu Yönlendiren": formData.yonlendiren || "Belirtilmemiş",
      "Doktoru": formData.doktor || "Belirtilmemiş",

      "2. BABA BİLGİLERİ": "-------------------------",
      "Baba Adı": formData.babaIsmi || "Belirtilmemiş",
      "Baba Doğum Tarihi": formData.babaDogum || "Belirtilmemiş",
      "Baba Mesleği": formData.babaIs || "Belirtilmemiş",
      "Baba Eğitimi": formData.babaEgitim || "Belirtilmemiş",
      "Baba Bakmakla Yükümlü Olduğu Kişi Sayısı": formData.babaYukumlu || "Belirtilmemiş",

      "3. ANNE BİLGİLERİ": "-------------------------",
      "Anne Adı": formData.anneIsmi || "Belirtilmemiş",
      "Anne Doğum Tarihi": formData.anneDogum || "Belirtilmemiş",
      "Anne Mesleği": formData.anneIs || "Belirtilmemiş",
      "Anne Eğitimi": formData.anneEgitim || "Belirtilmemiş",
      "Anne Bakmakla Yükümlü Olduğu Kişi Sayısı": formData.anneYukumlu || "Belirtilmemiş",

      "4. AİLE DÜZENİ": "-------------------------",
      "Mevcut Medeni Durum": formData.medeniDurum || "Belirtilmemiş",
      "Evlenme Tarihi": formData.evlenmeTarihi || "Belirtilmemiş",
      "Çocuk Kiminle Yaşıyor?": formData.kimleYasiyor || "Belirtilmemiş",
      "Boşanma/Ayrılma Tarihi": formData.bosanmaTarihi || "Yok",
      "Evde Yaşayan Diğer Bireyler": formData.evdeYasiyanlar || "Yok",
      "Çocuğa Bakan Başka Kişiler": formData.bakanBaskaKisiler || "Yok"
    };

    // 1. Supabase Kaydı
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "cocuk_ergen_on_gorusme",
      patient_name: formData.cocugunIsmi, // Ana kayıt ismi çocuk olarak geçiyor
      patient_email: formData.email,
      patient_phone: formData.cepTelAnne || formData.cepTelBaba || formData.evTelefonu, // Herhangi bir telefonu alıyoruz
      form_data: cleanFormData,
      is_read: false
    });

    if (dbError) {
      setStatus({ type: "error", message: "Veritabanı kayıt hatası: " + dbError.message });
      setLoading(false);
      return;
    }

    // 2. Nodemailer E-posta Bildirimi
    const mailResult = await sendIntakeFormEmail({
      formTitle: "Çocuk/Ergen Ön Görüşme Formu",
      patientName: formData.cocugunIsmi,
      patientEmail: formData.email,
      patientPhone: formData.cepTelAnne || formData.cepTelBaba,
      formData: cleanFormData
    });

    if (mailResult.success) {
      setStep(5); // Başarı ekranı
    } else {
      setStatus({ type: "error", message: "Form sisteme kaydedildi ancak e-posta bildiriminde aksama yaşandı." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f4c5c] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#082b34]">Çocuk ve Ergen Ön Görüşme Formu</h1>
          <p className="text-slate-500 mt-2">Çocuğunuzla yapacağımız değerlendirme görüşmeleri öncesinde aileyi ve çocuğu daha yakından tanımamız için lütfen bu formu eksiksiz doldurunuz.</p>
        </div>

        {/* Adım İndikatörü */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8 relative px-2 md:px-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#6ec9c9] -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            {[
              { s: 1, icon: <Baby className="w-5 h-5" />, title: "Çocuk Bilgisi" },
              { s: 2, icon: <Users className="w-5 h-5" />, title: "Ebeveynler" },
              { s: 3, icon: <Home className="w-5 h-5" />, title: "Aile Düzeni" },
              { s: 4, icon: <FileText className="w-5 h-5" />, title: "Onam" }
            ].map((item) => (
              <div key={item.s} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold border-4 transition-all ${step >= item.s ? 'bg-[#0f4c5c] text-white border-white shadow-md' : 'bg-slate-100 text-slate-400 border-white'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase ${step >= item.s ? 'text-[#0f4c5c]' : 'text-slate-400'}`}>{item.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Form Gövdesi */}
        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-sm">
          {status && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* ADIM 1: ÇOCUK BİLGİLERİ */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#082b34] border-b pb-2 mb-4">1. Çocuğun Bilgileri</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Formu Dolduranın Yakınlığı *</label>
                    <input required type="text" value={formData.formuDolduran} onChange={(e) => setFormData({...formData, formuDolduran: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Örn: Annesi, Babası" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Çocuğun İsmi *</label>
                    <input required type="text" value={formData.cocugunIsmi} onChange={(e) => setFormData({...formData, cocugunIsmi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Çocuğun tam adı" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Cinsiyet *</label>
                    <div className="flex gap-6 mt-1">
                      {["Kız", "Erkek"].map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="cinsiyet" checked={formData.cinsiyet === c} onChange={() => setFormData({...formData, cinsiyet: c})} required className="w-4 h-4 accent-[#0f4c5c]" />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Doğum Tarihi *</label>
                    <input required type="date" value={formData.dogumTarihi} onChange={(e) => setFormData({...formData, dogumTarihi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Cep Telefonu (Anne) *</label>
                    <input required type="tel" value={formData.cepTelAnne} onChange={(e) => setFormData({...formData, cepTelAnne: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Cep Telefonu (Baba) *</label>
                    <input required type="tel" value={formData.cepTelBaba} onChange={(e) => setFormData({...formData, cepTelBaba: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ev Telefonu</label>
                    <input type="tel" value={formData.evTelefonu} onChange={(e) => setFormData({...formData, evTelefonu: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Opsiyonel" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta Adresi (İletişim için) *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="ornek@mail.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Çocuğu Yönlendiren Kişi/Kurum</label>
                    <input type="text" value={formData.yonlendiren} onChange={(e) => setFormData({...formData, yonlendiren: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Öğretmeni, Doktoru vb." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Çocuğun/Ailenin Doktoru</label>
                    <input type="text" value={formData.doktor} onChange={(e) => setFormData({...formData, doktor: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Varsa doktorunun adı" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Açık Adres *</label>
                  <textarea required rows={2} value={formData.adres} onChange={(e) => setFormData({...formData, adres: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="İkametgah adresiniz" />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" onClick={nextStep} disabled={!formData.cocugunIsmi || !formData.cepTelAnne || !formData.email} className="bg-[#0f4c5c] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 2: BABA VE ANNE BİLGİLERİ */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in duration-300">
                
                {/* BABA BİLGİLERİ */}
                <div>
                  <h3 className="text-lg font-bold text-[#082b34] border-b pb-2 mb-4">2. Ebeveyn Bilgileri</h3>
                  <h4 className="text-sm font-bold text-[#0f4c5c] mb-3 bg-slate-50 p-2 rounded-lg">Babanın Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Babanın İsmi</label>
                      <input type="text" value={formData.babaIsmi} onChange={(e) => setFormData({...formData, babaIsmi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Babanın Doğum Tarihi</label>
                      <input type="date" value={formData.babaDogum} onChange={(e) => setFormData({...formData, babaDogum: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Babanın Mesleği / İşi</label>
                      <input type="text" value={formData.babaIs} onChange={(e) => setFormData({...formData, babaIs: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Babanın Eğitimi</label>
                      <input type="text" value={formData.babaEgitim} onChange={(e) => setFormData({...formData, babaEgitim: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Babanın Bakmakla Yükümlü Olduğu Kişi Sayısı</label>
                      <input type="text" value={formData.babaYukumlu} onChange={(e) => setFormData({...formData, babaYukumlu: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Kendisi dışında evde bakmakla yükümlü olduğu kişi sayısı" />
                    </div>
                  </div>
                </div>

                {/* ANNE BİLGİLERİ */}
                <div>
                  <h4 className="text-sm font-bold text-[#0f4c5c] mb-3 bg-slate-50 p-2 rounded-lg">Annenin Bilgileri</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Annenin İsmi</label>
                      <input type="text" value={formData.anneIsmi} onChange={(e) => setFormData({...formData, anneIsmi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Annenin Doğum Tarihi</label>
                      <input type="date" value={formData.anneDogum} onChange={(e) => setFormData({...formData, anneDogum: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Annenin Mesleği / İşi</label>
                      <input type="text" value={formData.anneIs} onChange={(e) => setFormData({...formData, anneIs: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Annenin Eğitimi</label>
                      <input type="text" value={formData.anneEgitim} onChange={(e) => setFormData({...formData, anneEgitim: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Annenin Bakmakla Yükümlü Olduğu Kişi Sayısı</label>
                      <input type="text" value={formData.anneYukumlu} onChange={(e) => setFormData({...formData, anneYukumlu: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Kendisi dışında evde bakmakla yükümlü olduğu kişi sayısı" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={prevStep} className="text-slate-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100">Geri Dön</button>
                  <button type="button" onClick={nextStep} className="bg-[#0f4c5c] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 3: AİLE DÜZENİ */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#082b34] border-b pb-2 mb-4">3. Aile Düzeni</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Mevcut Medeni Durum *</label>
                    <input required type="text" value={formData.medeniDurum} onChange={(e) => setFormData({...formData, medeniDurum: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Evli, Bekar, Boşanmış vb." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Evlenme Tarihi</label>
                    <input type="date" value={formData.evlenmeTarihi} onChange={(e) => setFormData({...formData, evlenmeTarihi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Çocuk Kiminle Yaşıyor? *</label>
                    <input required type="text" value={formData.kimleYasiyor} onChange={(e) => setFormData({...formData, kimleYasiyor: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Öz Anne-Baba, Sadece Anne vb." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Eğer Öz Anne-Baba ayrılmışsa boşanma tarihi</label>
                    <input type="date" value={formData.bosanmaTarihi} onChange={(e) => setFormData({...formData, bosanmaTarihi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Evde yaşayan diğer bireyleri sıralayın</label>
                    <span className="block text-[11px] text-slate-500 mb-2 leading-tight">Lütfen İsim - Çocuğa yakınlık derecesi - Mevcut Sağlık Durumu şeklinde belirtiniz.</span>
                    <textarea rows={3} value={formData.evdeYasiyanlar} onChange={(e) => setFormData({...formData, evdeYasiyanlar: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="Örn: Ayşe Yılmaz - Kardeşi - Sağlıklı" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Çocuğa belirgin bir süre bakan başka kişileri sıralayın</label>
                    <span className="block text-[11px] text-slate-500 mb-2 leading-tight">Lütfen İsim - Çocuğa yakınlık derecesi şeklinde belirtiniz.</span>
                    <textarea rows={2} value={formData.bakanBaskaKisiler} onChange={(e) => setFormData({...formData, bakanBaskaKisiler: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="Örn: Fatma Hanım - Anneannesi" />
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={prevStep} className="text-slate-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100">Geri Dön</button>
                  <button type="button" onClick={nextStep} disabled={!formData.medeniDurum || !formData.kimleYasiyor} className="bg-[#0f4c5c] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 4: ONAM FORMU */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-xl font-bold text-[#082b34] border-b pb-2 mb-2">4. Bilgilendirme Onay Formu</h3>
                
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs text-slate-600 space-y-3 h-64 overflow-y-auto leading-relaxed shadow-inner">
                  <p className="font-bold text-sm text-[#082b34]">Bilgilendirme Onay Formu</p>
                  <p>Bu form, Uzm. Psk. Aygün Tuçe Ataş Önç'ten alacağınız çocuk ve ergen psikolojik danışmanlık hizmetleri hakkında sizi bilgilendirmek ve koşullar üzerinde anlaştığımızı onaylamak için hazırlanmıştır.</p>
                  <p>Merkezimize hoş geldiniz. Antalya'daki kliniğimizde Bilişsel Davranışçı Terapi, EMDR, Oyun Terapisi, Şema Terapi ve SOBECE uygulamaları yapılmaktadır. Gerektiğinde gelişim, zeka ve kişilik testleriyle değerlendirme sağlanmaktadır.</p>
                  <p>Burada uygulanan yöntemlerin durumunuza uygun olmadığı değerlendirilirse veya psikiyatrik/medikal bir müdahale gerekirse, çocuğunuzu ilgili bir çocuk psikiyatristine veya hekime yönlendirmekteyiz.</p>
                  <p>Bize verdiğiniz her türlü kişisel bilgi, seans notları veya raporlar kesinlikle gizli tutulur. İzniniz ve onayınız olmadan (okul vb. kurumlar dahil) paylaşılmaz. Sadece çocuğun kendisine veya bir başkasına zarar verme riski taşıyan acil ve hukuki durumlarda bu gizlilik ilkesi esnetilebilir.</p>
                  <p>Seanslar ortalama 50 dakika sürer ve genellikle "haftada bir kez" olarak planlanır. Ebeveyn görüşmeleri de aynı ücrete tabidir. Randevunuzu iptal etmek isterseniz, en geç 24 saat öncesinden haber vermeniz rica olunur. Randevu gününüz içerisinde iptal ettiğiniz durumlarda, seans ücretinin yarısı talep edilir. Geç kalındığında görüşme süresi uzatılamaz.</p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 text-sm text-slate-700 font-semibold cursor-pointer select-none">
                    <input type="checkbox" checked={formData.onay} onChange={(e) => setFormData({...formData, onay: e.target.checked})} required className="w-5 h-5 accent-[#0f4c5c] rounded mt-0.5 shrink-0" />
                    <span>Yukarıda verilen bilgilendirme onam formunu okudum, anladım ve çocuğum adına koşulları kabul ediyorum. *</span>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={prevStep} className="text-slate-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100">Geri Dön</button>
                  <button disabled={loading || !formData.onay} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:bg-slate-300 text-[#082b34] px-10 py-3 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-md">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Formu Gönder ve Tamamla"}
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 5: BAŞARI EKRANI */}
            {step === 5 && (
              <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#082b34] mb-3">Form Başarıyla İletildi!</h2>
                <p className="text-slate-600 max-w-md mx-auto mb-8 text-sm">
                  {formData.cocugunIsmi} için oluşturduğunuz ön görüşme formu güvenli klinik otomasyon sistemimize kaydedilmiş ve uzmanımıza iletilmiştir.
                </p>
                <Link href="/" className="inline-flex items-center text-[#0f4c5c] font-bold text-sm hover:text-[#6ec9c9] transition-colors bg-slate-100 px-6 py-3 rounded-xl border border-slate-200 shadow-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
                </Link>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}