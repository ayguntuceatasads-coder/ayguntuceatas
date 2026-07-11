"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Eye, X, Calendar, User, Phone, Mail, BarChart3, FileText } from "lucide-react";

export default function AdminSonuclarPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State'leri
  const [selectedResult, setSelectedResult] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchResults() {
      const { data, error } = await supabase
        .from("scale_results")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setResults(data);
      setLoading(false);
    }
    fetchResults();
  }, []);

  const openModal = (result: any) => {
    setSelectedResult(result);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResult(null);
    setIsModalOpen(false);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-[#00878a]" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 pb-24">
      <h1 className="text-2xl font-bold text-[#082b34] mb-8">Ölçek Sonuçları</h1>

      {/* Mobilde sağa kaydırmayı sağlayan overflow-x-auto eklendi */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4 font-bold">Tarih</th>
              <th className="px-6 py-4 font-bold">Danışan</th>
              <th className="px-6 py-4 font-bold">Ölçek</th>
              <th className="px-6 py-4 font-bold text-center">Toplam Puan</th>
              <th className="px-6 py-4 font-bold text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                  Henüz doldurulmuş bir ölçek bulunmuyor.
                </td>
              </tr>
            ) : (
              results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    {new Date(r.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#082b34]">{r.patient_name}</div>
                    <div className="text-xs text-slate-400">{r.patient_email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{r.scale_name}</td>
                  <td className="px-6 py-4 text-center font-bold text-[#00878a] text-lg">{r.score}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openModal(r)}
                      className="inline-flex items-center gap-2 bg-[#00878a]/10 text-[#00878a] px-4 py-2 rounded-lg font-bold hover:bg-[#00878a] hover:text-white transition-all"
                    >
                      <Eye className="w-4 h-4" /> Detaylar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAY MODALI */}
      {isModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
            
            {/* Modal Header */}
            <div className="bg-[#082b34] text-white p-6 flex justify-between items-center shrink-0">
              <h2 className="text-xl font-bold">{selectedResult.scale_name} Sonucu</h2>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-8 bg-slate-50">
              
              {/* Danışan Bilgileri */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><User className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Danışan Adı</p>
                    <p className="font-bold text-[#082b34]">{selectedResult.patient_name}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                  <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><Calendar className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Tarih</p>
                    <p className="font-bold text-[#082b34]">{new Date(selectedResult.created_at).toLocaleString('tr-TR')}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                  <div className="bg-green-50 p-3 rounded-lg text-green-600"><Phone className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Telefon</p>
                    <p className="font-bold text-[#082b34]">{selectedResult.patient_phone}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4 shadow-sm">
                  <div className="bg-orange-50 p-3 rounded-lg text-orange-600"><Mail className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">E-posta</p>
                    <p className="font-bold text-[#082b34]">{selectedResult.patient_email}</p>
                  </div>
                </div>
              </div>

              {/* Puan ve Yorumlar (Eğer varsa) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <h3 className="text-lg font-bold text-[#082b34] flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#00878a]" /> Puanlama ve Analiz</h3>
                  <div className="text-right">
                    <span className="text-sm text-slate-400 font-bold">TOPLAM PUAN</span>
                    <p className="text-3xl font-black text-[#00878a]">{selectedResult.score}</p>
                  </div>
                </div>

                {selectedResult.category_scores && Object.keys(selectedResult.category_scores).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedResult.category_scores).map(([cat, val]) => (
                      <div key={cat} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-[#082b34] text-sm">{cat}</span>
                          <span className="bg-[#00878a] text-white text-xs px-2 py-1 rounded font-bold">{String(val)} Puan</span>
                        </div>
                        {selectedResult.interpretations && selectedResult.interpretations[cat] && (
                          <p className="text-xs text-slate-500 italic mt-2 border-t border-slate-200 pt-2">"{selectedResult.interpretations[cat]}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Beck Depresyon gibi tekil genel yorumu olanlar için */}
                {selectedResult.interpretations && selectedResult.interpretations["Genel Değerlendirme"] && (
                  <div className="mt-4 bg-[#00878a]/10 border border-[#00878a]/20 p-4 rounded-lg">
                    <span className="text-xs font-bold text-[#00878a] uppercase">Uzman Yorumu / Sonuç</span>
                    <p className="font-bold text-[#082b34] mt-1">{selectedResult.interpretations["Genel Değerlendirme"]}</p>
                  </div>
                )}
              </div>

              {/* Danışanın Verdiği Tüm Yanıtlar */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-[#082b34] mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <FileText className="w-5 h-5 text-[#00878a]" /> Danışanın Verdiği Yanıtlar
                </h3>
                <div className="space-y-4">
                  {selectedResult.answers ? (
                    Object.entries(selectedResult.answers).map(([question, answer], index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <p className="text-sm font-bold text-slate-700 mb-2">{index + 1}. {question}</p>
                        <p className="text-[#00878a] font-medium bg-white px-3 py-2 rounded border border-slate-200 inline-block">{String(answer)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">Bu sonuç için detaylı yanıt bulunamadı.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}