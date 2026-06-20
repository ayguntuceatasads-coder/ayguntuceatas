"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setServices(data || []);
    }
    setLoading(false);
  }

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Bu hizmeti silmek istediğinize emin misiniz?");
    if (!confirm) return;

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      alert("Silinirken hata oluştu: " + error.message);
    } else {
      fetchServices(); // Listeyi tazele
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#082b34]">Hizmetler Yönetimi</h1>
        <Link href="/admin/hizmetler/yeni" className="bg-[#00878a] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
          <Plus className="w-5 h-5" /> Yeni Hizmet Ekle
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.length === 0 ? (
          <p className="col-span-full text-center text-slate-500 py-10">Henüz hiç hizmet eklenmemiş.</p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                {service.image_url && (
                  <img src={service.image_url} alt={service.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h3 className="font-bold text-[#082b34] mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{service.description}</p>
              </div>
              
              {/* Butonlar: Düzenle (Kalem) ve Sil (Çöp Kutusu) */}
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-auto">
                <Link href={`/admin/hizmetler/duzenle/${service.id}`} className="p-2 text-[#00878a] hover:bg-slate-100 rounded-lg transition-colors">
                  <Edit className="w-5 h-5" />
                </Link>
                <button onClick={() => handleDelete(service.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}