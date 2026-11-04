"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { sendNotificationEmails } from "@/app/actions/send-email";
import { Send, Loader2, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  // SPAM KORUMASI 1: Honeypot (Gizli alan) ve Süre Kontrolü
  const [honeypot, setHoneypot] = useState("");
  const [mountTime, setMountTime] = useState<number>(0);

  // SPAM KORUMASI 2: Basit Güvenlik Sorusu
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(4);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  useEffect(() => {
    setMountTime(Date.now());
    setNum1(Math.floor(Math.random() * 5) + 1);
    setNum2(Math.floor(Math.random() * 5) + 1);
  }, []);

  const isSpamContent = (text: string) => {
    const lower = text.toLowerCase();
    const spamPatterns = [
      "http://", "https://", "www.", ".ru", ".xyz", "bit.ly",
      "crypto", "bitcoin", "casino", "betting", "seo ", "backlink",
      "viagra", "cialis", "telegram", "investment", "forex", "loan"
    ];
    // Kiril alfabesi kontrolü (Rusça spam botları için)
    const hasCyrillic = /[а-яА-ЯЁё]/.test(text);
    return hasCyrillic || spamPatterns.some((pattern) => lower.includes(pattern));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // 1. Honeypot Kontrolü (Bot gizli alanı doldurduysa sessizce başarılı gibi göster ama gönderme)
    if (honeypot.trim() !== "") {
      setStatus({ type: "success", message: "Mesajınız başarıyla iletildi!" });
      return;
    }

    // 2. Hız Kontrolü (4 saniyeden kısa sürede doldurulduysa bottur)
    if (Date.now() - mountTime < 4000) {
      setStatus({ type: "error", message: "Çok hızlı işlem yaptınız. Lütfen birkaç saniye bekleyip tekrar deneyin." });
      return;
    }

    // 3. Güvenlik Sorusu Kontrolü
    if (parseInt(captchaAnswer, 10) !== num1 + num2) {
      setStatus({ type: "error", message: "Güvenlik sorusunun cevabı hatalı. Lütfen kontrol edin." });
      return;
    }

    // 4. Telefon Numarası Kontrolü (En az 10 rakam olmalı)
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setStatus({ type: "error", message: "Lütfen geçerli bir telefon numarası giriniz." });
      return;
    }

    // 5. İçerik / Link / Spam Kelime Kontrolü
    if (isSpamContent(form.message) || isSpamContent(form.subject) || isSpamContent(form.name)) {
      setStatus({ type: "error", message: "Mesajınızda güvenlik filtresine takılan ifadeler veya linkler bulundu." });
      return;
    }

    setSending(true);

    const { error } = await supabase.from("messages").insert({
      type: "iletisim",
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      is_read: false
    });

    if (error) {
      setStatus({ type: "error", message: "Mesajınız gönderilemedi: " + error.message });
    } else {
      await sendNotificationEmails({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        type: "İletişim Mesajı"
      });
      
      setStatus({ type: "success", message: "Mesajınız başarıyla iletildi! En kısa sürede dönüş sağlanacaktır." });
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setCaptchaAnswer("");
      setNum1(Math.floor(Math.random() * 5) + 1);
      setNum2(Math.floor(Math.random() * 5) + 1);
    }
    setSending(false);
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

      {/* GİZLİ HONEYPOT ALANI (Kullanıcılar görmez, botlar doldurur) */}
      <div className="hidden" aria-hidden="true">
        <label>Website</label>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

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
          <input required type="text" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm" placeholder="Örn: Randevu ve Bilgi" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#a8cfcf] uppercase tracking-wider mb-1.5">Mesajınız *</label>
        <textarea required rows={4} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#6ec9c9] transition-all text-sm resize-none" placeholder="Mesajınız..." />
      </div>

      {/* Güvenlik Sorusu (Spam Bot Engelleyici) */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between gap-4">
        <label className="text-xs font-bold text-[#a8cfcf] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#6ec9c9]" />
          Güvenlik Doğrulaması: <span className="text-white text-sm">{num1} + {num2} = ?</span>
        </label>
        <input
          required
          type="number"
          value={captchaAnswer}
          onChange={(e) => setCaptchaAnswer(e.target.value)}
          className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-white text-center font-bold outline-none focus:border-[#6ec9c9] text-sm"
          placeholder="Cevap"
        />
      </div>

      <button disabled={sending} type="submit" className="w-full bg-[#00878a] hover:bg-[#6ec9c9] hover:text-[#082b34] disabled:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg">
        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />} Mesajı Gönder
      </button>
    </form>
  );
}