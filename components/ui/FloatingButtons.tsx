import { MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function FloatingButtons() {
  const supabase = await createClient();
  
  // Yalnızca yüzen butonlar için ayırdığımız sütunları çekiyoruz
  const { data: settings } = await supabase
    .from('site_settings')
    .select('floating_phone, floating_whatsapp, floating_whatsapp_text')
    .eq('id', 1)
    .maybeSingle();

  // Her ikisi de boşsa bileşeni hiç renderlama (ekranda gösterme)
  if (!settings || (!settings.floating_phone && !settings.floating_whatsapp)) {
    return null; 
  }

  // Boşlukları temizleyerek linkleri oluştur
  const telLink = settings.floating_phone ? `tel:${settings.floating_phone.replace(/\s+/g, '')}` : "#";
  
  // Mesaj metnini URL'e uygun hale getiriyoruz (encodeURIComponent)
  // Böylece boşluklar, Türkçe karakterler (%20 vs.) linki bozmaz.
  const waText = settings.floating_whatsapp_text 
    ? `&text=${encodeURIComponent(settings.floating_whatsapp_text)}` 
    : "";
  
  const waLink = settings.floating_whatsapp 
    ? `https://wa.me/${settings.floating_whatsapp.replace(/\s+/g, '')}?${waText}` 
    : "#";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
      
      {/* Özel Yüzen Telefon Numarası Varsa Göster */}
      {settings.floating_phone && (
        <a 
          href={telLink} 
          className="w-14 h-14 bg-[#5e338d] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:bg-[#3d215e] transition-all duration-300 group" 
          title="Hemen Ara"
        >
          <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </a>
      )}

      {/* Özel Yüzen WhatsApp Numarası Varsa Göster */}
      {settings.floating_whatsapp && (
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:bg-[#1ebe57] transition-all duration-300 group" 
          title="WhatsApp'tan Yazın"
        >
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </a>
      )}
      
    </div>
  );
}