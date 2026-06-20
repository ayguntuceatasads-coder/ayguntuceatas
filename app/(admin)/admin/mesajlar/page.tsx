"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase"; // Supabase client'ın buraya doğru import edildiğinden emin ol

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data) setMessages(data);
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      // Listeyi anında güncelle
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    }
  };

  if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gelen Mesajlar ({messages.filter(m => !m.is_read).length} okunmamış)</h1>
      
      <div className="space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-6 border rounded-xl shadow-sm transition-all ${msg.is_read ? "bg-slate-50 border-slate-200 opacity-70" : "bg-white border-blue-500 ring-2 ring-blue-500/10"}`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg">{msg.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-slate-200 rounded">{msg.type}</span>
                </div>
                <p className="text-sm text-slate-500 mb-2 font-mono">
                  {msg.email} | {msg.phone}
                </p>
                <div className="bg-slate-100 p-3 rounded-lg text-slate-800 text-sm italic">
                  "{msg.message}"
                </div>
              </div>
              
              {!msg.is_read && (
                <button 
                  onClick={() => markAsRead(msg.id)} 
                  className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors shrink-0"
                >
                  Okundu İşaretle
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}