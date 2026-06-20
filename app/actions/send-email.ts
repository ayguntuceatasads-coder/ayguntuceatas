"use server";

import nodemailer from "nodemailer";

export async function sendNotificationEmails(data: { 
  name: string; 
  email: string; 
  phone: string; 
  subject?: string; 
  message: string; 
  type: string 
}) {
  try {
    // Gmail SMTP Ayarları
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Vercel'deki mail adresi değişkenin
        pass: process.env.GMAIL_PASS, // Vercel'deki 16 haneli şifre değişkenin
      },
    });

    // 1. Sana Gelen Bildirim Maili
    await transporter.sendMail({
      from: `"Web Sitesi Bildirim" <${process.env.GMAIL_USER}>`,
      to: "ayguntuceatasads@gmail.com",
      subject: `YENİ ${data.type.toUpperCase()}: ${data.name}`,
      text: `Web sitenizden yeni bir ${data.type} talebi geldi.\n\nİsim: ${data.name}\nE-posta: ${data.email}\nTelefon: ${data.phone}\nDetay/Konu: ${data.subject || "-"}\nMesaj: ${data.message}`
    });

    // 2. Müşteriye Giden Otomatik Yanıt
    await transporter.sendMail({
      from: `"Uzm. Psk. Aygün Tuce Ataş" <${process.env.GMAIL_USER}>`,
      to: data.email,
      subject: "Talebiniz Bize Ulaştı | Uzm. Psk. Aygün Tuce Ataş",
      text: `Sayın ${data.name},\n\nWeb sitemiz üzerinden ilettiğiniz talebiniz tarafımıza ulaşmıştır. Uzmanımız en kısa sürede ${data.phone} numaralı telefonunuzdan sizinle iletişime geçecektir.\n\nSağlıklı günler dileriz.`
    });
    
    return { success: true };
  } catch (error) {
    console.error("Mail hatası:", error);
    return { success: false, error };
  }
}