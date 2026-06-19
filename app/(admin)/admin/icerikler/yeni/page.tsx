"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

function AddPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || 'makale';
  
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = title.toLowerCase().trim().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      type: formData.get("type"),
      category: formData.get("category"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"), // RichTextEditor'den
      image_url: imageUrl, // ImageUpload'dan
      is_published: formData.get("is_published") === "on"
    });

    if (error) {
      alert("Hata: " + error.message);
      setSaving(false); return;
    }
    router.push('/admin/icerikler');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Kapak / Kitap Görseli Yükle</label>
          <ImageUpload value={imageUrl} onChange={setImageUrl} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
          <input name="title" required type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">İçerik Türü</label>
          <select name="type" defaultValue={defaultType} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none bg-white">
            <option value="makale">Makale</option>
            <option value="kitap">Kitap Önerisi</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Etiketi</label>
          <input name="category" type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Özet</label>
          <textarea name="excerpt" rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none resize-none" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-slate-700 mb-2">İçerik (Zengin Metin / HTML)</label>
          <RichTextEditor name="content" placeholder="Makalenizi buraya yazın veya video embed kodunu HTML kısmından ekleyin..." />
        </div>
        
        <div className="md:col-span-2 flex items-center gap-3">
          <input name="is_published" type="checkbox" id="pub" defaultChecked className="w-5 h-5 accent-[#00878a]" />
          <label htmlFor="pub" className="text-sm font-bold text-slate-700">Hemen Yayına Al</label>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <button disabled={saving} type="submit" className="bg-[#00878a] text-white px-10 py-3 rounded-lg font-bold flex items-center gap-2">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Kaydet
        </button>
      </div>
    </form>
  );
}

export default function AddPostPage() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="mb-6">
        <Link href="/admin/icerikler" className="inline-flex items-center text-sm font-semibold text-[#00878a] hover:text-[#082b34] mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Listeye Dön
        </Link>
        <h1 className="text-2xl font-bold text-[#082b34]">Yeni İçerik Ekle</h1>
      </div>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <AddPostForm />
      </Suspense>
    </div>
  );
}