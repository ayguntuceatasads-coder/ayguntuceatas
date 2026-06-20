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
    // Tüm sütunları çekiyoruz
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) console.error("Veri çekme hatası:", error);
    if (data) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    await supabase.from("messages").update({ is_read: true }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Mesajlar yükleniyor...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Gelen Mesajlar ({messages.length})</h1>
      
      <div className="space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`p-6 border rounded-2xl shadow-sm transition-all bg-white ${msg.is_read ? "border-slate-200" : "border-blue-500 ring-2 ring-blue-500/10"}`}>
            
            <div className="flex justify-between items-start border-b pb-4 mb-4">
              <div>
                <h3 className="font-bold text-xl text-slate-900">{msg.name || "İsimsiz"}</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold mt-1 uppercase ${msg.type === 'randevu' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                  {msg.type || 'İletişim'}
                </span>
              </div>
              {!msg.is_read && (
                <button onClick={() => markAsRead(msg.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Okundu İşaretle</button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-sm">
                <p className="text-slate-400 font-bold uppercase text-[10px]">İletişim</p>
                <p>{msg.email}</p>
                <p className="font-medium">{msg.phone}</p>
              </div>

              {msg.type === 'randevu' ? (
                <div className="text-sm">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Randevu Detayları</p>
                  <p><span className="font-semibold">Hizmet:</span> {msg.service || "Belirtilmemiş"}</p>
                  <p><span className="font-semibold">Tip:</span> {msg.session_type || "Belirtilmemiş"}</p>
                  <p><span className="font-semibold">Yaş:</span> {msg.age || "Belirtilmemiş"}</p>
                </div>
              ) : (
                <div className="text-sm">
                  <p className="text-slate-400 font-bold uppercase text-[10px]">Konu</p>
                  <p className="font-medium">{msg.subject || "Konu yok"}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t">
              <p className="text-slate-400 font-bold uppercase text-[10px] mb-2">Mesaj İçeriği</p>
              <p className="bg-slate-50 p-4 rounded-lg text-slate-700 italic">{msg.message}</p>
            </div>
            
            <p className="text-right text-[10px] text-slate-400 mt-4">
              {new Date(msg.created_at).toLocaleString('tr-TR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}