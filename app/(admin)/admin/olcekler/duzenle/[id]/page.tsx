"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { Save, Plus, Trash2, ArrowLeft, Loader2, Settings2 } from "lucide-react";
import Link from "next/link";

export default function AdminOlcekDuzenlePage() {
  const router = useRouter();
  const { id } = useParams(); // URL'den ölçeğin ID'sini alır
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);

  // Ölçek verilerini veritabanından çek
  useEffect(() => {
    async function fetchScale() {
      const { data, error } = await supabase
        .from("scales")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || "");
        setSendEmail(data.send_email_to_patient);
        setQuestions(data.questions || []);
      } else {
        console.error("Ölçek bulunamadı:", error);
      }
      setLoading(false);
    }
    if (id) fetchScale();
  }, [id]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
  };

  const addQuestion = () => setQuestions([...questions, { questionText: "", type: "radio", options: [{ text: "", points: 0 }] }]);
  
  const removeQuestion = (qIndex: number) => {
    if (window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) {
        setQuestions(questions.filter((_, i) => i !== qIndex));
    }
  };

  const updateQuestionType = (qIndex: number, newType: string) => {
    const newQs = [...questions];
    newQs[qIndex].type = newType;
    if (newType === "text") newQs[qIndex].options = [];
    else if (!newQs[qIndex].options || newQs[qIndex].options.length === 0) {
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
    newQs[qIndex].options = newQs[qIndex].options.filter((_: any, i: number) => i !== oIndex);
    setQuestions(newQs);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("scales").update({
      title,
      slug,
      description,
      send_email_to_patient: sendEmail,
      questions
    }).eq("id", id);

    if (error) {
      alert("Güncelleme sırasında hata oluştu: " + error.message);
    } else {
      router.push("/admin/olcekler");
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00878a]" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/olcekler" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-[#082b34]">Ölçeği Düzenle: <span className="text-[#00878a]">{title}</span></h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Ayarlar */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Ölçek Adı</label>
              <input required type="text" value={title} onChange={handleTitleChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">URL Slug</label>
              <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a] resize-none"></textarea>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-2">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="w-5 h-5 accent-[#00878a]" />
            <span className="font-bold text-[#082b34]">Danışana mail gönderilsin</span>
          </label>
        </div>

        {/* Sorular */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#082b34] flex items-center gap-2">
              <Settings2 className="w-5 h-5" /> Soruları Düzenle
            </h2>
          </div>
          
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative">
              <button type="button" onClick={() => removeQuestion(qIndex)} className="absolute top-6 right-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Soru {qIndex + 1}</label>
                  <input required type="text" value={q.questionText} onChange={(e) => {
                    const newQs = [...questions]; newQs[qIndex].questionText = e.target.value; setQuestions(newQs);
                  }} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tip</label>
                  <select value={q.type} onChange={(e) => updateQuestionType(qIndex, e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none bg-white">
                    <option value="radio">Tekil Seçim</option>
                    <option value="checkbox">Çoklu Seçim</option>
                    <option value="dropdown">Açılır Menü</option>
                    <option value="text">Metin Alanı</option>
                  </select>
                </div>
              </div>

              {q.type !== "text" && (
                <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                  {q.options?.map((opt: any, oIndex: number) => (
                    <div key={oIndex} className="flex gap-3 items-center">
                      <input required type="text" value={opt.text} onChange={(e) => {
                        const newQs = [...questions]; newQs[qIndex].options[oIndex].text = e.target.value; setQuestions(newQs);
                      }} className="flex-grow px-4 py-2 border rounded-lg text-sm" placeholder="Seçenek..." />
                      <input required type="number" value={opt.points} onChange={(e) => {
                        const newQs = [...questions]; newQs[qIndex].options[oIndex].points = Number(e.target.value); setQuestions(newQs);
                      }} className="w-20 px-4 py-2 border rounded-lg text-sm text-center" />
                      <button type="button" onClick={() => removeOption(qIndex, oIndex)} className="text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addOption(qIndex)} className="text-[#00878a] text-sm font-bold">+ Seçenek Ekle</button>
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="w-full py-4 border-2 border-dashed rounded-2xl text-[#00878a] font-bold hover:bg-slate-50 transition-colors">
            + Yeni Soru Ekle
          </button>
        </div>

        <div className="fixed bottom-10 right-10">
          <button disabled={saving} type="submit" className="bg-[#00878a] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-2xl hover:bg-[#082b34] transition-all">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}