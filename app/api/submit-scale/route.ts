import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { scale_id, scale_name, patient_name, patient_email, patient_phone, score, answers, send_email_to_patient } = data;

    // 1. Veritabanına Kaydet
    const { error: dbError } = await supabase.from("scale_results").insert({
      scale_id,
      scale_name,
      patient_name,
      patient_email,
      patient_phone,
      score,
      answers
    });

    if (dbError) throw new Error("Veritabanı kayıt hatası: " + dbError.message);

    // 2. Mail Gönderimi (Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ayguntuceatasads@gmail.com",
        pass: "ihgi emxr jpzl brrh" // 16 haneli uygulama şifresi
      },
    });

    // Uzmana (Sana) Gidecek Mail
    const adminMailOptions = {
      from: '"Klinik Otomasyonu" <ayguntuceatasads@gmail.com>',
      to: "ayguntuceatasads@gmail.com",
      subject: `Yeni Ölçek Dolduruldu: ${patient_name} - ${scale_name}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto;">
          <h2 style="color: #00878a;">Yeni Ölçek Sonucu: ${scale_name}</h2>
          <p><strong>Danışan:</strong> ${patient_name}</p>
          <p><strong>E-posta:</strong> ${patient_email}</p>
          <p><strong>Telefon:</strong> ${patient_phone}</p>
          <hr />
          <h3 style="color: #d9534f; font-size: 24px;">Toplam Puan: ${score}</h3>
          <hr />
          <h4>Verilen Yanıtlar:</h4>
          <ul>
            ${Object.entries(answers).map(([q, a]) => `<li style="margin-bottom: 10px;"><strong>${q}</strong> <br/> ${a}</li>`).join('')}
          </ul>
        </div>
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // Eğer adminden "Danışana mail gönder" seçildiyse hastaya da sonuç maili at
    if (send_email_to_patient) {
      const patientMailOptions = {
        from: '"Aygün Tuçe Ataş Önç" <ayguntuceatasads@gmail.com>',
        to: patient_email,
        subject: `${scale_name} Sonucunuz`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #082b34;">Merhaba ${patient_name},</h2>
            <p>Doldurmuş olduğunuz <strong>${scale_name}</strong> başarıyla sistemimize ulaşmıştır.</p>
            <p>Bu ölçek sonucundaki toplam puanınız: <strong style="font-size: 20px; color: #00878a;">${score}</strong></p>
            <p>Sonuçlarınız uzmanımız tarafından değerlendirilecektir. Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>
            <br/>
            <p>Sağlıklı günler dileriz.</p>
          </div>
        `
      };
      await transporter.sendMail(patientMailOptions);
    }

    return NextResponse.json({ success: true, message: "Kayıt başarılı." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}