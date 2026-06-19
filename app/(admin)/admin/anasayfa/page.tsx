"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function HomeModulePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [form, setForm] = useState({
    hero_title: "",
    hero_subtitle: ""
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setForm({ hero_title: data.hero_title || "", hero_subtitle: data.hero_subtitle || "" });
        setImageUrl(data.hero_image_url || "");
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("site_settings").upsert({
      id: 1,
      ...form,
      hero_image_url: imageUrl,
      updated_at: new Date().toISOString()
    });
    alert("Anasayfa modülü başarıyla güncellendi!");
    setSaving(false);
  };

  if (loading) return <div className="p-10">Yükleniyor...</div>;

  return (
    <div className="max-w-4xl pb-20">
      <h1 className="text-2xl font-bold text-[#082b34] mb-6">Anasayfa Modülü</h1>
      
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6 border-b border-slate-100 pb-6">
            <h2 className="text-lg font-bold text-[#00878a] mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5"/> Kapak (Hero) Görseli</h2>
            <ImageUpload value={imageUrl} onChange={setImageUrl} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ana Başlık (H1)</label>
            <input value={form.hero_title} onChange={(e) => setForm({...form, hero_title: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alt Başlık / Slogan</label>
            <textarea value={form.hero_subtitle} onChange={(e) => setForm({...form, hero_subtitle: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none resize-none" />
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button disabled={saving} type="submit" className="bg-[#00878a] hover:bg-[#082b34] text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}