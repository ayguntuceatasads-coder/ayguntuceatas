import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  FileText, Briefcase, Settings, Plus, ArrowRight, 
  MessageCircleQuestion, ClipboardList, Scale, FileSignature, 
  Users, Layers, ArrowUpRight 
} from "lucide-react";
import CopyLinkButton from "@/components/admin/CopyLinkButton";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Orijinal Sayaçların Eksiksiz Çekilmesi
  const { count: servicesCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });

  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  const { count: faqsCount } = await supabase
    .from('faqs')
    .select('*', { count: 'exact', head: true });

  const { count: scaleResultsCount } = await supabase
    .from('scale_results')
    .select('*', { count: 'exact', head: true });

  // Yeni Modül: Doldurulan Danışan Formları Sayacı
  const { count: intakeFormsCount } = await supabase
    .from('intake_forms')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-7xl mx-auto pb-20 px-6 pt-6 bg-slate-50/30">
      
      {/* Karşılama Alanı */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Yönetim Paneli</h1>
          <p className="text-slate-500 mt-1 text-sm">Kliniğin dijital hafızası ve otomasyon merkezi v2.0</p>
        </div>
        <div className="mt-4 md:mt-0 text-xs font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          ELA Cyber Panel Secure
        </div>
      </div>

      {/* DİNAMİK İSTATİSTİK SAYAÇLARI */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-fit mb-3"><Briefcase className="w-5 h-5" /></div>
          <div className="text-2xl font-black text-slate-900">{servicesCount || 0}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Aktif Hizmet</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-3"><FileText className="w-5 h-5" /></div>
          <div className="text-2xl font-black text-slate-900">{postsCount || 0}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Blog İçeriği</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-fit mb-3"><MessageCircleQuestion className="w-5 h-5" /></div>
          <div className="text-2xl font-black text-slate-900">{faqsCount || 0}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 font-sans">S.S.S. İçerik</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl w-fit mb-3"><Scale className="w-5 h-5" /></div>
          <div className="text-2xl font-black text-slate-900">{scaleResultsCount || 0}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Ölçek Sonucu</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-3"><ClipboardList className="w-5 h-5" /></div>
          <div className="text-2xl font-black text-slate-900">{intakeFormsCount || 0}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Gelen Klinik Form</div>
        </div>
      </div>

      {/* YÖNETİM MODÜLLERİ GRID ALANI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        
        <Link href="/admin/hizmetler" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"><Briefcase className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Hizmet Yönetimi</h4><p className="text-xs text-slate-500 mt-1">Klinik uzmanlık alanlarını ekle/çıkar.</p></div>
        </Link>

        <Link href="/admin/icerikler" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all"><FileText className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Yazı & Blog Yönetimi</h4><p className="text-xs text-slate-500 mt-1">Makaleler, kitaplar ve videolar.</p></div>
        </Link>

        <Link href="/admin/danisan-formlari" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all"><ClipboardList className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Gelen Klinik Formlar</h4><p className="text-xs text-slate-500 mt-1">ABC, Başa Çıkma, Ön Görüşme formları.</p></div>
        </Link>

        <Link href="/admin/yasal" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all"><FileSignature className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Yasal Belgeler Paneli</h4><p className="text-xs text-slate-500 mt-1">KVKK, Aydınlatma, Gizlilik Sözleşmeleri.</p></div>
        </Link>

        <Link href="/admin/olcekler" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all"><Scale className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Ölçek Parametreleri</h4><p className="text-xs text-slate-500 mt-1">Test soruları ve puanlama katsayıları.</p></div>
        </Link>

        <Link href="/admin/olcekler/sonuclar" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all"><Layers className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Ölçek Sonuçları</h4><p className="text-xs text-slate-500 mt-1">Hesaplanan test puanları ve grafik analizleri.</p></div>
        </Link>

        <Link href="/admin/faq" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-all"><MessageCircleQuestion className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">S.S.S. Modülü</h4><p className="text-xs text-slate-500 mt-1">Sıkça sorulan sorular alanı yönetimi.</p></div>
        </Link>

        <Link href="/admin/ayarlar" className="group p-6 bg-white border border-slate-200 rounded-2xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-44">
          <div className="flex justify-between items-start"><div className="p-3 bg-slate-50 rounded-xl text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all"><Settings className="w-5 h-5" /></div><ArrowRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" /></div>
          <div><h4 className="font-bold text-slate-900">Genel Ayarlar</h4><p className="text-xs text-slate-500 mt-1">Site SEO ayarları ve iletişim verileri.</p></div>
        </Link>

      </div>

      {/* HOCAMIZIN KOPYALAYACAĞI DETAYLI KLİNİK LİNKLER PANELİ */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6ec9c9]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-bold text-[#6ec9c9] flex items-center gap-2">Klinik Form Otomasyon Linkleri</h3>
            <p className="text-xs text-slate-400 mt-0.5">Danışanlara göndermek için sağdaki ikona basarak bağlantıyı panoya kopyalayın.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { t: "Yetişkin Ön Görüşme", s: "yetiskin-on-gorusme" },
            { t: "Çocuk Ergen Ön Görüşme", s: "cocuk-ergen-on-gorusme" },
            { t: "Düşünce Kayıt Formu", s: "dusunce-kayit" },
            { t: "Olay-Duygu-Düşünce (ABC)", s: "olay-duygu-dusunce" },
            { t: "Kanıtları Tarama Formu", s: "kanitlari-tarama" },
            { t: "Haftalık Planlama Çizelgesi", s: "haftalik-planlama" },
            { t: "Başa Çıkma Kartı (Şema)", s: "basa-cikma-karti" },
            { t: "Trafik Işıkları Metodu", s: "trafik-isiklari" }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors">
              <div className="truncate pr-3">
                <span className="text-sm font-semibold block text-slate-200">{item.t}</span>
                <span className="text-[10px] font-mono text-slate-500">/{item.s}</span>
              </div>
              <CopyLinkButton slug={item.s} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}