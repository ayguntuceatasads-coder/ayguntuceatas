"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, UserCircle, Briefcase, FileText, Mail, Settings, ChevronDown, ChevronRight, Plus, List, CalendarCheck, MessageSquare } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    hizmetler: pathname.includes('/hizmetler'),
    yazilar: pathname.includes('/icerikler'),
    mesajlar: pathname.includes('/mesajlar') // Mesajlar için state eklendi
  });

  const toggleMenu = (menu: string) => setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  const isActive = (path: string) => pathname === path;
  const isChildActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="w-72 bg-[#082b34] text-slate-300 min-h-screen flex flex-col border-r border-slate-800">
      <div className="h-20 flex flex-col items-center justify-center border-b border-slate-700/50 bg-[#061d24]">
        <h2 className="text-white font-bold text-lg tracking-wide"><span className="text-[#6ec9c9]">ELA</span> Teknoloji & Tasarım</h2>
        <p className="text-[#6ec9c9] text-[10px] tracking-widest uppercase mt-0.5">Cyber Panel v2.0</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 scrollbar-thin">
        <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}><LayoutDashboard className="w-5 h-5" /> Gösterge Paneli</Link>
        <Link href="/admin/anasayfa" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/anasayfa') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}><Home className="w-5 h-5" /> Anasayfa Modülü</Link>
        <Link href="/admin/hakkimda" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/hakkimda') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}><UserCircle className="w-5 h-5" /> Hakkımızda Modülü</Link>

        {/* Akordiyon: Hizmetler */}
        <div>
          <button onClick={() => toggleMenu('hizmetler')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/hizmetler') && !isActive('/admin/hizmetler') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Briefcase className="w-5 h-5" /> Hizmetler</div>{openMenus.hizmetler ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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
            <div className="flex items-center gap-3"><FileText className="w-5 h-5" /> Yazılar</div>{openMenus.yazilar ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
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

        {/* Akordiyon: Mesaj Kutusu (YENİ) */}
        <div>
          <button onClick={() => toggleMenu('mesajlar')} className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isChildActive('/admin/mesajlar') ? 'text-white' : 'hover:bg-white/5 hover:text-white'}`}>
            <div className="flex items-center gap-3"><Mail className="w-5 h-5" /> Gelen Kutusu</div>{openMenus.mesajlar ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {openMenus.mesajlar && (
            <div className="pl-11 pr-2 py-2 space-y-1">
              <Link href="/admin/mesajlar/iletisim" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/mesajlar/iletisim') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><MessageSquare className="w-4 h-4" /> İletişim Formları</Link>
              <Link href="/admin/mesajlar/randevu" className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${isActive('/admin/mesajlar/randevu') ? 'text-[#6ec9c9] font-semibold' : 'hover:text-white hover:bg-white/5'}`}><CalendarCheck className="w-4 h-4" /> Randevu Talepleri</Link>
            </div>
          )}
        </div>

        <Link href="/admin/ayarlar" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/ayarlar') ? 'bg-[#6ec9c9] text-[#082b34] font-bold' : 'hover:bg-white/5 hover:text-white'}`}><Settings className="w-5 h-5" /> Genel Ayarlar</Link>
      </nav>
    </aside>
  );
}