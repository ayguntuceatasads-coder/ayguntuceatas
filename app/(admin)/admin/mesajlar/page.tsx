"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Gelen Mesajlar</h1>
      
      <div className="space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-6 border rounded-2xl shadow-sm transition-all ${msg.is_read ? "bg-white border-slate-200" : "bg-white border-blue-500 ring-2 ring-blue-500/10"}`}
          >
            {/* Header: İsim ve Tip */}
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h3 className="font-bold text-xl text-slate-900">{msg.name}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${msg.type === 'randevu' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                  {msg.type === 'randevu' ? 'RANDEVU TALEBİ' : 'İLETİŞİM MESAJI'}
                </span>
              </div>
              {!msg.is_read && (
                <button 
                  onClick={() => markAsRead(msg.id)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 font-medium"
                >
                  Okundu İşaretle
                </button>
              )}
            </div>

            {/* İçerik Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* İletişim Bilgileri */}
              <div className="space-y-2">
                <p className="text-sm text-slate-400 font-semibold uppercase">İletişim</p>
                <p className="text-slate-700">{msg.email}</p>
                <p className="text-slate-700 font-medium">{msg.phone}</p>
              </div>

              {/* Detaylar (Sadece varsa göster) */}
              <div className="space-y-3">
                {msg.type === 'randevu' && (
                  <>
                    <div>
                      <p className="text-sm text-slate-400 font-semibold uppercase">Hizmet</p>
                      <p className="text-slate-800 font-medium">{msg.service || '-'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-slate-400 font-semibold uppercase">Görüşme</p>
                        <p className="text-slate-800 font-medium">{msg.session_type || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400 font-semibold uppercase">Yaş</p>
                        <p className="text-slate-800 font-medium">{msg.age || '-'}</p>
                      </div>
                    </div>
                  </>
                )}
                
                {msg.type === 'iletisim' && (
                  <div>
                    <p className="text-sm text-slate-400 font-semibold uppercase">Konu</p>
                    <p className="text-slate-800 font-medium">{msg.subject || 'Belirtilmemiş'}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mesaj/Not Alanı */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm text-slate-400 font-semibold uppercase mb-2">Not / Mesaj İçeriği</p>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 italic border border-slate-100">
                {msg.message || "Ek not bırakılmamış."}
              </div>
            </div>
            
            <p className="text-right text-xs text-slate-400 mt-4">
              {new Date(msg.created_at).toLocaleDateString('tr-TR')} {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}