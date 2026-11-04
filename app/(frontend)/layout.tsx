import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButtons from "@/components/ui/FloatingButtons";
import CookieBanner from "@/components/ui/CookieBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { createClient } from "@/lib/supabase/server";

const inter = Inter({ subsets: ["latin"] });

// Önbelleği 60 saniyede bir yenile (Admin panel değişiklikleri yansısın)
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = "Uzman Klinik Psikolog Aygün Tuçe Ataş Önç | Antalya & Online Terapi";
  const defaultDesc = "Antalya Muratpaşa profesyonel psikolojik danışmanlık ve online terapi hizmetleri.";

  try {
    const supabase = await createClient();
    const { data: settings } = await supabase
      .from("site_settings")
      .select("site_title, site_description")
      .eq("id", 1)
      .maybeSingle();

    const siteTitle = settings?.site_title || defaultTitle;
    const siteDesc = settings?.site_description || defaultDesc;

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
      <GoogleTagManager gtmId="GTM-MMDVNZMS" />
      
      <body 
        suppressHydrationWarning={true} 
        className={`${inter.className} min-h-screen flex flex-col bg-white text-slate-900`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <CookieBanner />
        <ScrollToTop />
        <GoogleAnalytics gaId="G-BTZ0N13532" />
      </body>
    </html>
  );
}