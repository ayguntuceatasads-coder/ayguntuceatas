"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { sendIntakeFormEmail } from "@/app/actions/send-email";
import { ArrowLeft, CheckCircle2, Loader2, Send, CalendarDays, Info } from "lucide-react";

const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const HOURS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", 
  "22:00", "23:00", "24:00", "01:00"
];

export default function HaftalikPlanlamaPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  // Danışan Bilgileri
  const [patientInfo, setPatientInfo] = useState({ AdSoyad: "", Telefon: "", Email: "" });

  // Çizelge State'i: Her gün için saatleri içeren boş bir obje oluşturuyoruz
  const [schedule, setSchedule] = useState(() => {
    const initialState: Record<string, Record<string, string>> = {};
    DAYS.forEach(day => {
      initialState[day] = {};
      HOURS.forEach(hour => { initialState[day][hour] = ""; });
    });
    return initialState;
  });

  const handleScheduleChange = (day: string, hour: string, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [hour]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Sadece veri girilmiş saatleri filtreleyip şık bir JSON'a dönüştürüyoruz
    const cleanFormData: Record<string, any> = {};
    let hasData = false;

    DAYS.forEach(day => {
      const dayEntries: string[] = [];
      HOURS.forEach(hour => {
        if (schedule[day][hour].trim() !== "") {
          dayEntries.push(`[${hour}] ${schedule[day][hour]}`);
          hasData = true;
        }
      });
      if (dayEntries.length > 0) {
        cleanFormData[day] = dayEntries;
      }
    });

    if (!hasData) {
      setStatus({ type: "error", message: "Lütfen çizelgeye en az bir aktivite ekleyiniz." });
      setLoading(false);
      return;
    }

    // 1. Supabase Kaydı
    const { error: dbError } = await supabase.from("intake_forms").insert({
      form_type: "haftalik_planlama",
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
      formTitle: "Haftalık Planlama Çizelgesi",
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
          <h2 className="text-2xl font-bold text-[#082b34] mb-3">Çizelge İletildi!</h2>
          <p className="text-slate-600 mb-8">
            Haftalık planlama çizelgeniz uzmanımıza başarıyla ulaştırılmıştır. Sürece olan katkınız için teşekkür ederiz.
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
            <CalendarDays className="w-8 h-8 text-[#6ec9c9]" />
            Haftalık Planlama Çizelgesi
          </h1>
        </div>

        <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-2xl shadow-sm">
          {/* Yönerge / Bilgilendirme */}
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl mb-8 flex gap-4 items-start">
            <Info className="w-6 h-6 text-[#0f4c5c] shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
              <p><strong>Yönerge:</strong> Haftanın her saati için ne yapmayı planladığınızı ve bundan ne kadar <strong>keyif alacağınızı</strong> ve <strong>beceri hissedeceğinizi</strong> belirtin.</p>
              <ul className="list-disc pl-4 space-y-1">
                <li><strong>Keyif:</strong> 0 (hiç keyif almadım) ile 10 (en keyifli şey) arasında puanlayın.</li>
                <li><strong>Beceri (Başarma/Etkili olma):</strong> 0 ile 10 arasında puanlayın.</li>
              </ul>
              <p className="bg-white p-3 rounded-lg border border-slate-100 mt-2 font-mono text-xs">
                Örnek Kullanım: <strong>Egzersiz, 6/8</strong> (6: Keyif Puanı, 8: Beceri Puanı)
              </p>
            </div>
          </div>

          {status && (
            <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Danışan Bilgileri */}
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

            {/* Çizelge Alanı (Sekmeli Yapı) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              {/* Gün Sekmeleri */}
              <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-200 hide-scrollbar">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setActiveDay(day)}
                    className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeDay === day ? 'bg-[#0f4c5c] text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-[#082b34]'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Aktif Günün Saatleri */}
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
                  {HOURS.map(hour => (
                    <div key={`${activeDay}-${hour}`} className="flex items-center gap-3">
                      <span className="w-14 text-right font-mono text-xs font-bold text-slate-400 shrink-0">{hour}</span>
                      <input 
                        type="text" 
                        value={schedule[activeDay][hour]} 
                        onChange={(e) => handleScheduleChange(activeDay, hour, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm bg-slate-50 focus:bg-white transition-colors" 
                        placeholder="Örn: Yürüyüş, 5/7" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button disabled={loading || !patientInfo.AdSoyad || !patientInfo.Telefon} type="submit" className="bg-[#6ec9c9] hover:bg-[#5dbaba] disabled:bg-slate-300 text-[#082b34] px-10 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                Çizelgeyi Gönder
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}