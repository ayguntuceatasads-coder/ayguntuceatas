"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    const { error } = await supabase.from("messages").insert({
      type: "iletisim",
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
      is_read: false
    });

    setSending(false);

    if (error) {
      setStatus({ type: "error", message: "Mesajınız gönderilemedi: " + error.message });
    } else {
      setStatus({ type: "success", message: "Mesajınız başarıyla iletildi!" });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="space-y-5 text-left">
      {status && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-semibold ${
          status.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
          {status.type === "success" ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#a8cfcf] uppercase tracking-wider mb-1.5">Adınız Soyadınız *</label>
          <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Ahmet Yılmaz" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#a8cfcf] uppercase tracking-wider mb-1.5">Telefon Numaranız *</label>
          <input required type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="0507..." />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-[#a8cfcf] uppercase tracking-wider mb-1.5">E-posta Adresiniz</label>
          <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="example@mail.com" />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#a8cfcf] uppercase tracking-wider mb-1.5">Konu *</label>
          <input required type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Örn: Seans Ücretleri" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#a8cfcf] uppercase tracking-wider mb-1.5">Mesajınız *</label>
        <textarea required rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="Mesajınız..." />
      </div>

      <button disabled={sending} type="submit" className="w-full bg-[#00878a] hover:bg-[#6ec9c9] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg">
        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />} Mesajı Gönder
      </button>
    </form>
  );
}