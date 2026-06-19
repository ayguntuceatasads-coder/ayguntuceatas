"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Loader2, Settings, Globe, MapPin, MessageCircle, CheckCircle2, AlertCircle } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  // Bildirim kutusunu yönetecek state
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({ 
    site_title: "", site_description: "",
    phone: "", whatsapp: "", email: "", instagram: "", address: "", map_embed: "",
    footer_text: "", floating_phone: "", floating_whatsapp: "", floating_whatsapp_text: ""
  });

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setForm({ 
          site_title: data.site_title || "", site_description: data.site_description || "",
          phone: data.phone || "", whatsapp: data.whatsapp || "", email: data.email || "", instagram: data.instagram || "", 
          address: data.address || "", map_embed: data.map_embed || "", footer_text: data.footer_text || "",
          floating_phone: data.floating_phone || "", floating_whatsapp: data.floating_whatsapp || "",
          floating_whatsapp_text: data.floating_whatsapp_text || ""
        });
        setLogoUrl(data.logo_url || "");
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null); // Önceki bildirimi temizle

    const { error } = await supabase.from("site_settings").upsert({ 
      id: 1, ...form, logo_url: logoUrl, updated_at: new Date().toISOString() 
    });

    if(error) {
      // Hata durumunda kırmızı kutu
      setStatus({ type: "error", message: "Hata oluştu: " + error.message });
    } else {
      // Başarı durumunda yeşil kutu (Alert yerine)
      setStatus({ type: "success", message: "Tüm ayarlar başarıyla güncellendi!" });
      // 4 saniye sonra kutuyu otomatik gizle
      setTimeout(() => setStatus(null), 4000);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-slate-500 font-medium">Ayarlar yükleniyor...</div>;

  return (
    <div className="max-w-5xl pb-20">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-[#00878a]/10 rounded-xl text-[#00878a]"><Settings className="w-6 h-6"/></div>
        <h1 className="text-2xl font-bold text-[#082b34]">Gelişmiş Site Ayarları</h1>
      </div>

      {/* --- ŞIK BİLDİRİM KUTUSU --- */}
      {status && (
        <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 border shadow-sm transition-all duration-500 animate-in fade-in slide-in-from-top-4 ${status.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          {status.type === "success" ? <CheckCircle2 className="w-6 h-6 shrink-0 text-green-600" /> : <AlertCircle className="w-6 h-6 shrink-0 text-red-600" />}
          <span className="font-semibold">{status.message}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- DİĞER TÜM İNPUTLAR AYNEN KALIYOR --- */}
        
        {/* 1. SEO VE TEMEL AYARLAR */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#082b34] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4"><Globe className="w-5 h-5 text-[#00878a]" /> Global SEO ve Logo Ayarları</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Site Logosu</label>
              <ImageUpload value={logoUrl} onChange={setLogoUrl} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sitenin Genel Başlığı (Google Title)</label>
                <input value={form.site_title} onChange={(e) => setForm({...form, site_title: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sitenin Genel Açıklaması (Google Description)</label>
                <textarea value={form.site_description} onChange={(e) => setForm({...form, site_description: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. İLETİŞİM VE HARİTA */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#082b34] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4"><MapPin className="w-5 h-5 text-[#00878a]" /> İletişim ve Adres (İletişim Sayfası & Footer)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefon</label><input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp</label><input value={form.whatsapp} onChange={(e) => setForm({...form, whatsapp: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">E-posta</label><input value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Instagram Linki</label><input value={form.instagram} onChange={(e) => setForm({...form, instagram: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Açık Adres</label><textarea value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} rows={2} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none resize-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Google Maps Embed (Iframe Kodu)</label><textarea value={form.map_embed} onChange={(e) => setForm({...form, map_embed: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-[#00878a] outline-none font-mono text-xs" /></div>
          </div>
        </div>

        {/* 3. YÜZEN BUTONLAR VE FOOTER */}
        <div className="bg-[#082b34] border border-slate-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-slate-700 pb-4"><MessageCircle className="w-5 h-5 text-[#6ec9c9]" /> Yüzen Butonlar & Footer Alanı</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="block text-sm font-semibold text-slate-300 mb-1.5">Yüzen Buton: Telefon</label><input value={form.floating_phone} onChange={(e) => setForm({...form, floating_phone: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-[#6ec9c9] outline-none" /></div>
            <div><label className="block text-sm font-semibold text-slate-300 mb-1.5">Yüzen Buton: WhatsApp</label><input value={form.floating_whatsapp} onChange={(e) => setForm({...form, floating_whatsapp: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-[#6ec9c9] outline-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-300 mb-1.5">WhatsApp Otomatik Mesaj Metni</label><input value={form.floating_whatsapp_text} onChange={(e) => setForm({...form, floating_whatsapp_text: e.target.value})} type="text" className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-[#6ec9c9] outline-none" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-300 mb-1.5">Footer Sol Alt Kurumsal Yazı</label><textarea value={form.footer_text} onChange={(e) => setForm({...form, footer_text: e.target.value})} rows={3} className="w-full px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 text-white focus:border-[#6ec9c9] outline-none resize-none" /></div>
          </div>
        </div>

        <div className="sticky bottom-6 flex justify-end">
          <button disabled={saving} type="submit" className="bg-[#00878a] hover:bg-[#5e338d] text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Tüm Ayarları Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}