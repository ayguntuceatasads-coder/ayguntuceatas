"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendNotificationEmails } from "@/app/actions/send-email";
import { ArrowLeft, ArrowRight, CheckCircle2, User, Video, Users, Activity, Baby } from "lucide-react";

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    sessionType: "",
    name: "",
    phone: "",
    email: "",
    note: ""
  });

  const services = [
    { id: "yetiskin", title: "Yetişkin Terapisi", icon: <User className="w-5 h-5" /> },
    { id: "cocuk", title: "Çocuk & Ergen Terapisi", icon: <Baby className="w-5 h-5" /> },
    { id: "cift", title: "Aile & Çift Terapisi", icon: <Users className="w-5 h-5" /> },
    { id: "test", title: "Psikolojik Testler", icon: <Activity className="w-5 h-5" /> },
  ];

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      type: "randevu",
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      session_type: formData.sessionType,
      message: formData.note,
      is_read: false
    });

    if (!error) {
      await sendNotificationEmails({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `${formData.service} - ${formData.sessionType}`,
        message: formData.note,
        type: "Randevu Talebi"
      });
      setStep(4);
    } else {
      alert("Bir hata oluştu: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <div className="mb-8">
          <Link href="/iletisim" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-[#0f4c5c] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> İletişim Sayfasına Dön
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-[#082b34]">Online Randevu Talep Formu</h1>
          <p className="text-slate-500 mt-2">Lütfen adımları takip ederek sizin için en uygun seans planını oluşturmamıza yardımcı olun.</p>
        </div>

        {step < 4 && (
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#6ec9c9] -z-10 rounded-full transition-all duration-500" style={{ width: `${(step - 1) * 50}%` }}></div>
            {[1, 2, 3].map((num) => (
              <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 text-sm transition-colors ${step >= num ? 'bg-[#0f4c5c] text-white border-white shadow-md' : 'bg-slate-100 text-slate-400 border-white'}`}>
                {num}
              </div>
            ))}
          </div>
        )}

        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-xl font-bold text-[#082b34] mb-6">1. Hangi alanda destek almak istiyorsunuz?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((srv) => (
                    <div key={srv.id} onClick={() => setFormData({...formData, service: srv.title})} className={`cursor-pointer border-2 rounded-xl p-5 flex items-center gap-3 transition-all ${formData.service === srv.title ? 'border-[#6ec9c9] bg-[#6ec9c9]/10 text-[#0f4c5c]' : 'border-slate-200 text-slate-600 hover:border-[#6ec9c9]/40'}`}>
                      <div className={formData.service === srv.title ? 'text-[#0f4c5c]' : 'text-slate-400'}>{srv.icon}</div>
                      <span className="font-semibold">{srv.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="button" onClick={handleNext} disabled={!formData.service} className="bg-[#0f4c5c] text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-all">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-xl font-bold text-[#082b34] mb-6">2. Görüşme tipini nasıl tercih edersiniz?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {["Klinikte Yüz Yüze", "Online (Görüntülü)"].map((type) => (
                    <div key={type} onClick={() => setFormData({...formData, sessionType: type})} className={`cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3 transition-all ${formData.sessionType === type ? 'border-[#6ec9c9] bg-[#6ec9c9]/10 text-[#0f4c5c]' : 'border-slate-200 text-slate-600 hover:border-[#6ec9c9]/40'}`}>
                      {type.includes("Yüz") ? <User className={`w-8 h-8 ${formData.sessionType === type ? 'text-[#0f4c5c]' : 'text-slate-400'}`} /> : <Video className={`w-8 h-8 ${formData.sessionType === type ? 'text-[#0f4c5c]' : 'text-slate-400'}`} />}
                      <h3 className="font-bold text-lg">{type}</h3>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={handlePrev} className="text-slate-500 font-semibold px-6 py-3 rounded-md hover:bg-slate-100 transition-colors">Geri Dön</button>
                  <button type="button" onClick={handleNext} disabled={!formData.sessionType} className="bg-[#0f4c5c] text-white disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-all">
                    Sonraki Adım <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h2 className="text-xl font-bold text-[#082b34] mb-2">3. İletişim Bilgileriniz</h2>
                <p className="text-sm text-slate-500 mb-6">Talebinizle ilgili dönüş yapabilmemiz için bilgilerinizi eksiksiz doldurun.</p>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#082b34] mb-1.5">Adınız Soyadınız *</label>
                    <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-4 py-3 rounded-md border border-slate-300 focus:border-[#6ec9c9] focus:ring-2 focus:ring-[#6ec9c9]/20 outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#082b34] mb-1.5">E-posta Adresiniz *</label>
                      <input required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-4 py-3 rounded-md border border-slate-300 focus:border-[#6ec9c9] focus:ring-2 focus:ring-[#6ec9c9]/20 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#082b34] mb-1.5">Telefon Numaranız *</label>
                      <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-4 py-3 rounded-md border border-slate-300 focus:border-[#6ec9c9] focus:ring-2 focus:ring-[#6ec9c9]/20 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#082b34] mb-1.5">Kısaca Eklemek İstedikleriniz (Opsiyonel)</label>
                    <textarea rows={3} value={formData.note} onChange={(e) => setFormData({...formData, note: e.target.value})} className="w-full px-4 py-3 rounded-md border border-slate-300 focus:border-[#6ec9c9] focus:ring-2 focus:ring-[#6ec9c9]/20 outline-none resize-none"></textarea>
                  </div>
                </div>
                <div className="mt-8 flex justify-between">
                  <button type="button" onClick={handlePrev} className="text-slate-500 font-semibold px-6 py-3 rounded-md hover:bg-slate-100 transition-colors">Geri Dön</button>
                  <button disabled={loading} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:opacity-50 text-[#082b34] px-8 py-3 rounded-md font-bold flex items-center gap-2 transition-all shadow-md">
                    {loading ? "İşleniyor..." : "Talebi Tamamla"}
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-[#6ec9c9]/20 text-[#0f4c5c] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#082b34] mb-3">Talebiniz Alındı!</h2>
                <p className="text-slate-600 max-w-md mx-auto mb-8">
                  {formData.name}, randevu talebiniz başarıyla iletilmiştir. Asistanlarımız en kısa sürede dönüş yaparak seans saatinizi kesinleştirecektir.
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-5 text-sm text-left max-w-sm mx-auto mb-8">
                  <p className="mb-2"><span className="font-semibold text-slate-500">Hizmet:</span> <span className="text-[#082b34] font-medium">{formData.service}</span></p>
                  <p><span className="font-semibold text-slate-500">Tip:</span> <span className="text-[#082b34] font-medium">{formData.sessionType}</span></p>
                </div>
                <Link href="/" className="inline-flex items-center text-[#0f4c5c] font-semibold hover:text-[#6ec9c9] transition-colors">
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