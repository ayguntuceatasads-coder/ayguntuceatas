"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, UserCircle, Plus, Trash2, CheckCircle2, AlertCircle, BookmarkPlus } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const [profileImg, setProfileImg] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profileSubtitle, setProfileSubtitle] = useState("");
  const [bioContent, setBioContent] = useState("");
  const [congressContent, setCongressContent] = useState(""); // YENİ: Kongreler içeriği

  const [clinicalAreas, setClinicalAreas] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  
  // YENİ: Kategorize edilmiş eğitimler state'i
  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("about_content").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setBioContent(data.bio_text || "");
        setCongressContent(data.congress_text || ""); // Kongre verisini çek
        setProfileImg(data.profile_image_url || "");
        setProfileTitle(data.profile_title || "");
        setProfileSubtitle(data.profile_subtitle || "");
        
        setClinicalAreas(data.clinical_areas || []);
        setExperience(data.experience || []);
        setBooks(data.books || []);

        // Eğer eski düz sertifika verisi varsa onu "Genel Eğitimler" kategorisine saralım ki veriler kaybolmasın
        let loadedCerts = data.certifications || [];
        if (loadedCerts.length > 0 && !loadedCerts[0].category) {
          loadedCerts = [{ category: "Diğer Eğitimler & Sertifikalar", items: loadedCerts }];
        }
        setCertifications(loadedCerts);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const updatedBioText = formData.get("bio_text") as string;
    const updatedCongressText = formData.get("congress_text") as string;

    const { error } = await supabase.from("about_content").upsert({
      id: 1,
      bio_text: updatedBioText,
      congress_text: updatedCongressText,
      profile_image_url: profileImg,
      profile_title: profileTitle,
      profile_subtitle: profileSubtitle,
      clinical_areas: clinicalAreas,
      certifications: certifications, // Gruplu JSON olarak kaydedilir
      books: books,
      experience: experience,
      updated_at: new Date().toISOString()
    });

    if (error) setStatus({ type: "error", message: "Hata: " + error.message });
    else {
      setStatus({ type: "success", message: "Özgeçmiş başarıyla güncellendi!" });
      setTimeout(() => setStatus(null), 4000);
    }
    setSaving(false);
  };

  // Düz listeler için yardımcı (Çalışma Alanı, Deneyim, Kitap)
  const renderDynamicList = (title: string, items: any[], setItems: any, hasDetail: boolean = true) => (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <label className="block text-sm font-bold text-[#082b34] mb-4">{title}</label>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100 hover:border-[#00878a]/30">
            <div className="flex-1 space-y-2">
              <input type="text" value={item.title || ""} onChange={(e) => { const newItems = [...items]; newItems[index].title = e.target.value; setItems(newItems); }} placeholder="Başlık" className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 outline-none focus:border-[#00878a]" />
              {hasDetail && <input type="text" value={item.detail || ""} onChange={(e) => { const newItems = [...items]; newItems[index].detail = e.target.value; setItems(newItems); }} placeholder="Açıklama / Tarih" className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 outline-none focus:border-[#00878a]" />}
            </div>
            <button type="button" onClick={() => setItems(items.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => setItems([...items, { title: "", detail: "" }])} className="mt-4 flex items-center gap-2 text-sm font-bold text-[#00878a] bg-[#00878a]/5 px-4 py-2 rounded-lg"><Plus className="w-4 h-4" /> Yeni Ekle</button>
    </div>
  );

  if (loading) return <div className="p-10">Yükleniyor...</div>;

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#5e338d]/10 rounded-xl text-[#5e338d]"><UserCircle className="w-6 h-6"/></div>
        <h1 className="text-2xl font-bold text-[#082b34]">Hakkımda Modülü Yönetimi</h1>
      </div>

      {status && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border ${status.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {status.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          <span className="font-semibold">{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* PROFİL VE BİYOGRAFİ */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#082b34] mb-6 border-b pb-4">Profil Kartı ve Biyografi</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-4">
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Uzman Fotoğrafı</label><ImageUpload value={profileImg} onChange={setProfileImg} /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Profil İsmi / Başlık</label><input type="text" value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)} className="w-full px-4 py-2 text-sm border rounded-lg focus:border-[#00878a] outline-none" /></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-2">Profil Ünvanı</label><input type="text" value={profileSubtitle} onChange={(e) => setProfileSubtitle(e.target.value)} className="w-full px-4 py-2 text-sm border rounded-lg focus:border-[#00878a] outline-none" /></div>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-3">Detaylı Biyografi</label>
              <RichTextEditor name="bio_text" defaultValue={bioContent} />
            </div>
          </div>
        </div>

        {/* GRUPLU EĞİTİMLER (YENİ YAPI) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm border-t-4 border-t-[#5e338d]">
          <div className="flex items-center justify-between mb-6 border-b pb-4">
             <h2 className="text-lg font-bold text-[#082b34]">Kategorize Edilmiş Eğitimler & Sertifikalar</h2>
             <button type="button" onClick={() => setCertifications([...certifications, { category: "", items: [] }])} className="flex items-center gap-2 bg-[#5e338d] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#3d215e] transition-colors">
               <BookmarkPlus className="w-4 h-4" /> Kategori Ekle (Örn: EMDR Eğitimleri)
             </button>
          </div>
          
          <div className="space-y-8">
            {certifications.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                
                {/* Kategori Başlığı ve Kategori Silme */}
                <div className="flex items-center gap-4 mb-4">
                  <input type="text" value={group.category} onChange={(e) => { const newCerts = [...certifications]; newCerts[groupIndex].category = e.target.value; setCertifications(newCerts); }} placeholder="Kategori Başlığı (Örn: Kognitif Davranış Terapisi Eğitimleri)" className="flex-1 px-4 py-2 font-bold text-[#5e338d] border-b-2 border-slate-300 bg-transparent outline-none focus:border-[#5e338d]" />
                  <button type="button" onClick={() => setCertifications(certifications.filter((_, i) => i !== groupIndex))} className="text-red-500 text-sm font-semibold hover:underline">Kategoriyi Sil</button>
                </div>

                {/* Kategori İçindeki Eğitim Maddeleri */}
                <div className="space-y-3 pl-4 border-l-2 border-[#5e338d]/20">
                  {group.items.map((item: any, itemIndex: number) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                       <input type="text" value={item.title} onChange={(e) => { const newCerts = [...certifications]; newCerts[groupIndex].items[itemIndex].title = e.target.value; setCertifications(newCerts); }} placeholder="Eğitim Adı (Örn: EMDR Part 1)" className="flex-1 px-3 py-1.5 text-sm rounded border outline-none focus:border-[#00878a]" />
                       <input type="text" value={item.detail || ""} onChange={(e) => { const newCerts = [...certifications]; newCerts[groupIndex].items[itemIndex].detail = e.target.value; setCertifications(newCerts); }} placeholder="Kurum/Tarih (Örn: DBE, 2017)" className="w-1/3 px-3 py-1.5 text-sm rounded border outline-none focus:border-[#00878a]" />
                       <button type="button" onClick={() => { const newCerts = [...certifications]; newCerts[groupIndex].items = newCerts[groupIndex].items.filter((_:any, i:number) => i !== itemIndex); setCertifications(newCerts); }} className="p-1.5 text-red-500 hover:bg-red-100 rounded"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => { const newCerts = [...certifications]; newCerts[groupIndex].items.push({ title: "", detail: "" }); setCertifications(newCerts); }} className="text-xs font-bold text-[#00878a] flex items-center gap-1 hover:underline mt-2">
                    <Plus className="w-3 h-3" /> Bu Kategoriye Eğitim Ekle
                  </button>
                </div>
              </div>
            ))}
            {certifications.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Henüz kategori eklenmedi. Sağ üstten "Kategori Ekle" butonuna basarak başlayın.</p>}
          </div>
        </div>

        {/* DİĞER LİSTELER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderDynamicList("Çalışma Alanları", clinicalAreas, setClinicalAreas, false)}
          {renderDynamicList("Mesleki Deneyim", experience, setExperience, true)}
          {renderDynamicList("Yayınlanan Kitaplar", books, setBooks, true)}
        </div>

        {/* KONGRELER VE SEMİNERLER (YENİ EDİTÖR) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#082b34] mb-3">Kongreler, Seminerler ve Çalıştaylar</h2>
          <p className="text-sm text-slate-500 mb-4">Bu alanı listeler (madde işaretleri) kullanarak toplu halde doldurabilirsiniz.</p>
          <RichTextEditor name="congress_text" defaultValue={congressContent} />
        </div>

        <div className="sticky bottom-6 flex justify-end">
          <button disabled={saving} type="submit" className="bg-[#00878a] hover:bg-[#082b34] text-white px-12 py-4 rounded-xl font-bold flex items-center gap-2 shadow-xl transition-all">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Tüm Sayfayı Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}