import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import CookieBanner from "@/components/ui/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";

// Google Analytics bileşenini import ediyoruz
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Uzm. Psk. Aygün Tuce Ataş",
    default: "Uzm. Psk. Aygün Tuce Ataş | Antalya Psikolojik Danışmanlık",
  },
  description: "Antalya Muratpaşa'da bilimsel temellere dayanan, güvenilir ve etik psikolojik danışmanlık hizmetleri.",
  
  // SEARCH CONSOLE DOĞRULAMA KODU (Buraya eklenir)
  verification: {
    google: "t7JQ3HhDdPvT5mN6mW_4ZkWRH76QcKT1", 
    // Örn: "dBdfX_be762837468234768234"
  },
};

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900`}>
        
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
        
        {/* GOOGLE ANALYTICS KODU (G-XXXXXX formatındaki kimliği buraya yazın) */}
        <GoogleAnalytics gaId="G-ÖLÇÜM_KİMLİĞİNİZ" />
        
      </body>
    </html>
  );
}