"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFaqs(); }, []);

  async function fetchFaqs() {
    setLoading(true);
    const { data } = await supabase.from("faqs").select("*").order("order_index", { ascending: true });
    setFaqs(data || []);
    setLoading(false);
  }

  const handleOrder = async (id: string, currentIndex: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 1 || newIndex > faqs.length) return;

    const targetFaq = faqs.find(f => f.order_index === newIndex);
    if (targetFaq) {
      await supabase.from("faqs").update({ order_index: currentIndex }).eq("id", targetFaq.id);
      await supabase.from("faqs").update({ order_index: newIndex }).eq("id", id);
      fetchFaqs();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    await supabase.from("faqs").delete().eq("id", id);
    fetchFaqs();
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#082b34]">S.S.S. Yönetimi</h1>
        <Link href="/admin/faq/yeni" className="bg-[#00878a] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Yeni Soru Ekle
        </Link>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-4 shadow-sm">
            <div className="flex flex-col gap-1">
              <button onClick={() => handleOrder(faq.id, faq.order_index, 'up')} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ArrowUp className="w-4 h-4"/></button>
              <button onClick={() => handleOrder(faq.id, faq.order_index, 'down')} className="p-1 hover:bg-slate-100 rounded text-slate-400"><ArrowDown className="w-4 h-4"/></button>
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-[#082b34] line-clamp-1">{faq.order_index}. {faq.question}</h3>
              <p className="text-sm text-slate-500 line-clamp-1">{faq.answer}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/faq/duzenle/${faq.id}`} className="p-2 text-[#00878a] hover:bg-slate-50 rounded-lg"><Edit className="w-5 h-5" /></Link>
              <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}