"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Image as ImageIcon, Upload, Plus, Trash2 } from "lucide-react";

export default function AdminAnasayfaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingAbout, setUploadingAbout] = useState(false); // Hakkımızda resmi için özel yükleme state'i
  
  const [settings, setSettings] = useState<any>({
    hero_slides: [],
    about_title: "",
    about_text: "",
    about_image: "",
    cta_title: "",
    cta_text: ""
  });

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from("homepage_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const addSlide = () => {
    const newSlides = [...settings.hero_slides, { title: "Yeni Slayt", subtitle: "Alt başlık yazısı", image: "" }];
    setSettings({ ...settings, hero_slides: newSlides });
  };

  const removeSlide = (index: number) => {
    if (settings.hero_slides.length <= 1) return alert("En az bir slayt kalmalıdır.");
    if (window.confirm("Bu slaytı silmek istediğinize emin misiniz?")) {
      const newSlides = settings.hero_slides.filter((_: any, i: number) => i !== index);
      setSettings({ ...settings, hero_slides: newSlides });
    }
  };

  // Hero Slayt Görsel Yükleyici
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
      const newSlides = [...settings.hero_slides];
      newSlides[index].image = urlData.publicUrl;
      setSettings({ ...settings, hero_slides: newSlides });
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Hakkımızda Görsel Yükleyici
  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAbout(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `about-${Date.now()}.${fileExt}`;
      const filePath = `homepage/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
      setSettings({ ...settings, about_image: urlData.publicUrl });
    } catch (error: any) {
      alert("Hata: " + error.message);
    } finally {
      setUploadingAbout(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("homepage_settings").update(settings).eq("id", 1);
    if (error) alert("Hata: " + error.message);
    else alert("Anasayfa başarıyla güncellendi!");
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00878a]" /></div>;

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#082b34]">Anasayfa Yönetimi</h1>
        <button onClick={addSlide} className="bg-[#00878a] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#082b34] transition-colors">
          <Plus className="w-5 h-5" /> Yeni Slayt Ekle
        </button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-10">
        
        {/* Slaytlar Alanı */}
        <div className="space-y-6">
          {settings.hero_slides.map((slide: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group">
              <button type="button" onClick={() => removeSlide(index)} className="absolute top-6 right-6 p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                <Trash2 className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-[#00878a] flex items-center gap-2 italic">#{index + 1} Slayt İçeriği</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Slayt Başlığı</label>
                  <input type="text" value={slide.title} onChange={(e) => {
                    const newSlides = [...settings.hero_slides];
                    newSlides[index].title = e.target.value;
                    setSettings({...settings, hero_slides: newSlides});
                  }} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-[#00878a]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Slayt Açıklaması</label>
                  <textarea rows={2} value={slide.subtitle} onChange={(e) => {
                    const newSlides = [...settings.hero_slides];
                    newSlides[index].subtitle = e.target.value;
                    setSettings({...settings, hero_slides: newSlides});
                  }} className="w-full px-4 py-2 bg-slate-50 border rounded-lg outline-none focus:border-[#00878a]"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Arka Plan Görseli</label>
                  <div className="flex items-center gap-4">
                    {slide.image && <img src={slide.image} className="w-16 h-16 object-cover rounded-lg border" />}
                    <label className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-[#00878a] cursor-pointer transition-colors">
                      {uploadingIndex === index ? <Loader2 className="animate-spin text-[#00878a]" /> : <><Upload className="w-5 h-5 text-slate-400 mr-2" /> Slayt Görseli Yükle</>}
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, index)} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hakkımızda Alanı (Görsel Desteğiyle) */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-[#082b34] border-b pb-4">Hakkımızda Bölümü</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Başlık</label>
                <input type="text" value={settings.about_title} onChange={e => setSettings({...settings, about_title: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none focus:border-[#00878a]" placeholder="Hakkımızda Başlığı" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Metin</label>
                <textarea rows={6} value={settings.about_text} onChange={e => setSettings({...settings, about_text: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none focus:border-[#00878a]" placeholder="Hakkımızda Yazısı"></textarea>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Hakkımızda Görseli</label>
              <div className="flex flex-col gap-4">
                {settings.about_image && <img src={settings.about_image} className="w-full h-48 object-cover rounded-xl border" />}
                <label className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 hover:border-[#00878a] cursor-pointer transition-colors">
                  {uploadingAbout ? <Loader2 className="animate-spin text-[#00878a]" /> : <><Upload className="w-5 h-5 text-slate-400 mr-2" /> Görsel Yükle / Değiştir</>}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAboutImageUpload} disabled={uploadingAbout} />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Aksiyon Barı */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#082b34] mb-4">Randevu & İletişim (CTA) Barı</h2>
            <input type="text" value={settings.cta_title} onChange={e => setSettings({...settings, cta_title: e.target.value})} className="w-full px-4 py-3 border rounded-xl mb-4 outline-none focus:border-[#00878a]" placeholder="Dikkat Çekici Başlık" />
            <textarea rows={2} value={settings.cta_text} onChange={e => setSettings({...settings, cta_text: e.target.value})} className="w-full px-4 py-3 border rounded-xl outline-none focus:border-[#00878a]" placeholder="Açıklama Metni"></textarea>
        </div>

        <button disabled={saving} type="submit" className="fixed bottom-10 right-10 bg-[#00878a] text-white px-10 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-2 hover:bg-[#082b34] transition-all">
          {saving ? <Loader2 className="animate-spin" /> : <Save />} Tüm Değişiklikleri Kaydet
        </button>
      </form>
    </div>
  );
}