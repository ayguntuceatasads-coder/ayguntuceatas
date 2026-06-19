"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  async function fetchSlides() {
    setLoading(true);
    const { data } = await supabase
      .from("hero_slides")
      .select("*")
      .order("order_index", { ascending: true });
    
    setSlides(data || []);
    setLoading(false);
  }

  const addSlide = () => {
    setSlides([...slides, { 
      title: "Yeni Slayt Başlığı", 
      subtitle: "Slayt alt metni buraya gelecek.", 
      image_url: "", 
      button_text: "Randevu Al", 
      button_link: "/randevu" 
    }]);
  };

  const removeSlide = async (id: string | undefined, index: number) => {
    if (id) {
      const confirm = window.confirm("Bu slaytı kalıcı olarak silmek istediğinize emin misiniz?");
      if (!confirm) return;
      await supabase.from("hero_slides").delete().eq("id", id);
    }
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Veriyi hazırlarken "id" yoksa göndermiyoruz, böylece DB kendi üretir.
    const payload = slides.map((s, i) => {
      const obj: any = {
        title: s.title,
        subtitle: s.subtitle,
        image_url: s.image_url,
        button_text: s.button_text,
        button_link: s.button_link,
        order_index: i
      };
      
      // Eğer id mevcutsa ekle, değilse ekleme (Böylece null hatası almayız)
      if (s.id) {
        obj.id = s.id;
      }
      
      return obj;
    });

    const { error } = await supabase
      .from("hero_slides")
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error("Hata Detayı:", error);
      alert("Hata oluştu: " + error.message);
    } else {
      alert("Tüm slaytlar başarıyla kaydedildi!");
      fetchSlides();
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Yükleniyor...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#082b34]">Hero Slider Yönetimi</h1>
        <button onClick={addSlide} className="bg-[#00878a] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#082b34] transition-colors">
          <Plus className="w-5 h-5" /> Yeni Slayt Ekle
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div key={slide.id || index} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative group">
            <button 
              onClick={() => removeSlide(slide.id, index)} 
              className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Slayt Resmi</label>
                <ImageUpload value={slide.image_url} onChange={(val) => {
                  const newSlides = [...slides];
                  newSlides[index].image_url = val;
                  setSlides(newSlides);
                }} />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Başlık</label>
                  <input value={slide.title} onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[index].title = e.target.value;
                    setSlides(newSlides);
                  }} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#00878a]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Alt Başlık / Açıklama</label>
                  <textarea value={slide.subtitle} onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[index].subtitle = e.target.value;
                    setSlides(newSlides);
                  }} rows={2} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#00878a] resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Buton Yazısı</label>
                    <input value={slide.button_text} onChange={(e) => {
                      const newSlides = [...slides];
                      newSlides[index].button_text = e.target.value;
                      setSlides(newSlides);
                    }} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#00878a]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Buton Linki</label>
                    <input value={slide.button_link} onChange={(e) => {
                      const newSlides = [...slides];
                      newSlides[index].button_link = e.target.value;
                      setSlides(newSlides);
                    }} className="w-full px-4 py-2 border rounded-lg outline-none focus:border-[#00878a]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-10 right-10">
        <button onClick={handleSave} disabled={saving} className="bg-[#082b34] text-white px-10 py-4 rounded-xl font-bold shadow-2xl flex items-center gap-2 hover:bg-[#00878a] transition-all">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Tüm Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
}