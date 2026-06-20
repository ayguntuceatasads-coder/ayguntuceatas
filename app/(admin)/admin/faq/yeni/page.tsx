"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AdminFaqEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (id) fetchFaq();
  }, [id]);

  async function fetchFaq() {
    const { data } = await supabase.from("faqs").select("*").eq("id", id).single();
    if (data) {
      setQuestion(data.question);
      setAnswer(data.answer);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (id) {
      await supabase.from("faqs").update({ question, answer }).eq("id", id);
    } else {
      const { data: countData } = await supabase.from("faqs").select("id");
      await supabase.from("faqs").insert({ 
        question, 
        answer, 
        order_index: (countData?.length || 0) + 1 
      });
    }
    router.push("/admin/faq");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/faq" className="p-2 bg-white rounded-lg border border-slate-200"><ArrowLeft className="w-5 h-5 text-slate-600" /></Link>
        <h1 className="text-2xl font-bold text-[#082b34]">{id ? "Soruyu Düzenle" : "Yeni Soru Ekle"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Soru</label>
          <input required type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Cevap</label>
          <textarea required value={answer} onChange={(e) => setAnswer(e.target.value)} rows={8} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" />
        </div>
        <button disabled={loading} type="submit" className="w-full bg-[#00878a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#082b34] transition-all">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Kaydet
        </button>
      </form>
    </div>
  );
}