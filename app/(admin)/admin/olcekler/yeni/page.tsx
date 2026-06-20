"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, ArrowLeft, Loader2, Settings2 } from "lucide-react";
import Link from "next/link";

export default function AdminYeniOlcekPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sendEmail, setSendEmail] = useState(false);

  // YENİ: Sorulara "type" eklendi
  const [questions, setQuestions] = useState([
    { questionText: "", type: "radio", options: [{ text: "", points: 0 }] }
  ]);

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const addQuestion = () => setQuestions([...questions, { questionText: "", type: "radio", options: [{ text: "", points: 0 }] }]);
  const removeQuestion = (qIndex: number) => setQuestions(questions.filter((_, i) => i !== qIndex));

  const updateQuestionType = (qIndex: number, newType: string) => {
    const newQs = [...questions];
    newQs[qIndex].type = newType;
    // Eğer metin (text) seçilirse seçenekleri temizle, yoksa varsayılan seçenek ekle
    if (newType === "text") {
      newQs[qIndex].options = [];
    } else if (newQs[qIndex].options.length === 0) {
      newQs[qIndex].options = [{ text: "", points: 0 }];
    }
    setQuestions(newQs);
  };

  const addOption = (qIndex: number) => {
    const newQs = [...questions];
    newQs[qIndex].options.push({ text: "", points: 0 });
    setQuestions(newQs);
  };
  
  const removeOption = (qIndex: number, oIndex: number) => {
    const newQs = [...questions];
    newQs[qIndex].options = newQs[qIndex].options.filter((_, i) => i !== oIndex);
    setQuestions(newQs);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("scales").insert({
      title,
      slug,
      description,
      send_email_to_patient: sendEmail,
      questions
    });

    if (error) {
      alert("Hata oluştu: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/olcekler");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/olcekler" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <h1 className="text-2xl font-bold text-[#082b34]">Yeni Ölçek / Form Oluştur</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Genel Ayarlar */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ölçek Adı</label>
              <input required type="text" value={title} onChange={handleTitleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" placeholder="Örn: Beck Depresyon Ölçeği" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">URL (Hastaya Gidecek Link)</label>
              <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama / Yönerge</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a] resize-none" placeholder="Lütfen son 1 hafta içindeki durumunuzu göz önüne alarak cevaplayın..."></textarea>
          </div>
          <label className="flex items-center gap-3 cursor-pointer bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-[#00878a]/50 transition-colors">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="w-5 h-5 accent-[#00878a]" />
            <span className="font-bold text-[#082b34]">Ölçek sonucunu otomatik olarak danışana e-posta ile gönder</span>
          </label>
        </div>

        {/* Sorular Alanı */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#082b34] flex items-center gap-2">
            <Settings2 className="w-5 h-5" /> Form Soruları
          </h2>
          
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-6 right-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-5 h-5" /></button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Soru {qIndex + 1}</label>
                  <input required type="text" value={q.questionText} onChange={(e) => {
                    const newQs = [...questions]; newQs[qIndex].questionText = e.target.value; setQuestions(newQs);
                  }} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" placeholder="Soruyu buraya yazın..." />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Soru Tipi</label>
                  <select value={q.type} onChange={(e) => updateQuestionType(qIndex, e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a] bg-white cursor-pointer">
                    <option value="radio">Tekil Seçim (Radio)</option>
                    <option value="checkbox">Çoklu Seçim (Checkbox)</option>
                    <option value="dropdown">Açılır Menü (Select)</option>
                    <option value="text">Açık Uçlu Soru (Metin)</option>
                  </select>
                </div>
              </div>

              {/* Seçenekler (Sadece Soru Tipi Metin DEĞİLSE görünür) */}
              {q.type !== "text" ? (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cevap Seçenekleri ve Puanlar</p>
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex flex-wrap items-center gap-3">
                      <input required type="text" value={opt.text} onChange={(e) => {
                        const newQs = [...questions]; newQs[qIndex].options[oIndex].text = e.target.value; setQuestions(newQs);
                      }} className="flex-grow px-4 py-2 border border-slate-300 rounded-lg outline-none text-sm focus:border-[#00878a]" placeholder={`Seçenek ${oIndex + 1}`} />
                      
                      <div className="flex items-center gap-2 bg-white px-3 border border-slate-200 rounded-lg">
                        <span className="text-xs font-bold text-slate-400">Puan:</span>
                        <input required type="number" value={opt.points} onChange={(e) => {
                          const newQs = [...questions]; newQs[qIndex].options[oIndex].points = Number(e.target.value); setQuestions(newQs);
                        }} className="w-16 py-2 outline-none text-sm font-bold text-[#082b34] text-center" />
                      </div>
                      
                      <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-slate-400 hover:text-red-500 p-2 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qIndex)} className="text-[#00878a] text-sm font-bold flex items-center gap-1 hover:bg-[#00878a]/10 px-3 py-2 rounded-lg transition-colors mt-2">
                    <Plus className="w-4 h-4" /> Yeni Seçenek Ekle
                  </button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 text-blue-600 p-4 rounded-xl text-sm font-medium">
                  Bu soru açık uçlu olduğu için müşteri bir metin kutusuna yazı yazacaktır. Puanlama hesaplanmaz.
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="w-full py-5 border-2 border-dashed border-[#00878a]/40 bg-white rounded-2xl text-[#00878a] font-bold hover:bg-[#00878a]/5 hover:border-[#00878a] transition-colors flex justify-center items-center gap-2">
            <Plus className="w-6 h-6" /> Yeni Soru Ekle
          </button>
        </div>

        <div className="fixed bottom-10 right-10 z-50">
          <button disabled={loading} type="submit" className="bg-[#00878a] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-2xl hover:bg-[#082b34] hover:-translate-y-1 transition-all">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Ölçeği Kaydet ve Yayınla
          </button>
        </div>
      </form>
    </div>
  );
}