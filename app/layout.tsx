import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Temiz ve okunaklı bir font seçimi
const inter = Inter({ subsets: ["latin"] });

// Ana SEO Ayarları (Bütün sayfalarda varsayılan olarak bu görünecek)
export const metadata: Metadata = {
  title: {
    default: "Uzm. Psk. Aygün Tuce Ataş | Antalya Psikolog",
    template: "%s | Aygün Tuce Ataş" // Alt sayfalarda otomatik formatlama
  },
  description: "Antalya'da yetişkin, çocuk, ergen ve çift terapisi ile psikolojik test hizmetleri veren Uzman Psikolog Aygün Tuce Ataş'ın resmi web sitesidir.",
  keywords: ["antalya psikolog", "antalya çift terapisi", "antalya çocuk psikoloğu", "aygün tuce ataş"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900`}>
        <Navbar />
        {/* Main etiketi içeriğin ana kısmını sarar, SEO (Semantic HTML) için önemlidir */}
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}