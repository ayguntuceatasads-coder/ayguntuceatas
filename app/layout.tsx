import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Uzm. Psk. Aygün Tuce Ataş",
  description: "Antalya Psikolojik Danışmanlık Merkezi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      {/* Burada kesinlikle Navbar veya Footer olmayacak, onlar (frontend) layout'undan gelecek */}
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}