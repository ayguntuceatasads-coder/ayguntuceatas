"use client";

import { useState } from "react";
import { Link, Check } from "lucide-react";

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}/${slug}`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Kopyalama başarısız:", err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`p-2 rounded-xl border transition-all ${
        copied 
          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
          : "bg-slate-800 border-slate-700 text-[#6ec9c9] hover:bg-slate-700 hover:text-white"
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
    </button>
  );
}