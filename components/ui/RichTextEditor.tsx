"use client";

import { useState, useRef, useEffect } from "react";
import { Bold, Italic, Underline, Code, List, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function RichTextEditor({ name, defaultValue = "", placeholder }: RichTextEditorProps) {
  const [isCodeView, setIsCodeView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(defaultValue);
  const editorRef = useRef<HTMLDivElement>(null);

  // Dışarıdan gelen veriyi editöre set et
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== htmlContent) {
      editorRef.current.innerHTML = htmlContent;
    }
  }, []);

  const executeCommand = (command: string, value: string = "") => {
    if (isCodeView) return;
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) setHtmlContent(editorRef.current.innerHTML);
  };

  return (
    <div className="w-full border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:border-[#00878a] focus-within:ring-2 focus-within:ring-[#00878a]/20 transition-all">
      
      {/* Araç Çubuğu (Toolbar) */}
      <div className="flex items-center gap-2 p-2 border-b border-slate-200 bg-slate-50 flex-wrap">
        <button type="button" onClick={() => executeCommand("bold")} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="Kalın"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => executeCommand("italic")} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="İtalik"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => executeCommand("underline")} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="Altı Çizili"><Underline className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-slate-300 mx-1"></div>
        <button type="button" onClick={() => executeCommand("formatBlock", "H2")} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="Başlık 2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => executeCommand("insertUnorderedList")} className="p-2 hover:bg-slate-200 rounded text-slate-700 transition-colors" title="Madde İşaretleri"><List className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-slate-300 mx-1"></div>
        
        {/* Renk Seçici */}
        <div className="flex items-center gap-1 px-2">
          <input type="color" onChange={(e) => executeCommand("foreColor", e.target.value)} className="w-6 h-6 p-0 border-0 cursor-pointer" title="Yazı Rengi" />
        </div>

        {/* Kod Görünümü Butonu */}
        <button type="button" onClick={() => setIsCodeView(!isCodeView)} className={`ml-auto p-2 rounded transition-colors text-sm font-bold flex items-center gap-1 ${isCodeView ? 'bg-[#00878a] text-white' : 'hover:bg-slate-200 text-slate-700'}`}>
          <Code className="w-4 h-4" /> {isCodeView ? "Görsele Dön" : "HTML Kodu"}
        </button>
      </div>

      {/* Yazı Alanı */}
      <div className="relative w-full min-h-[300px]">
        {isCodeView ? (
          <textarea
            className="w-full h-full min-h-[300px] p-4 bg-slate-900 text-green-400 font-mono text-sm outline-none resize-y"
            value={htmlContent}
            onChange={(e) => {
              setHtmlContent(e.target.value);
              if (editorRef.current) editorRef.current.innerHTML = e.target.value;
            }}
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={updateContent}
            onBlur={updateContent}
            className="w-full min-h-[300px] p-5 outline-none prose prose-slate max-w-none prose-headings:text-[#082b34]"
            style={{ minHeight: '300px' }}
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Form gönderimi için gizli input */}
      <input type="hidden" name={name} value={htmlContent} />
    </div>
  );
}