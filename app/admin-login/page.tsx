"use client";

import { useState } from "react";
import { Lock, Mail, Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Çerezlerin hatasız işlenmesi için kendi sunucumuza (API) istek atıyoruz
      const response = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Giriş başarısız.");
        setLoading(false);
      } else {
        // Çerezler başarıyla oturdu, paneli zorla yükle
        window.location.href = "/admin"; 
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061d24] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#00878a] rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#0f4c5c] rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>

      <div className="w-full max-w-md bg-[#082b34]/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#00878a]/10 text-[#00878a] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-[#00878a]/20">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">Yönetim Paneli</h1>
          <p className="text-slate-400 text-sm mt-2">Sisteme erişmek için kimliğinizi doğrulayın.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm font-medium mb-6 text-center animate-in fade-in zoom-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">E-posta Adresi</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#061d24] border border-slate-700 rounded-xl text-white outline-none focus:border-[#00878a] transition-colors" placeholder="ornek@mail.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Şifre</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-[#061d24] border border-slate-700 rounded-xl text-white outline-none focus:border-[#00878a] transition-colors" placeholder="••••••••" />
            </div>
          </div>
          <button disabled={loading} type="submit" className="w-full bg-[#00878a] text-white py-4 rounded-xl font-bold hover:bg-[#082b34] border border-transparent hover:border-[#00878a] transition-all flex justify-center items-center gap-2 mt-4 shadow-lg shadow-[#00878a]/20">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Güvenli Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}