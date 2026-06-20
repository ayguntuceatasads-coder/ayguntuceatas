"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmails(data: { 
  name: string; 
  email: string; 
  phone: string; 
  subject: string; 
  message: string; 
  type: string 
}) {
  try {
    // 1. Admin Maili (Sana Gelen Bildirim)
    await resend.emails.send({
      from: "onboarding@resend.dev", // Kendi domainini bağlayana kadar bu varsayılanı kullan
      to: "ayguntuceatasads@gmail.com", // Kendi mailini yaz
      subject: `Yeni ${data.type} Talebi: ${data.name}`,
      text: `Yeni bir ${data.type} mesajı var.\n\nİsim: ${data.name}\nEmail: ${data.email}\nTelefon: ${data.phone}\nKonu: ${data.subject}\nMesaj: ${data.message}`
    });

    // 2. Müşteri Onay Maili (Ona Giden Otomatik Yanıt)
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: data.email,
      subject: "Mesajınız Bize Ulaştı",
      text: `Sayın ${data.name},\n\nMesajınız tarafımıza ulaştı. Uzmanımız en kısa sürede sizinle iletişime geçecektir.\n\nSaygılarımızla.`
    });
    
    return { success: true };
  } catch (error) {
    console.error("Mail gönderme hatası:", error);
    return { success: false, error };
  }
}