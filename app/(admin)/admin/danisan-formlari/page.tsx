"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Search, CheckCircle2, X, Clock, User, Phone, Mail, Filter } from "lucide-react";

// Form tiplerini Türkçe ve şık etiketlere çeviren yardımcı obje
const FORM_TYPES: Record<string, { title: string; color: string }> = {
  yetiskin_on_gorusme: { title: "Yetişkin Ön Görüşme", color: "bg-blue-100 text-blue-700 border-blue-200" },
  cocuk_ergen_on_gorusme: { title: "Çocuk/Ergen Formu", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  olay_duygu_dusunce: { title: "Olay/Duygu/Düşünce (ABC)", color: "bg-orange-100 text-orange-700 border-orange-200" },
  kanitlari_tarama: { title: "Kanıtları Tarama", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  haftalik_planlama: { title: "Haftalık Planlama", color: "bg-purple-100 text-purple-700 border-purple-200" },
  dusunce_kayit: { title: "Düşünce Kayıt Formu", color: "bg-rose-100 text-rose-700 border-rose-200" },
  basa_cikma_karti: { title: "Başa Çıkma Kartı", color: "bg-teal-100 text-teal-700 border-teal-200" },
  trafik_isiklari: { title: "Trafik Işıkları", color: "bg-amber-100 text-amber-700 border-amber-200" },
};

export default function DanisanFormlariAdmin() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedForm, setSelectedForm] = useState<any | null>(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("intake_forms")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setForms(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("intake_forms").update({ is_read: true }).eq("id", id);
    setForms(prev => prev.map(f => f.id === id ? { ...f, is_read: true } : f));
    if (selectedForm && selectedForm.id === id) {
      setSelectedForm({ ...selectedForm, is_read: true });
    }
  };

  // Arama ve Filtreleme Mantığı
  const filteredForms = forms.filter(f => {
    const matchesSearch = f.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (f.patient_phone && f.patient_phone.includes(searchTerm));
    const matchesType = filterType === "all" || f.form_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      
      {/* Üst Başlık ve İstatistikler */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#082b34] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#6ec9c9]" />
            Danışan Formları
          </h1>
          <p className="text-slate-500 mt-2 text-sm">Sistem üzerinden doldurulan tüm klinik formlar ve ölçekler.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase">Toplam</span>
            <span className="text-lg font-bold text-[#082b34]">{forms.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm text-center">
            <span className="block text-xs font-bold text-red-400 uppercase">Okunmamış</span>
            <span className="text-lg font-bold text-red-600">{forms.filter(f => !f.is_read).length}</span>
          </div>
        </div>
      </div>

      {/* Filtreleme Çubuğu */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Danışan adı veya telefon ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm"
          />
        </div>
        <div className="relative md:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-[#6ec9c9] text-sm appearance-none bg-white"
          >
            <option value="all">Tüm Formlar</option>
            {Object.entries(FORM_TYPES).map(([key, val]) => (
              <option key={key} value={key}>{val.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Ana Liste */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-[#6ec9c9] rounded-full animate-spin mb-4"></div>
          Formlar yükleniyor...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredForms.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-200 border-dashed">
              Arama kriterlerine uygun form bulunamadı.
            </div>
          )}
          
          {filteredForms.map((form) => {
            const typeInfo = FORM_TYPES[form.form_type] || { title: form.form_type, color: "bg-slate-100 text-slate-700 border-slate-200" };
            
            return (
              <div 
                key={form.id} 
                onClick={() => { setSelectedForm(form); if(!form.is_read) markAsRead(form.id); }}
                className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all hover:shadow-md ${form.is_read ? 'border-slate-200 hover:border-slate-300 opacity-90' : 'border-[#6ec9c9] ring-2 ring-[#6ec9c9]/10 shadow-sm'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${typeInfo.color}`}>
                    {typeInfo.title}
                  </span>
                  {!form.is_read && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>}
                </div>
                
                <h3 className="text-lg font-bold text-[#082b34] mb-1 truncate">{form.patient_name}</h3>
                
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center text-xs text-slate-500"><Phone className="w-3.5 h-3.5 mr-2 shrink-0" /> {form.patient_phone}</div>
                  {form.patient_email && <div className="flex items-center text-xs text-slate-500"><Mail className="w-3.5 h-3.5 mr-2 shrink-0" /> {form.patient_email}</div>}
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(form.created_at).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}</span>
                  <span className="font-semibold text-[#0f4c5c] hover:text-[#6ec9c9] transition-colors">İncele &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FORM DETAY MODALI (Pop-up) */}
      {selectedForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082b34]/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Üst Kısım */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-[#082b34] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#6ec9c9]" />
                  {selectedForm.patient_name}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {FORM_TYPES[selectedForm.form_type]?.title || selectedForm.form_type} • {new Date(selectedForm.created_at).toLocaleString('tr-TR')}
                </p>
              </div>
              <button onClick={() => setSelectedForm(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal İçerik (Esnek JSONB Okuyucu) */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
              <div className="space-y-6">
                {Object.entries(selectedForm.form_data).map(([key, value]: [string, any], index) => {
                  
                  // Ayrıştırıcı çizgiler (Başlıklar) için özel tasarım
                  if (typeof value === 'string' && value.includes("---")) {
                    return (
                      <h3 key={index} className="text-sm font-bold text-[#0f4c5c] border-b-2 border-slate-100 pb-2 pt-4 mt-6 first:mt-0 first:pt-0 uppercase tracking-wide">
                        {key}
                      </h3>
                    );
                  }

                  // Boş verileri gizle
                  if (!value || (Array.isArray(value) && value.length === 0)) return null;

                  return (
                    <div key={index} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{key}</span>
                      
                      {/* Değer Array (Örn: Haftalık Planlama Listesi) ise alt alta yaz */}
                      {Array.isArray(value) ? (
                        <ul className="space-y-2">
                          {value.map((item, i) => (
                            <li key={i} className="text-sm text-slate-800 flex gap-2">
                              <span className="text-[#6ec9c9] font-bold">•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        // Normal Metin ise
                        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Alt Kısım */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex gap-4 text-sm font-medium text-slate-500">
                <a href={`tel:${selectedForm.patient_phone}`} className="flex items-center gap-1.5 hover:text-[#0f4c5c]"><Phone className="w-4 h-4" /> Ara</a>
                {selectedForm.patient_email && <a href={`mailto:${selectedForm.patient_email}`} className="flex items-center gap-1.5 hover:text-[#0f4c5c]"><Mail className="w-4 h-4" /> E-posta At</a>}
              </div>
              <button onClick={() => setSelectedForm(null)} className="px-5 py-2 bg-[#082b34] text-white text-sm font-bold rounded-xl hover:bg-[#0f4c5c] transition-colors">
                Kapat
              </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}