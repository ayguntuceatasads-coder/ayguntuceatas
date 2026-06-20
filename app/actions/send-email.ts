"use server";

import nodemailer from "nodemailer";

// 1. İLETİŞİM VE RANDEVU FORMLARI İÇİN (Mevcut Olan)
export async function sendNotificationEmails(data: { 
  name: string; 
  email: string; 
  phone: string; 
  subject?: string; 
  message: string; 
  type: string 
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ayguntuceatasads@gmail.com",
        pass: "ihgi emxr jpzl brrh" 
      },
    });

    // Admibe (Sana) Gidecek Bildirim Maili
    await transporter.sendMail({
      from: '"Web Sitesi Bildirim" <ayguntuceatasads@gmail.com>',
      to: "ayguntuceatasads@gmail.com", 
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

    // Müşteriye Giden Otomatik Yanıt Maili
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


// 2. YENİ ÖN GÖRÜŞME FORMLARI İÇİN (Esnek JSONB Yapısı)
export async function sendIntakeFormEmail(data: {
  formTitle: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  formData: Record<string, any>;
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ayguntuceatasads@gmail.com",
        pass: "ihgi emxr jpzl brrh"
      },
    });

    // Form datasındaki tüm key-value çiftlerini şık bir HTML listesine çeviriyoruz
    const formFieldsHtml = Object.entries(data.formData)
      .map(([label, value]) => {
        if (!value || (Array.isArray(value) && value.length === 0)) return "";
        return `
          <div style="margin-bottom: 12px; padding-bottom: 8px; border-b: 1px solid #f0f0f0;">
            <strong style="color: #0f4c5c; display: block; font-size: 13px; text-transform: uppercase;">${label}</strong>
            <span style="color: #333; font-size: 15px;">${Array.isArray(value) ? value.join(", ") : value}</span>
          </div>
        `;
      })
      .join("");

    // Uzmana Giden Detaylı Bildirim
    await transporter.sendMail({
      from: '"Klinik Otomasyonu" <ayguntuceatasads@gmail.com>',
      to: "ayguntuceatasads@gmail.com",
      subject: `YENİ FORM: ${data.formTitle} - ${data.patientName}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto; border: 1px solid #eee; padding: 25px; border-radius: 15px;">
          <h2 style="color: #00878a; margin-top: 0;">Yeni ${data.formTitle} Dolduruldu</h2>
          <p><strong>Danışan:</strong> ${data.patientName}</p>
          <p><strong>Telefon:</strong> ${data.patientPhone}</p>
          <p><strong>E-posta:</strong> ${data.patientEmail || "Belirtilmemiş"}</p>
          <hr style="border: 0; border-top: 2px solid #00878a; margin: 20px 0;" />
          <h3 style="color: #0f4c5c;">Form Detayları:</h3>
          ${formFieldsHtml}
        </div>
      `,
    });

    // Danışana Giden Onay
    if (data.patientEmail) {
      await transporter.sendMail({
        from: '"Uzm. Psk. Aygün Tuce Ataş" <ayguntuceatasads@gmail.com>',
        to: data.patientEmail,
        subject: `${data.formTitle} Başarıyla Alındı`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #082b34;">Merhaba ${data.patientName},</h2>
            <p>Kliniğimize başvurunuz kapsamında doldurmuş olduğunuz <strong>${data.formTitle}</strong> sistemimize güvenli bir şekilde kaydedilmiştir.</p>
            <p>Paylaştığınız bilgiler gizlilik ilkelerimiz doğrultusunda tamamen saklı tutulacaktır. Seans planlamanız için en kısa sürede sizinle iletişime geçeceğiz.</p>
            <br/>
            <p>Sağlıklı günler dileriz.</p>
          </div>
        `
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Form mail hatası:", error);
    return { success: false, error };
  }
}