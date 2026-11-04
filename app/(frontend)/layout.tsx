import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import CookieBanner from "@/components/ui/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { supabase } from "@/lib/supabase";

const inter = Inter({ subsets: ["latin"] });

// Veritabanından dinamik başlık çekme + Tam Unvan Varsayılanı
export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "Uzman Klinik Psikolog Aygün Tuçe Ataş Önç | Antalya & Online Terapi";
  const defaultDesc = "Antalya Muratpaşa'da ve online terapi ile bilimsel temellere dayanan, güvenilir ve etik psikolojik danışmanlık hizmetleri.";

  try {
    const { data } = await supabase.from("settings").select("*").single();
    const siteTitle = data?.site_title || data?.title || defaultTitle;
    const siteDesc = data?.site_description || data?.description || defaultDesc;

    return {
      title: {
        template: `%s | Uzman Klinik Psikolog Aygün Tuçe Ataş Önç`,
        default: siteTitle,
      },
      description: siteDesc,
    };
  } catch {
    return {
      title: {
        template: "%s | Uzman Klinik Psikolog Aygün Tuçe Ataş Önç",
        default: defaultTitle,
      },
      description: defaultDesc,
    };
  }
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth" suppressHydrationWarning>
      {/* Google Tag Manager Entegrasyonu */}
      <GoogleTagManager gtmId="GTM-MMDVNZMS" />
      
      <body 
        suppressHydrationWarning={true} 
        className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900`}
      >
        {/* Üst Menü */}
        <Navbar />
        
        {/* Dinamik Sayfa İçeriği */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Alt Bilgi */}
        <Footer />
        
        {/* Sabit Yüzen Butonlar (WhatsApp & Telefon) */}
        <FloatingButtons />
        
        {/* Çerez ve Kaydırma Kontrolleri */}
        <CookieBanner />
        <ScrollToTop />
        
        {/* Google Analytics 4 Entegrasyonu */}
        <GoogleAnalytics gaId="G-BTZ0N13532" />
      </body>
    </html>
  );
}