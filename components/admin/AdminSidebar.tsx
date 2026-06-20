"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, Home, UserCircle, Briefcase, FileText, Mail, 
  Settings, ChevronDown, ChevronRight, Plus, List, CalendarCheck, 
  MessageSquare, MessageCircleQuestion, ClipboardList, Users, 
  LogOut, ExternalLink 
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Akordiyon menülerin açık/kapalı durum yönetimi
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    hizmetler: pathname.includes('/hizmetler'),
    yazilar: pathname.includes('/icerikler'),
    mesajlar: pathname.includes('/mesajlar'),
    formlar: pathname.includes('/danisan-formlari'),
    faq: pathname.includes('/faq'),
    olcekler: pathname.includes('/olcekler')
  });

  const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  const isActive = (path: string) => pathname === path;
  const isChildActive = (path: string) => pathname.startsWith(path);

  // Güvenli Çıkış Yapma Fonksiyonu
  const handleSignOut = async () => {
    if (window.confirm("Yönetim panelinden çıkış yapmak istediğinize emin misiniz?")) {
      await supabase.auth.signOut();
      router.push("/admin-login");
      router.refresh();
    }
  };

  return (
    <aside className="w-72 bg-[#082b34] text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shrink-0 sticky top-0 h-screen">
      
      {/* Panel Logo / Başlık Alanı */}
      <div className="h-20 flex flex-col items-center justify-center border-b border-slate-700/50 bg-[#061d24]">
        <h2 className="text-white font-bold text-lg tracking-wide"><span className="text-[#6ec9c9]">ELA</span> Teknoloji & Tasarım</h2>
        <p className="text-[#6ec9c9] text-[10px] tracking-widest uppercase mt-0.5">Cyber Panel v2.0</p>
      </div>

      {/* Menü Linkleri (Scroll edilebilir ana alan) */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin">
        
        <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}>
          <LayoutDashboard className="w-5 h-5" /> Gösterge Paneli
        </Link>
        
        <Link href="/admin/anasayfa" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/anasayfa') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}>
          <Home className="w-5 h-5" /> Anasayfa Modülü
        </Link>
        
        <Link href="/admin/hakkimda" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/hakkimda') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}>
          <UserCircle className="w-5 h-5" /> Hakkımızda Modülü
        </Link>

        {/* Akordiyon: Hizmetler */}
        <div>
          <button onClick={() => toggleMenu('hizmetler')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/hizmetler') && !isActive('/admin/hizmetler') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Briefcase className="w-5 h-5" /> Hizmetler</div>
            {openMenus.hizmetler ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.hizmetler && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              <Link href="/admin/hizmetler" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/hizmetler') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><List className="w-4 h-4" /> Tüm Hizmetler</Link>
              <Link href="/admin/hizmetler/yeni" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/hizmetler/yeni') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><Plus className="w-4 h-4" /> Yeni Ekle</Link>
            </div>
          )}
        </div>

        {/* Akordiyon: Yazılar */}
        <div>
          <button onClick={() => toggleMenu('yazilar')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/icerikler') && !isActive('/admin/icerikler') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><FileText className="w-5 h-5" /> Yazılar</div>
            {openMenus.yazilar ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.yazilar && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              <Link href="/admin/icerikler" className={`block px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/icerikler') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}>Tüm Yazılar</Link>
              <Link href="/admin/icerikler/yeni?type=makale" className="block px-3 py-2 text-sm rounded-md hover:text-white hover:bg-white/5 transition-colors">Blog İçeriği Ekle</Link>
              <Link href="/admin/icerikler/yeni?type=kitap" className="block px-3 py-2 text-sm rounded-md hover:text-white hover:bg-white/5 transition-colors">Kitap Önerisi Ekle</Link>
              <Link href="/admin/icerikler/yeni?type=video" className="block px-3 py-2 text-sm rounded-md hover:text-white hover:bg-white/5 transition-colors">Video Ekle</Link>
            </div>
          )}
        </div>

        {/* Akordiyon: Formlar */}
        <div>
          <button onClick={() => toggleMenu('formlar')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/danisan-formlari') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><ClipboardList className="w-5 h-5" /> Formlar</div>
            {openMenus.formlar ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.formlar && (
            <div className="pl-11 pr-2 py-2 space-y-1 text-[13px]">
              <Link href="/admin/danisan-formlari" className={`block px-3 py-2 rounded-md transition-colors ${isActive('/admin/danisan-formlari') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}>Tüm Formlar</Link>
              <div className="border-t border-slate-700 my-1"></div>
              <Link href="/admin/danisan-formlari?type=yetiskin_on_gorusme" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Yetişkin Ön Görüşme</Link>
              <Link href="/admin/danisan-formlari?type=cocuk_ergen_on_gorusme" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Çocuk/Ergen Ön Görüşme</Link>
              <Link href="/admin/danisan-formlari?type=dusunce_kayit" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Düşünce Kayıt Formu</Link>
              <Link href="/admin/danisan-formlari?type=kanitlari_tarama" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Kanıtları Tarama</Link>
              <Link href="/admin/danisan-formlari?type=basa_cikma_karti" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Başa Çıkma Kartı</Link>
              <Link href="/admin/danisan-formlari?type=trafik_isiklari" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Trafik Işıkları</Link>
              <Link href="/admin/danisan-formlari?type=haftalik_planlama" className="block px-3 py-2 rounded-md hover:text-white hover:bg-white/5 transition-colors">Haftalık Planlama</Link>
            </div>
          )}
        </div>

        {/* Akordiyon: Ölçekler */}
        <div>
          <button onClick={() => toggleMenu('olcekler')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/olcekler') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><ClipboardList className="w-5 h-5" /> Ölçekler</div>
            {openMenus.olcekler ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.olcekler && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              <Link href="/admin/olcekler" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/olcekler') && !isActive('/admin/olcekler/sonuclar') && !isActive('/admin/olcekler/yeni') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><List className="w-4 h-4" /> Tüm Ölçekler</Link>
              <Link href="/admin/olcekler/yeni" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/olcekler/yeni') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><Plus className="w-4 h-4" /> Yeni Ölçek Ekle</Link>
              <Link href="/admin/olcekler/sonuclar" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/olcekler/sonuclar') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><CalendarCheck className="w-4 h-4" /> Gelen Sonuçlar</Link>
            </div>
          )}
        </div>

        {/* Akordiyon: S.S.S. */}
        <div>
          <button onClick={() => toggleMenu('faq')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/faq') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><MessageCircleQuestion className="w-5 h-5" /> S.S.S.</div>
            {openMenus.faq ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.faq && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              <Link href="/admin/faq" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/faq') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><List className="w-4 h-4" /> Tüm Sorular</Link>
              <Link href="/admin/faq/yeni" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/faq/yeni') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><Plus className="w-4 h-4" /> Yeni Soru Ekle</Link>
            </div>
          )}
        </div>

        {/* Akordiyon: Gelen Kutusu */}
        <div>
          <button onClick={() => toggleMenu('mesajlar')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/mesajlar') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5" /> Gelen Kutusu</div>
            {openMenus.mesajlar ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.mesajlar && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              <Link href="/admin/mesajlar" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/mesajlar') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><List className="w-4 h-4" /> Tüm Mesajlar</Link>
              <Link href="/admin/mesajlar/iletisim" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/mesajlar/iletisim') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><MessageSquare className="w-4 h-4" /> İletişim Formları</Link>
              <Link href="/admin/mesajlar/randevu" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/mesajlar/randevu') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><CalendarCheck className="w-4 h-4" /> Randevu Talepleri</Link>
            </div>
          )}
        </div>

        <Link href="/admin/kullanicilar" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/kullanicilar') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}>
          <Users className="w-5 h-5" /> Yönetici Hesapları
        </Link>

        <Link href="/admin/ayarlar" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/ayarlar') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}>
          <Settings className="w-5 h-5" /> Genel Ayarlar
        </Link>
      </nav>

      {/* Alt Sabit Butonlar */}
      <div className="p-4 border-t border-slate-800 bg-[#061d24] space-y-1">
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors group"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-[#6ec9c9]" /> Siteyi Görüntüle
          </span>
          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Oturumu Kapat
        </button>
      </div>

    </aside>
  );
}