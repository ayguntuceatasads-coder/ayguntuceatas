"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, ShieldAlert, Trash2, Plus, UserPlus } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("admin_roles").select("*").order("created_at", { ascending: true });
    setUsers(data || []);
    setLoading(false);
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    const response = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      setEmail("");
      setPassword("");
      fetchUsers();
    } else {
      alert("Hata: " + data.error);
    }
    setCreating(false);
  };

  const handleDelete = async (emailToDelete: string) => {
    if (!window.confirm(`${emailToDelete} kullanıcısının admin yetkisini iptal etmek istediğinize emin misiniz?`)) return;

    const response = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailToDelete })
    });

    const data = await response.json();
    if (data.success) fetchUsers();
    else alert("Hata: " + data.error);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00878a]" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-[#082b34] mb-8">Yönetici Hesapları</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Kullanıcı Listesi */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-fit">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">E-posta Adresi</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#082b34]">{user.email}</td>
                  <td className="px-6 py-4">
                    {user.role === 'superadmin' ? (
                      <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 w-fit"><ShieldAlert className="w-3 h-3"/> Kurucu</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-xs">Admin</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.role === 'superadmin' ? (
                      <span className="text-xs text-slate-400 font-medium">Silinemez</span>
                    ) : (
                      <button onClick={() => handleDelete(user.email)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Yetkiyi Kaldır">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Yeni Yönetici Ekleme Formu */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <div className="w-10 h-10 bg-[#00878a]/10 text-[#00878a] rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-[#082b34] text-lg">Yeni Admin Ekle</h2>
          </div>
          
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">E-posta</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" placeholder="yeniadmin@mail.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Giriş Şifresi</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg outline-none focus:border-[#00878a]" placeholder="Min. 6 karakter" minLength={6} />
            </div>
            <button disabled={creating} type="submit" className="w-full bg-[#082b34] text-white py-4 rounded-xl font-bold hover:bg-[#00878a] transition-all flex justify-center items-center gap-2 mt-2">
              {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Hesabı Oluştur</>}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}