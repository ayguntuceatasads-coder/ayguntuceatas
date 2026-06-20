"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Save, Loader2 } from "lucide-react";

export default function LegalDocsAdmin() {
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    const { data } = await supabase.from("legal_documents").select("*");
    if (data) setDocs(data);
  };

  const handleUpdate = async () => {
    setLoading(true);
    await supabase
      .from("legal_documents")
      .update({ content })
      .eq("id", selectedDoc.id);
    setLoading(false);
    alert("Güncellendi!");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Yasal Belgeler Yönetimi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol: Liste */}
        <div className="space-y-4">
          {docs.map((doc) => (
            <button 
              key={doc.id}
              onClick={() => { setSelectedDoc(doc); setContent(doc.content); }}
              className={`w-full p-4 rounded-xl border text-left ${selectedDoc?.id === doc.id ? 'bg-[#6ec9c9] text-white' : 'bg-white'}`}
            >
              {doc.title}
            </button>
          ))}
        </div>

        {/* Sağ: Editör */}
        <div className="md:col-span-2">
          {selectedDoc ? (
            <div className="bg-white p-6 rounded-2xl border">
              <h2 className="text-xl font-bold mb-4">{selectedDoc.title}</h2>
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 p-4 border rounded-xl"
              />
              <button 
                onClick={handleUpdate}
                className="mt-4 flex items-center gap-2 bg-[#082b34] text-white px-6 py-3 rounded-xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save />} Kaydet
              </button>
            </div>
          ) : (
            <p className="text-slate-400">Düzenlemek için bir belge seçin.</p>
          )}
        </div>
      </div>
    </div>
  );
}