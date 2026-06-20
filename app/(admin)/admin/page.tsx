import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, Briefcase, Settings, Plus, ArrowRight, UserCheck, MessageCircleQuestion, ClipboardList } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Veritabanından dinamik istatistikleri çekiyoruz
  const { count: servicesCount } = await supabase
    .from('services')
    .select('*', { count: 'exact', head: true });

  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  const { count: faqsCount } = await supabase
    .from('faqs')
    .select('*', { count: 'exact', head: true });

  // YENİ: Doldurulan Ölçek Sonuçları İstatistiği
  const { count: scaleResultsCount } = await supabase
    .from('scale_results')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Karşılama Alanı */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Yönetim Paneli</h1>
        <p className="text-slate-500 mt-1">Kliniğinizin dijital içeriklerini ve site ayarlarını buradan anlık olarak yönetebilirsiniz.</p>
      </div>

      {/* İstatistik Özet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        
        {/* Hizmetler İstatistiği */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aktif Hizmetler</p>
            <h3 className="text-3xl font-bold text-[#082b34] mt-2">{servicesCount || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Listelenen terapi dalları</p>
          </div>
          <div className="w-12 h-12 bg-[#6ec9c9]/10 text-[#0f4c5c] rounded-lg flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        {/* İçerikler İstatistiği */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Toplam İçerik</p>
            <h3 className="text-3xl font-bold text-[#082b34] mt-2">{postsCount || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Makale, kitap ve videolar</p>
          </div>
          <div className="w-12 h-12 bg-[#6ec9c9]/10 text-[#0f4c5c] rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* YENİ: Doldurulan Ölçek İstatistiği */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Ölçek Sonuçları</p>
            <h3 className="text-3xl font-bold text-[#082b34] mt-2">{scaleResultsCount || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Doldurulan test sayıları</p>
          </div>
          <div className="w-12 h-12 bg-[#6ec9c9]/10 text-[#0f4c5c] rounded-lg flex items-center justify-center">
            <ClipboardList className="w-6 h-6" />
          </div>
        </div>

        {/* SSS İstatistiği */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">S.S.S</p>
            <h3 className="text-3xl font-bold text-[#082b34] mt-2">{faqsCount || 0}</h3>
            <p className="text-xs text-slate-400 mt-1">Cevaplanan soru adedi</p>
          </div>
          <div className="w-12 h-12 bg-[#6ec9c9]/10 text-[#0f4c5c] rounded-lg flex items-center justify-center">
            <MessageCircleQuestion className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Hızlı İşlem Kısayolları */}
      <h2 className="text-xl font-bold text-slate-900 mb-6">Hızlı İşlemler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Yeni Hizmet */}
        <Link href="/admin/hizmetler/yeni" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-40">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#6ec9c9]/10 transition-colors">
              <Plus className="w-5 h-5 text-slate-600 group-hover:text-[#0f4c5c]" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#0f4c5c] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Yeni Hizmet Ekle</h4>
            <p className="text-xs text-slate-500 mt-1">Klinik uzmanlık alanlarına yeni terapi türü tanımlayın.</p>
          </div>
        </Link>

        {/* Yeni İçerik */}
        <Link href="/admin/icerikler/yeni" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-40">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#6ec9c9]/10 transition-colors">
              <Plus className="w-5 h-5 text-slate-600 group-hover:text-[#0f4c5c]" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#0f4c5c] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Yeni İçerik Ekle</h4>
            <p className="text-xs text-slate-500 mt-1">Yeni bir makale yazın, kitap önerisi veya video ekleyin.</p>
          </div>
        </Link>

        {/* YENİ: Gelen Ölçek Sonuçları */}
        <Link href="/admin/olcekler/sonuclar" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-40">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#6ec9c9]/10 transition-colors">
              <ClipboardList className="w-5 h-5 text-slate-600 group-hover:text-[#0f4c5c]" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#0f4c5c] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Ölçek Sonuçları</h4>
            <p className="text-xs text-slate-500 mt-1">Danışanların doldurduğu ölçeklerin sonuçlarını inceleyin.</p>
          </div>
        </Link>

        {/* Genel Ayarlar */}
        <Link href="/admin/ayarlar" className="group p-6 bg-white border border-slate-200 rounded-xl hover:border-[#6ec9c9] hover:shadow-md transition-all flex flex-col justify-between h-40">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-slate-50 rounded-lg group-hover:bg-[#6ec9c9]/10 transition-colors">
              <Settings className="w-5 h-5 text-slate-600 group-hover:text-[#0f4c5c]" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#0f4c5c] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">İletişim Ayarları</h4>
            <p className="text-xs text-slate-500 mt-1">Telefon, WhatsApp, adres ve sosyal medya linklerini güncelleyin.</p>
          </div>
        </Link>

      </div>

    </div>
  );
}