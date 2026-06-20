"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, User, Heart, HelpCircle, FileText } from "lucide-react";

export default function YetiskinOnGorusmePage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form elemanlarının state yapısı
  const [formData, setFormData] = useState({
    AdiSoyadi: "",
    cinsiyet: "",
    dogumyili: "",
    MedeniDurum: "",
    cocuklariniz: [] as string[],
    ogrenim: "",
    universitebolumu: "",
    meslek: "",
    telefon: "",
    email: "",
    adres: "",
    
    // Acil Durum
    YakiniAdiSoyadi: "",
    YakinlikDerecesi: "",
    YakiniTelefon: "",
    
    // Sağlık
    kronikrahatsizlik: "",
    rahatsizlik: "",
    
    // Başvuru
    nasilulastiniz: "",
    nasilulastinizdiger: "",
    dahaoncepsikolog: "",
    dahaoncepsikiyatrist: "",
    ilackullanimi: "",
    ilacisimleri: "",
    
    // Onay
    onay: false
  });

  const handleCheckboxChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      cocuklariniz: prev.cocuklariniz.includes(value)
        ? prev.cocuklariniz.filter((c) => c !== value)
        : [...prev.cocuklariniz, value]
    }));
  };

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

    // Mail ve Admin paneli için Türkçe etiketlerle şık bir obje hazırlıyoruz
    const cleanFormData = {
      "Cinsiyet": formData.cinsiyet || "Belirtilmemiş",
      "Doğum Yılı": formData.dogumyili || "Belirtilmemiş",
      "Medeni Durum": formData.MedeniDurum || "Belirtilmemiş",
      "Çocuk Durumu": formData.cocuklariniz.length > 0 ? formData.cocuklariniz.join(", ") : "Yok/Belirtilmemiş",
      "Öğrenim Durumu": formData.ogrenim || "Belirtilmemiş",
      "Üniversite Bölümü": formData.universitebolumu || "Belirtilmemiş",
      "Meslek": formData.meslek || "Belirtilmemiş",
      "Adres": formData.adres || "Belirtilmemiş",
      "Acil Durum Yakını": formData.YakiniAdiSoyadi || "Belirtilmemiş",
      "Yakınlık Derecesi": formData.YakinlikDerecesi || "Belirtilmemiş",
      "Yakını Telefonu": formData.YakiniTelefon || "Belirtilmemiş",
      "Kronik Rahatsızlık Var mı?": formData.kronikrahatsizlik || "Belirtilmemiş",
      "Rahatsızlık Detayı": formData.rahatsizlik || "Yok",
      "Bize Nasıl Ulaştınız?": formData.nasilulastiniz === "Diğer" ? `Diğer: ${formData.nasilulastinizdiger}` : formData.nasilulastiniz,
      "Daha Önce Psikolog Görüşmesi?": formData.dahaoncepsikolog || "Belirtilmemiş",
      "Daha Önce Psikiyatrist Görüşmesi?": formData.dahaoncepsikiyatrist || "Belirtilmemiş",
      "Şu An Psikiyatrik İlaç Kullanımı?": formData.ilackullanimi || "Belirtilmemiş",
      "Kullanılan İlaçlar": formData.ilacisimleri || "Yok"
    };

    // 1. Supabase 'intake_forms' tablosuna JSONB olarak kayıt atıyoruz
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "yetiskin_on_gorusme",
      patient_name: formData.AdiSoyadi,
      patient_email: formData.email,
      patient_phone: formData.telefon,
      form_data: cleanFormData,
      is_read: false
    });

    if (dbError) {
      setStatus({ type: "error", message: "Veritabanı kayıt hatası: " + dbError.message });
      setLoading(false);
      return;
    }

    // 2. Nodemailer Mail Servisini Tetikliyoruz
    const mailResult = await sendIntakeFormEmail({
      formTitle: "Yetişkin Ön Görüşme Formu",
      patientName: formData.AdiSoyadi,
      patientEmail: formData.email,
      patientPhone: formData.telefon,
      formData: cleanFormData
    });

    if (mailResult.success) {
      setStep(5); // Başarı adımı
    } else {
      setStatus({ type: "error", message: "Form kaydedildi fakat e-posta gönderilirken bir aksama yaşandı." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Üst Başlık Bilgisi */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f4c5c] mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Anasayfaya Dön
          </Link>
          <h1 className="text-3xl font-bold text-[#082b34]">Yetişkin Ön Görüşme Formu</h1>
          <p className="text-slate-500 mt-1">Lütfen seans öncesi değerlendirme süreciniz için aşağıdaki bilgileri eksiksiz doldurunuz.</p>
        </div>

        {/* Adım İndikatörü */}
        {step < 5 && (
          <div className="flex items-center justify-between mb-8 relative px-2">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#6ec9c9] -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            {[
              { s: 1, icon: <User className="w-4 h-4" /> },
              { s: 2, icon: <Heart className="w-4 h-4" /> },
              { s: 3, icon: <HelpCircle className="w-4 h-4" /> },
              { s: 4, icon: <FileText className="w-4 h-4" /> }
            ].map((item) => (
              <div key={item.s} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border-4 text-xs transition-all ${step >= item.s ? 'bg-[#0f4c5c] text-white border-white shadow-sm' : 'bg-slate-100 text-slate-400 border-white'}`}>
                {item.icon}
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
            
            {/* ADIM 1: KİŞİSEL BİLGİLER */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-[#082b34] border-b pb-2 mb-4">1. Kişisel Bilgiler</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ad Soyad *</label>
                    <input required type="text" value={formData.AdiSoyadi} onChange={(e) => setFormData({...formData, AdiSoyadi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Danışanın Adı Soyadı" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Cinsiyet *</label>
                    <div className="flex gap-4 mt-2">
                      {["Kadın", "Erkek"].map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="cinsiyet" checked={formData.cinsiyet === c} onChange={() => setFormData({...formData, cinsiyet: c})} required className="w-4 h-4 accent-[#0f4c5c]" />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Doğum Yılı *</label>
                    <input required type="number" value={formData.dogumyili} onChange={(e) => setFormData({...formData, dogumyili: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Örn: 1992" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Medeni Durum *</label>
                    <input required type="text" value={formData.MedeniDurum} onChange={(e) => setFormData({...formData, MedeniDurum: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Evli / Bekar" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Varsa Çocuklarınız</label>
                    <div className="flex gap-4 mt-2">
                      {["Kız", "Erkek"].map((c) => (
                        <label key={c} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="checkbox" checked={formData.cocuklariniz.includes(c)} onChange={() => handleCheckboxChange(c)} className="w-4 h-4 accent-[#0f4c5c] rounded" />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Öğrenim Durumu *</label>
                    <input required type="text" value={formData.ogrenim} onChange={(e) => setFormData({...formData, ogrenim: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Lisans, Yüksek Lisans vb." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Üniversite Bölümü</label>
                    <input type="text" value={formData.universitebolumu} onChange={(e) => setFormData({...formData, universitebolumu: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Mezun olunan / okunan bölüm" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Meslek / İşiniz *</label>
                    <input required type="text" value={formData.meslek} onChange={(e) => setFormData({...formData, meslek: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Mühendis, Öğretmen vb." />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon *</label>
                    <input required type="tel" value={formData.telefon} onChange={(e) => setFormData({...formData, telefon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="05XX XXX XX XX" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta Adresi *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="ornek@mail.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Adres *</label>
                  <textarea required rows={2} value={formData.adres} onChange={(e) => setFormData({...formData, adres: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="İkametgah adresiniz" />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" onClick={nextStep} disabled={!formData.AdiSoyadi || !formData.telefon || !formData.email} className="bg-[#0f4c5c] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 2: ACİL DURUM VE SAĞLIK BİLGİLERİ */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-lg font-bold text-[#082b34] border-b pb-2 mb-4">2. Acil Durum İletişim Yakını</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Yakının Adı Soyadı *</label>
                      <input required type="text" value={formData.YakiniAdiSoyadi} onChange={(e) => setFormData({...formData, YakiniAdiSoyadi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Adı Soyadı" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Yakınlık Derecesi *</label>
                      <input required type="text" value={formData.YakinlikDerecesi} onChange={(e) => setFormData({...formData, YakinlikDerecesi: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Örn: Eşi, Annesi" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Yakının Telefonu *</label>
                      <input required type="tel" value={formData.YakiniTelefon} onChange={(e) => setFormData({...formData, YakiniTelefon: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Telefon Numarası" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-bold text-[#082b34] mb-3">Genel Tıbbi Sağlık Bilgileri</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Herhangi bir kronik rahatsızlığınız var mı? *</label>
                      <div className="flex gap-6">
                        {["Evet", "Hayır"].map((r) => (
                          <label key={r} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                            <input type="radio" name="kronik" checked={formData.kronikrahatsizlik === r} onChange={() => setFormData({...formData, kronikrahatsizlik: r})} required className="w-4 h-4 accent-[#0f4c5c]" />
                            {r}
                          </label>
                        ))}
                      </div>
                    </div>
                    {formData.kronikrahatsizlik === "Evet" && (
                      <div className="animate-in fade-in duration-200">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Evet ise lütfen belirtiniz:</label>
                        <input type="text" value={formData.rahatsizlik} onChange={(e) => setFormData({...formData, rahatsizlik: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Rahatsızlığınızı buraya yazabilirsiniz." />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={prevStep} className="text-slate-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100">Geri Dön</button>
                  <button type="button" onClick={nextStep} disabled={!formData.YakiniAdiSoyadi || !formData.YakiniTelefon || !formData.kronikrahatsizlik} className="bg-[#0f4c5c] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 3: BAŞVURU BİLGİLERİ */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-[#082b34] border-b pb-2 mb-4">3. Başvuru Bilgileri</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bize Nasıl Ulaştınız? *</label>
                    <div className="flex flex-wrap gap-4">
                      {["Web Sitesi", "Tavsiye", "Uzman Yönlendirmesi", "Diğer"].map((u) => (
                        <label key={u} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="nasilulastiniz" checked={formData.nasilulastiniz === u} onChange={() => setFormData({...formData, nasilulastiniz: u})} required className="w-4 h-4 accent-[#0f4c5c]" />
                          {u}
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.nasilulastiniz === "Diğer" && (
                    <div className="animate-in fade-in duration-200">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Lütfen belirtiniz:</label>
                      <input type="text" value={formData.nasilulastinizdiger} onChange={(e) => setFormData({...formData, nasilulastinizdiger: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Nereden ulaştığınızı yazabilirsiniz." />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Daha önce bir psikologla görüştünüz mü? *</label>
                    <div className="flex gap-4">
                      {["Evet", "Hayır"].map((r) => (
                        <label key={r} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="dahaoncepsikolog" checked={formData.dahaoncepsikolog === r} onChange={() => setFormData({...formData, dahaoncepsikolog: r})} required className="w-4 h-4 accent-[#0f4c5c]" />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Daha önce bir psikiyatriste gittiniz mi? *</label>
                    <div className="flex gap-4">
                      {["Evet", "Hayır"].map((r) => (
                        <label key={r} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="dahaoncepsikiyatrist" checked={formData.dahaoncepsikiyatrist === r} onChange={() => setFormData({...formData, dahaoncepsikiyatrist: r})} required className="w-4 h-4 accent-[#0f4c5c]" />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Şu anda psikiyatrik bir ilaç kullanıyor musunuz? *</label>
                    <div className="flex gap-4">
                      {["Evet", "Hayır"].map((r) => (
                        <label key={r} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="ilackullanimi" checked={formData.ilackullanimi === r} onChange={() => setFormData({...formData, ilackullanimi: r})} required className="w-4 h-4 accent-[#0f4c5c]" />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.ilackullanimi === "Evet" && (
                    <div className="animate-in fade-in duration-200">
                      <label className="block text-sm font-semibold text-slate-700 mb-1">İlacın / İlaçların adını belirtiniz:</label>
                      <input type="text" value={formData.ilacisimleri} onChange={(e) => setFormData({...formData, ilacisimleri: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Kullandığınız ilaç isimleri" />
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kısaca Başvuru Sebebiniz / Eklemek İstedikleriniz (Opsiyonel)</label>
                  <textarea rows={2} value={formData.ilacisimleri} onChange={(e) => setFormData({...formData, ilacisimleri: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="Belirtmek istediğiniz ek notlar..." />
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={prevStep} className="text-slate-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100">Geri Dön</button>
                  <button type="button" onClick={nextStep} disabled={!formData.nasilulastiniz || !formData.dahaoncepsikolog || !formData.dahaoncepsikiyatrist || !formData.ilackullanimi} className="bg-[#0f4c5c] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm disabled:opacity-50">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ADIM 4: BİLGİLENDİRME VE ONAM FORMU */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-[#082b34] border-b pb-2 mb-2">4. Bilgilendirme Onay Formu</h3>
                
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs text-slate-600 space-y-3 h-64 overflow-y-auto leading-relaxed shadow-inner">
                  <p className="font-bold text-sm text-[#082b34]">Bilgilendirme Onay Formu</p>
                  <p>Bu form, Uzm. Psk. Aygün Tuçe Ataş Önç'ten alacağınız psikolojik danışmanlık hizmetleri hakkında sizi bilgilendirmek ve koşullar üzerinde anlaştığımızı onaylamak için hazırlanmıştır.</p>
                  <p>Merkezimize hoş geldiniz. Antalya'daki kliniğimizde yetişkin, çocuk-ergen, çift ve aile alanlarında psikolojik danışmanlık hizmeti sunulmaktadır. İhtiyaç duyulması halinde psikolojik testler ve ölçeklerle değerlendirme yapılmaktadır.</p>
                  <p>Burada uygulanan yöntemlerin durumunuza uygun olmadığı değerlendirilirse veya psikiyatrik/medikal bir müdahale gerekirse, sizi ilgili bir uzmana/hekim yönlendirmekteyiz.</p>
                  <p>Bize verdiğiniz her türlü kişisel bilgi, seans notları veya raporlar kesinlikle gizli tutulur. İzniniz ve onayınız olmadan başka kişi veya kurumlarla paylaşılmaz. Sadece kişinin kendisine veya bir başkasına zarar verme riski taşıyan acil ve hukuki durumlarda bu gizlilik ilkesi esnetilebilir. Online seanslarımızda iki taraf da (danışan ve uzman) hiçbir şekilde oturumları kaydetmeyecektir.</p>
                  <p>Seanslar ortalama 50 dakika sürer ve genellikle "haftada bir kez" olarak planlanır. Ancak seans sıklığı ihtiyacınıza göre uzmanımızla birlikte yeniden düzenlenebilir. İlk değerlendirme görüşmesi ve devam eden görüşmeler aynı üчете tabidir.</p>
                  <p>Randevunuzu iptal etmek isterseniz, en geç 24 saat öncesinden haber vermeniz rica olunur. Randevu gününüz içerisinde iptal ettiğiniz durumlarda, seans ücretinin yarısı talep edilir. Randevuya geç kaldığınızda, görüşmenizin bitiş saatini uzatmak diğer danışanların hakkını korumak adına mümkün olmamaktadır.</p>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-3 text-sm text-slate-700 font-semibold cursor-pointer select-none">
                    <input type="checkbox" checked={formData.onay} onChange={(e) => setFormData({...formData, onay: e.target.checked})} required className="w-5 h-5 accent-[#0f4c5c] rounded mt-0.5 shrink-0" />
                    <span>Yukarıda verilen bilgilendirme onam formunu okudum, anladım ve koşulları kabul ediyorum. *</span>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <button type="button" onClick={prevStep} className="text-slate-500 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100">Geri Dön</button>
                  <button disabled={loading || !formData.onay} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:bg-slate-300 text-[#082b34] px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-all shadow-md">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Formu Gönder ve Tamamla"}
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
                  Sayın {formData.AdiSoyadi}, ön görüşme formunuz güvenli klinik otomasyon sistemimize kaydedilmiş ve uzmanımıza e-posta bildirim olarak ulaştırılmıştır.
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