import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import CookieBanner from "@/components/ui/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Uzm. Psk. Aygün Tuce Ataş",
    default: "Uzm. Psk. Aygün Tuce Ataş | Antalya Psikolojik Danışmanlık",
  },
  description: "Antalya Muratpaşa'da bilimsel temellere dayanan, güvenilir ve etik psikolojik danışmanlık hizmetleri.",
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
        
      </body>
    </html>
  );
}