"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RandevuMesajlari() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    // Veritabanındaki 'type' değerini küçük harfle 'randevu' diye kaydettiğinden emin ol
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("type", "randevu") 
      .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase Sorgu Hatası:", error);
    } else {
        setMessages(data || []);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Randevu Talepleri ({messages.length})</h1>
      {messages.length === 0 ? (
        <p className="text-gray-500">Hiç randevu talebi bulunamadı.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="p-6 bg-white border border-purple-200 rounded-xl shadow-sm">
              <h3 className="font-bold text-lg">{m.name || "İsimsiz"}</h3>
              <p className="text-sm text-gray-500 mb-2">{m.phone} | {m.service}</p>
              <div className="bg-purple-50 p-3 rounded text-sm text-gray-700 italic">
                {m.message || "Mesaj içeriği boş."}
              </div>
              <div className="mt-3 flex gap-4 text-xs text-gray-400">
                <span>Yaş: {m.age || "Belirtilmemiş"}</span>
                <span>Tip: {m.session_type || "Belirtilmemiş"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}