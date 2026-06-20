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
    // Tıpkı ölçeklerde çalıştığı gibi sabit şifreli Nodemailer bağlantısı
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ayguntuceatasads@gmail.com",
        pass: "ihgi emxr jpzl brrh" // 16 haneli uygulama şifresi
      },
    });

    // 1. Admibe (Sana) Gidecek Bildirim Maili
    await transporter.sendMail({
      from: '"Web Sitesi Bildirim" <ayguntuceatasads@gmail.com>',
      to: "ayguntuceatasads@gmail.com", // Kendi mailin
      subject: `YENİ TALEBİ: ${data.name} - ${data.type}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto;">
          <h2 style="color: #00878a;">Yeni ${data.type} Geldi</h2>
          <p><strong>İsim:</strong> ${data.name}</p>
          <p><strong>E-posta:</strong> ${data.email}</p>
          <p><strong>Telefon:</strong> ${data.phone}</p>
          <p><strong>Konu/Hizmet:</strong> ${data.subject || "Belirtilmemiş"}</p>
          <hr />
          <h4>Mesaj/Not İçeriği:</h4>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${data.message || "Ek not bırakılmamış."}</p>
        </div>
      `
    });

    // 2. Müşteriye Giden Otomatik Yanıt Maili
    if (data.email) {
      await transporter.sendMail({
        from: '"Uzm. Psk. Aygün Tuce Ataş" <ayguntuceatasads@gmail.com>',
        to: data.email,
        subject: "Talebiniz Bize Ulaştı | Uzm. Psk. Aygün Tuce Ataş",
        html: `
          <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #082b34;">Merhaba ${data.name},</h2>
            <p>Web sitemiz üzerinden ilettiğiniz <strong>${data.type}</strong> tarafımıza başarıyla ulaşmıştır.</p>
            <p>Uzmanımız veya asistanlarımız en kısa sürede <strong>${data.phone}</strong> numaralı telefonunuzdan sizinle iletişime geçecektir.</p>
            <br/>
            <p>Sağlıklı günler dileriz.</p>
          </div>
        `
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Mail hatası:", error);
    return { success: false, error };
  }
}