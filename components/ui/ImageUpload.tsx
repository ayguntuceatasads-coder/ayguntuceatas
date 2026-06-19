"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, Loader2, X } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `site-images/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
      onChange(data.publicUrl);
    } catch (error) {
      alert("Resim yüklenirken hata oluştu.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative w-full max-w-md rounded-xl overflow-hidden border border-slate-200">
          <img src={value} alt="Yüklenen Görsel" className="w-full h-auto object-cover max-h-60" />
          <button type="button" onClick={() => onChange("")} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-[#6ec9c9] transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? <Loader2 className="w-8 h-8 text-[#00878a] animate-spin mb-2" /> : <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />}
            <p className="text-sm text-slate-500 font-semibold">{uploading ? "Yükleniyor..." : "Resim seçmek için tıklayın"}</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={uploadImage} disabled={uploading} />
        </label>
      )}
      {/* Gizli input, form action'a veriyi gönderebilmek için */}
      <input type="hidden" name="image_url" value={value} />
    </div>
  );
}