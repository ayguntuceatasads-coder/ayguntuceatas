"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmails(data: { 
  name: string; 
  email: string; 
  phone: string; 
  subject?: string; 
  message: string; 
  type: string 
}) {
  try {
    // 1. Sana Gelen Bildirim Maili
    await resend.emails.send({
      from: "onboarding@resend.dev", // Kendi domainini bağlayınca bilgi@... yapabilirsin
      to: "ayguntuceatasads@gmail.com", // BURAYA KENDİ MAİLİNİ YAZ
      subject: `YENİ ${data.type.toUpperCase()}: ${data.name}`,
      text: `Web sitenizden yeni bir ${data.type} geldi.\n\nİsim: ${data.name}\nE-posta: ${data.email}\nTelefon: ${data.phone}\nDetay: ${data.subject || "-"}\nMesaj: ${data.message}`
    });

    // 2. Müşteriye Giden Otomatik Yanıt
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: data.email,
      subject: "Talebiniz Bize Ulaştı",
      text: `Sayın ${data.name},\n\nWeb sitemiz üzerinden ilettiğiniz talebiniz tarafımıza ulaşmıştır. Uzmanımız en kısa sürede ${data.phone} numaralı telefonunuzdan sizinle iletişime geçecektir.\n\nSağlıklı günler dileriz.`
    });
    
    return { success: true };
  } catch (error) {
    console.error("Mail hatası:", error);
    return { success: false, error };
  }
}