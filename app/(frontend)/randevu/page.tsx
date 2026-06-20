"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, CheckCircle2, User, Video, Users, Baby, Activity } from "lucide-react";
import Link from "next/link";

export default function AppointmentPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    service: "",
    sessionType: "",
    name: "",
    age: "",
    phone: "",
    email: "",
    note: ""
  });

  const services = [
    { title: "Yetişkin Terapisi", icon: <User className="w-5 h-5" /> },
    { title: "Çocuk & Ergen Terapisi", icon: <Baby className="w-5 h-5" /> },
    { title: "Aile & Çift Terapisi", icon: <Users className="w-5 h-5" /> },
    { title: "Psikolojik Testler", icon: <Activity className="w-5 h-5" /> },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("messages").insert({
      type: "randevu",
      name: formData.name,
      age: formData.age,
      email: formData.email,
      phone: formData.phone,
      service: formData.service,
      session_type: formData.sessionType,
      message: formData.note,
      is_read: false
    });

    setLoading(false);
    if (error) alert("Hata: " + error.message);
    else setStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#082b34]">Hizmet Seçiniz</h2>
              <div className="grid grid-cols-1 gap-3">
                {services.map((s) => (
                  <button key={s.title} type="button" 
                    className={`p-4 border rounded-lg flex items-center gap-3 transition ${formData.service === s.title ? "bg-[#00878a] text-white" : "hover:bg-slate-50"}`}
                    onClick={() => setFormData({...formData, service: s.title})}>
                    {s.icon} {s.title}
                  </button>
                ))}
              </div>
              <button type="button" disabled={!formData.service} onClick={() => setStep(2)} className="w-full bg-[#00878a] text-white py-3 rounded-lg mt-4 disabled:opacity-50">Devam Et</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#082b34]">Görüşme Türü</h2>
              <div className="grid grid-cols-2 gap-4">
                {["Online", "Yüz Yüze"].map((type) => (
                  <button key={type} type="button"
                    className={`p-6 border rounded-lg ${formData.sessionType === type ? "bg-[#00878a] text-white" : "hover:bg-slate-50"}`}
                    onClick={() => setFormData({...formData, sessionType: type})}>
                    {type}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 border py-3 rounded-lg">Geri</button>
                <button type="button" disabled={!formData.sessionType} onClick={() => setStep(3)} className="flex-1 bg-[#00878a] text-white py-3 rounded-lg">Devam Et</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#082b34]">İletişim Bilgileri</h2>
              <input required placeholder="Ad Soyad" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="number" placeholder="Yaş" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, age: e.target.value})} />
              <input required type="email" placeholder="E-posta" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required placeholder="Telefon" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="Varsa notunuz" className="w-full p-3 border rounded" onChange={e => setFormData({...formData, note: e.target.value})} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border py-3 rounded-lg">Geri</button>
                <button disabled={loading} type="submit" className="flex-1 bg-[#00878a] text-white py-3 rounded-lg">
                  {loading ? "Gönderiliyor..." : "Randevu Talebini Gönder"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#082b34]">Talebiniz Alındı!</h2>
              <p className="mt-2 text-slate-600">Asistanlarımız en kısa sürede dönüş yapacaktır.</p>
              <Link href="/" className="mt-6 block text-[#0f4c5c] font-bold">Anasayfaya Dön</Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}