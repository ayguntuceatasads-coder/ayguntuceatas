import { createClient } from "@/lib/supabase/server";
// DİKKAT: Instagram ikonu buradan silindi, çökmeye sebep olan buydu!
import { MapPin, Phone, Mail } from "lucide-react"; 
import PageHero from "@/components/ui/PageHero";
import ContactForm from "@/components/ui/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim ve Adres Bilgileri | Uzm. Psk. Aygün Tuce Ataş",
  description: "Antalya Muratpaşa'daki kliniğimizin açık adres tarifi, harita konumu, telefon, WhatsApp ve e-posta iletişim bilgileri.",
};

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();

  const phoneLink = settings?.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : "#";
  const waLink = settings?.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\s+/g, '')}` : "#";

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-32">
      <PageHero 
        title="İletişim & Ulaşım" 
        breadcrumbs={[{ label: "İletişim" }]} 
        bgImage="https://images.unsplash.com/photo-1423662055905-359a2a1db79a?q=80&w=2070&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sol Sütun: İletişim Kartları */}
          <div className="lg:col-span-5 space-y-6">
            <div className="mb-10">
              <span className="text-[#00878a] font-bold text-sm tracking-widest uppercase mb-3 block">BİZE ULAŞIN</span>
              <h2 className="text-3xl font-bold text-[#082b34] mb-4">Merkezimize Hoş Geldiniz</h2>
              <p className="text-slate-600 leading-relaxed">
                Randevu almak, hizmetlerimiz hakkında bilgi edinmek veya aklınızdaki soruları sormak için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl flex gap-6 hover:border-[#00878a] hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#00878a]/10 text-[#00878a] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00878a] group-hover:text-white transition-colors">
                <MapPin className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#082b34] mb-2">Klinik Adresi</h3>
                <p className="text-slate-500 leading-relaxed">{settings?.address || "Bilgi Girilmemiş"}</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 p-8 rounded-3xl flex gap-6 hover:border-[#00878a] hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#00878a]/10 text-[#00878a] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00878a] group-hover:text-white transition-colors">
                <Phone className="w-6 h-6"/>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-[#082b34] mb-1">Telefon & WhatsApp</h3>
                <a href={phoneLink} className="text-slate-600 hover:text-[#00878a] font-medium transition-colors">Tel: {settings?.phone || "-"}</a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#25D366] font-medium transition-colors">WhatsApp: {settings?.whatsapp || "-"}</a>
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl flex gap-6 hover:border-[#00878a] hover:shadow-lg transition-all group">
              <div className="w-14 h-14 bg-[#00878a]/10 text-[#00878a] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#00878a] group-hover:text-white transition-colors">
                <Mail className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#082b34] mb-2">E-posta Adresi</h3>
                <a href={`mailto:${settings?.email}`} className="text-slate-600 hover:text-[#00878a] font-medium transition-colors">{settings?.email || "-"}</a>
              </div>
            </div>
          </div>

          {/* Sağ Sütun: Harita ve Canlı Form */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-white p-4 border border-slate-200 rounded-3xl shadow-sm h-[350px]">
              {settings?.map_embed ? (
                <div className="w-full h-full rounded-2xl overflow-hidden [&_iframe]:w-full [&_iframe]:h-full" dangerouslySetInnerHTML={{ __html: settings.map_embed }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 italic">Harita kodu eksik.</div>
              )}
            </div>

            {/* Gerçek İletişim Formu Kutusu */}
            <div className="bg-[#082b34] rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#6ec9c9]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Bize Mesaj Gönderin</h3>
              <p className="text-[#a8cfcf] mb-8 text-sm relative z-10">Sorularınızı aşağıdaki formu doldurarak doğrudan klinik yönetim paneline ulaştırabilirsiniz.</p>
              
              {/* Form Bileşenini Burada Çağırıyoruz */}
              <div className="relative z-10">
                <ContactForm />
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}