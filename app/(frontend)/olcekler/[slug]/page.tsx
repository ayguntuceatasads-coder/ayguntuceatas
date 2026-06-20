"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, CheckCircle2, AlertCircle, User, Mail, Phone } from "lucide-react";

export default function DynamicScalePage() {
  const { slug } = useParams();
  const [scale, setScale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Danışan Bilgileri
  const [patient, setPatient] = useState({ name: "", email: "", phone: "" });
  
  // Cevapları tuttuğumuz obje. (Soru indexine göre cevapları tutar)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number, show: boolean } | null>(null);

  useEffect(() => {
    async function fetchScale() {
      const { data } = await supabase.from("scales").select("*").eq("slug", slug).single();
      if (data) setScale(data);
      setLoading(false);
    }
    if (slug) fetchScale();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#00878a]" /></div>;
  if (!scale) return <div className="min-h-screen flex items-center justify-center text-xl text-slate-500">Ölçek bulunamadı veya adresi değişmiş olabilir.</div>;

  // --- CEVAPLARI İŞLEME FONKSİYONLARI ---
  const handleSingleSelect = (qIndex: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qIndex]: val }));
  };

  const handleMultiSelect = (qIndex: number, val: string, isChecked: boolean) => {
    setAnswers(prev => {
      const currentArr = prev[qIndex] || [];
      if (isChecked) {
        return { ...prev, [qIndex]: [...currentArr, val] };
      } else {
        return { ...prev, [qIndex]: currentArr.filter((item: string) => item !== val) };
      }
    });
  };

  const handleTextChange = (qIndex: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qIndex]: val }));
  };

  // --- FORMU GÖNDERME ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Doğrulama: Bütün sorulara cevap verilmiş mi?
    const unanswered = scale.questions.findIndex((q: any, index: number) => {
      if (q.type === 'checkbox') return !answers[index] || answers[index].length === 0;
      return !answers[index] || answers[index].toString().trim() === "";
    });

    if (unanswered !== -1) {
      alert(`Lütfen ${unanswered + 1}. soruyu cevapladığınızdan emin olun.`);
      return;
    }

    setIsSubmitting(true);

    let totalScore = 0;
    const formattedAnswers: any = {};

    // Puanları Hesapla ve Veriyi API'ye Uygun Hale Getir
    scale.questions.forEach((q: any, index: number) => {
      const ans = answers[index];
      
      // Veritabanına ve maile gidecek format
      formattedAnswers[q.questionText] = Array.isArray(ans) ? ans.join(", ") : ans;

      // Puan Hesaplama Mantığı
      if (q.type === 'radio' || q.type === 'dropdown') {
        const selectedOpt = q.options.find((o: any) => o.text === ans);
        if (selectedOpt) totalScore += Number(selectedOpt.points || 0);
      } else if (q.type === 'checkbox') {
        if (Array.isArray(ans)) {
          ans.forEach(ansText => {
            const selectedOpt = q.options.find((o: any) => o.text === ansText);
            if (selectedOpt) totalScore += Number(selectedOpt.points || 0);
          });
        }
      }
      // 'text' tiplerinin puanı olmaz (0 kabul edilir)
    });

    try {
      const response = await fetch("/api/submit-scale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scale_id: scale.id,
          scale_name: scale.title,
          patient_name: patient.name,
          patient_email: patient.email,
          patient_phone: patient.phone,
          score: totalScore,
          answers: formattedAnswers,
          send_email_to_patient: scale.send_email_to_patient
        })
      });

      if (response.ok) {
        setResult({ score: totalScore, show: true });
        window.scrollTo(0,0);
      } else {
        alert("Gönderim sırasında hata oluştu. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      alert("Bağlantı hatası yaşandı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- SONUÇ EKRANI ---
  if (result?.show) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-[#082b34] mb-4">Teşekkürler {patient.name.split(' ')[0]},</h2>
          <p className="text-slate-600 mb-8">Formunuz ve yanıtlarınız uzmanımıza başarıyla iletildi.</p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-2">Ölçek Puanınız</p>
            <p className="text-5xl font-bold text-[#00878a]">{result.score}</p>
          </div>

          <div className="text-sm text-slate-500 leading-relaxed bg-slate-100 p-4 rounded-xl text-left">
            Ölçek sonuçları tek başına tanı ve tedavi amaçlı kullanılamaz. Sonuçlarınız uzmanımız tarafından değerlendirilecektir. Danışmanlık sürecinizle ilgili sorularınız için bizimle iletişime geçebilirsiniz.
          </div>
        </div>
      </div>
    );
  }

  // --- FORM EKRANI ---
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Başlık Alanı */}
        <div className="bg-[#082b34] text-white p-8 md:p-12 rounded-t-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{scale.title}</h1>
          {scale.description && (
            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto whitespace-pre-wrap">{scale.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-b-3xl shadow-xl border border-slate-200/60">
          
          {/* ZORUNLU: Hasta İletişim Bilgileri */}
          <div className="mb-12 border-b border-slate-200 pb-10">
            <h3 className="text-lg font-bold text-[#082b34] mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-[#00878a]" /> Kişisel Bilgileriniz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">Adınız Soyadınız</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="text" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00878a] focus:bg-white transition-colors" placeholder="Tam adınızı giriniz" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">E-posta Adresiniz</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="email" value={patient.email} onChange={e => setPatient({...patient, email: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00878a] focus:bg-white transition-colors" placeholder="ornek@mail.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Telefon Numaranız</label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input required type="tel" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00878a] focus:bg-white transition-colors" placeholder="05XX XXX XX XX" />
                </div>
              </div>
            </div>
          </div>

          {/* Dinamik Sorular */}
          <div className="space-y-10">
            {scale.questions.map((q: any, index: number) => (
              <div key={index} className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100">
                <p className="font-semibold text-[#082b34] mb-6 text-lg leading-relaxed"><span className="text-[#00878a]">{index + 1}.</span> {q.questionText}</p>
                
                {/* TİP 1: Tekil Seçim (Radio) */}
                {q.type === 'radio' && (
                  <div className="flex flex-col gap-3">
                    {q.options.map((opt: any, i: number) => (
                      <label key={i} className={`cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all ${answers[index] === opt.text ? "border-[#00878a] bg-[#00878a]/5 text-[#00878a] font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-[#00878a]/30"}`}>
                        <input type="radio" name={`q-${index}`} value={opt.text} checked={answers[index] === opt.text} onChange={() => handleSingleSelect(index, opt.text)} className="w-5 h-5 mr-4 accent-[#00878a]" />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                )}

                {/* TİP 2: Çoklu Seçim (Checkbox) */}
                {q.type === 'checkbox' && (
                  <div className="flex flex-col gap-3">
                    {q.options.map((opt: any, i: number) => (
                      <label key={i} className={`cursor-pointer flex items-center p-4 rounded-xl border-2 transition-all ${(answers[index] || []).includes(opt.text) ? "border-[#00878a] bg-[#00878a]/5 text-[#00878a] font-bold" : "border-slate-200 bg-white text-slate-600 hover:border-[#00878a]/30"}`}>
                        <input type="checkbox" checked={(answers[index] || []).includes(opt.text)} onChange={(e) => handleMultiSelect(index, opt.text, e.target.checked)} className="w-5 h-5 mr-4 accent-[#00878a] rounded" />
                        {opt.text}
                      </label>
                    ))}
                  </div>
                )}

                {/* TİP 3: Açılır Menü (Dropdown) */}
                {q.type === 'dropdown' && (
                  <select required value={answers[index] || ""} onChange={(e) => handleSingleSelect(index, e.target.value)} className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00878a] text-slate-700 cursor-pointer text-base">
                    <option value="" disabled>Lütfen bir seçenek belirleyin...</option>
                    {q.options.map((opt: any, i: number) => (
                      <option key={i} value={opt.text}>{opt.text}</option>
                    ))}
                  </select>
                )}

                {/* TİP 4: Açık Uçlu Soru (Text) */}
                {q.type === 'text' && (
                  <textarea required rows={4} value={answers[index] || ""} onChange={(e) => handleTextChange(index, e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#00878a] resize-none text-slate-700 placeholder:text-slate-400" placeholder="Cevabınızı buraya yazınız..."></textarea>
                )}

              </div>
            ))}
          </div>

          {/* Gönder Butonu */}
          <div className="mt-12 pt-10 border-t border-slate-100">
            <button disabled={isSubmitting} type="submit" className="w-full bg-[#082b34] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#00878a] transition-all flex justify-center items-center gap-2 shadow-xl shadow-[#082b34]/20 disabled:opacity-70">
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Yanıtlarımı Kaydet ve Gönder"}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">Verileriniz uçtan uca şifrelenerek korunmaktadır.</p>
          </div>

        </form>
      </div>
    </div>
  );
}