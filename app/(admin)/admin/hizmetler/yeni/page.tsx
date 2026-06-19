"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Save, ArrowLeft, Loader2, Search } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function AddServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().trim().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    const { error } = await supabase.from('services').insert({
      title,
      slug,
      icon_name: formData.get("icon_name"),
      description: formData.get("description"),
      content: formData.get("content"),
      image_url: imageUrl,
      // Yeni SEO alanları
      seo_title: formData.get("seo_title"),
      seo_description: formData.get("seo_description"),
    });

    if (error) {
      alert("Hata oluştu: " + error.message);
      setSaving(false);
      return;
    }
    
    router.push('/admin/hizmetler');
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/admin/hizmetler" className="inline-flex items-center text-sm font-semibold text-[#00878a] hover:text-[#082b34] mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Listeye Dön
        </Link>
        <h1 className="text-2xl font-bold text-[#082b34]">Yeni Hizmet Ekle</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* TEMEL BİLGİLER */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Hizmet Kapak Görseli</label>
              <ImageUpload value={imageUrl} onChange={setImageUrl} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hizmet Başlığı</label>
              <input name="title" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kart İkonu</label>
              <input name="icon_name" type="text" defaultValue="brain" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Vitrin Kartı Özeti</label>
              <textarea name="description" rows={3} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Detaylı İçerik Metni (HTML)</label>
              <RichTextEditor name="content" placeholder="Hizmet detaylarını yazın..." />
            </div>
          </div>
        </div>

        {/* SEO AYARLARI */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-[#082b34] flex items-center gap-2 border-b border-slate-100 pb-4"><Search className="w-5 h-5 text-[#00878a]" /> Google SEO Ayarları</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">SEO Başlığı (Meta Title)</label>
              <input name="seo_title" type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" placeholder="Örn: Antalya Yetişkin Terapisi | Uzm. Psk. Aygün Tuce Ataş" />
              <p className="text-xs text-slate-400 mt-1">Boş bırakılırsa standart başlık kullanılır.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">SEO Açıklaması (Meta Description)</label>
              <textarea name="seo_description" rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none resize-none" placeholder="Google aramalarında başlığın altında görünecek olan açıklama metni..." />
            </div>
          </div>
        </div>

        <div className="sticky bottom-6 flex justify-end">
          <button disabled={saving} type="submit" className="bg-[#00878a] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-[#5e338d] transition-colors">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Hizmeti Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}