"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Eye, X, User, Phone, Mail } from "lucide-react";

export default function ScaleResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tıklanan sonucun detaylarını tutacağımız state
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    async function fetchResults() {
      const { data } = await supabase.from("scale_results").select("*").order("created_at", { ascending: false });
      setResults(data || []);
      setLoading(false);
    }
    fetchResults();
  }, []);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00878a]" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20 relative">
      <h1 className="text-2xl font-bold text-[#082b34] mb-8">Doldurulan Ölçek Sonuçları</h1>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
            <tr>
              <th className="px-6 py-4">Danışan</th>
              <th className="px-6 py-4">İletişim</th>
              <th className="px-6 py-4">Doldurduğu Ölçek</th>
              <th className="px-6 py-4 text-center">Toplam Puan</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-slate-500">Henüz sonuç yok.</td></tr>}
            {results.map((res) => (
              <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#082b34]">{res.patient_name}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span>{res.patient_email}</span>
                    <span className="text-xs text-slate-400">{res.patient_phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="bg-[#00878a]/10 text-[#00878a] px-3 py-1 rounded-full font-medium">{res.scale_name}</span></td>
                <td className="px-6 py-4 text-center"><span className="text-xl font-bold text-[#082b34]">{res.score}</span></td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedResult(res)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-[#00878a] hover:text-white text-[#00878a] rounded-lg transition-colors font-bold text-xs"
                  >
                    <Eye className="w-4 h-4" /> Yanıtları Gör
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETAY MODALI (POPUP) */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Başlığı */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-[#082b34]">{selectedResult.scale_name} Sonucu</h2>
                <p className="text-sm text-slate-500 mt-1">Doldurulma: {new Date(selectedResult.created_at).toLocaleString('tr-TR')}</p>
              </div>
              <button onClick={() => setSelectedResult(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal İçeriği (Scroll edilebilir) */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Danışan Özet Kartı */}
              <div className="flex flex-wrap gap-4 mb-8 bg-[#082b34]/5 p-4 rounded-2xl border border-[#082b34]/10">
                <div className="flex items-center gap-2 text-sm text-[#082b34] bg-white px-3 py-2 rounded-lg shadow-sm">
                  <User className="w-4 h-4 text-[#00878a]" /> <span className="font-bold">{selectedResult.patient_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#082b34] bg-white px-3 py-2 rounded-lg shadow-sm">
                  <Mail className="w-4 h-4 text-[#00878a]" /> {selectedResult.patient_email}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#082b34] bg-white px-3 py-2 rounded-lg shadow-sm">
                  <Phone className="w-4 h-4 text-[#00878a]" /> {selectedResult.patient_phone}
                </div>
                <div className="ml-auto flex items-center gap-2 text-sm bg-[#00878a] text-white px-4 py-2 rounded-lg shadow-sm font-bold">
                  Toplam Puan: <span className="text-xl">{selectedResult.score}</span>
                </div>
              </div>

              <h3 className="font-bold text-lg text-[#082b34] mb-4 border-b border-slate-100 pb-2">Verilen Yanıtlar</h3>
              
              <div className="space-y-4">
                {selectedResult.answers && Object.entries(selectedResult.answers).map(([question, answer], index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-slate-700 mb-2 leading-relaxed">{index + 1}. {question}</p>
                    <p className="text-base font-bold text-[#00878a] bg-white inline-block px-3 py-1 rounded border border-slate-200">
                      {String(answer) || "Cevapsız"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}