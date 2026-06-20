"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminEditServicePage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State'leri
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");

  // Sayfa açıldığında mevcut hizmet verilerini çekiyoruz
  useEffect(() => {
    async function loadService() {
      setLoading(true);
      const resolvedParams = await params;
      
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("id", resolvedParams.id)
        .maybeSingle();

      if (error) {
        setErrorMessage("Hizmet bilgileri yüklenirken bir hata oluştu: " + error.message);
      } else if (!data) {
        setErrorMessage("Düzenlenmek istenen hizmet veritabanında bulunamadı.");
      } else {
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description);
        setImageUrl(data.image_url || "");
        setContent(data.content || "");
      }
      setLoading(false);
    }

    loadService();
  }, [params]);

  // Türkçe karakterleri çevirip otomatik URL (slug) oluşturan fonksiyon
  const generateSlug = (text: string) => {
    const trMap: any = { 'çÇ':'c', 'ğĞ':'g', 'şŞ':'s', 'üÜ':'u', 'ıİ':'i', 'öÖ':'o' };
    for (let key in trMap) {
      text = text.replace(new RegExp('['+key+']','g'), trMap[key]);
    }
    return text.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setSlug(generateSlug(e.target.value));
    setErrorMessage(""); 
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(""); 

    const formData = new FormData(e.currentTarget);
    const updatedContent = formData.get("content") as string;
    const resolvedParams = await params;

    // Veritabanında güncelleme işlemi (update) yapıyoruz
    const { error } = await supabase
      .from("services")
      .update({
        title,
        slug,
        description,
        content: updatedContent,
        image_url: imageUrl
      })
      .eq("id", resolvedParams.id);

    if (error) {
      // Eğer başka bir hizmet aynı URL'yi kullanıyorsa
      if (error.code === '23505') {
        setErrorMessage("Bu URL (Slug) zaten başka bir hizmet tarafından kullanılıyor. Lütfen benzersiz bir başlık veya URL belirleyin.");
      } else {
        setErrorMessage("Güncelleme sırasında bir hata oluştu: " + error.message);
      }
      setSaving(false);
    } else {
      router.push("/admin/hizmetler"); // Başarılıysa listeye geri dön
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center text-slate-500 flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#00878a]" />
        <p className="text-sm font-medium">Hizmet bilgileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/hizmetler" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-[#082b34]">Hizmeti Düzenle</h1>
      </div>

      {/* SAYFA İÇİ UYARI KUTUSU */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol Kolon: Başlık, URL ve Kapak Resmi */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hizmet Başlığı</label>
                <input required type="text" value={title} onChange={handleTitleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">URL (Slug)</label>
                <input required type="text" value={slug} onChange={(e) => { setSlug(e.target.value); setErrorMessage(""); }} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-[#00878a] bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kapak Resmi</label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Açıklamalar ve Rich Text İçerik */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Kısa Açıklama (Listelerde Görünür)</label>
                <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Detaylı Hizmet İçeriği</label>
                {/* Yükleme bittikten sonra editörün ilk içeriği (content) alması için loading kontrolü şarttır */}
                <RichTextEditor name="content" defaultValue={content} />
              </div>
            </div>
          </div>
          
        </div>

        <div className="fixed bottom-10 right-10 z-50">
          <button disabled={saving} type="submit" className="bg-[#00878a] text-white px-10 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-2 hover:bg-[#082b34] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Değişiklikleri Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}