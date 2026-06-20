"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function RandevuMesajlari() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchRandevular = async () => {
      // type sütunu 'randevu' olanları filtreliyoruz
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("type", "randevu")
        .order("created_at", { ascending: false });

      if (error) console.error("Veri hatası:", error);
      else setMessages(data || []);
    };
    fetchRandevular();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Randevu Talepleri ({messages.length})</h1>
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="p-6 bg-white border border-purple-200 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg">{m.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{m.phone} | {m.service}</p>
            <p className="text-gray-700 italic bg-purple-50 p-3 rounded">{m.message}</p>
            <div className="mt-2 text-xs text-gray-400">Yaş: {m.age} | Tip: {m.session_type}</div>
          </div>
        ))}
      </div>
    </div>
  );
}