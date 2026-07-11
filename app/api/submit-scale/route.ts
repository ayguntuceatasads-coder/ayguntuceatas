import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { scale_id, scale_name, patient_name, patient_email, patient_phone, score, category_scores, answers, send_email_to_patient } = data;

    // --- OTOMATİK YORUMLAMA (INTERPRETATION) MOTORU ---
    let interpretations: Record<string, string> = {};
    const lowerScaleName = scale_name.toLocaleLowerCase('tr-TR');
    
    const isBeckDepresyon = lowerScaleName.includes("beck depresyon");
    const isBeckAnksiyete = lowerScaleName.includes("beck anksiyete");

    // Sınav Kaygısı Yorumları
    if (lowerScaleName.includes("sınav kaygısı") && category_scores) {
      const getYorum = (cat: string, s: number) => {
        switch (cat) {
          case "Başkalarının görüşü": return s >= 4 ? "Başkalarının sizi nasıl gördüğü sizin için büyük önem taşıyor. Çevrenizdeki insanların değerlendirmeleri bir sınav durumunda zihinsel faaliyetinizi olumsuz etkiliyor ve sınav başarınızı tehlikeye atıyor." : "Başkalarının sizinle ilgili görüşleri sizin için fazla önem taşımıyor. Bu sebeple sınavlara hazırlanırken çevrenizdeki insanların sizinle ilgili ne düşündükleri üzerinde kafa yorup zaman ve enerji kaybetmiyorsunuz.";
          case "Kendi görüşünüz": return s >= 4 ? "Sınavlardaki başarınızla kendinize olan saygınızı eşdeğer görüyorsunuz. Sınavlarda ölçülerin kişilik değeriniz olmayıp bilgi düzeyiniz olduğunu kabullenmeniz gerekir. Düşünce biçiminiz problemleri çözmek konusunda size yardımcı olmadığı gibi, endişelerinizi artırıp elinizi kolunuzu bağlıyor." : "Sınavlardaki başarınızla kendi kişiliğinize verdiğiniz değeri birbirinden oldukça iyi ayırabildiğiniz anlaşılmaktadır. Bu tutumunuz problemleri daha etkili biçimde çözmenize imkan vermekte, okul başarınızı olumlu yönde etkilemektedir.";
          case "Gelecekle ilgili endişeler": return s >= 3 ? "Sınavlardaki başarınızı gelecekteki mutluluğunuz ve başarınızın tek ölçüsü olarak görüyorsunuz. Bu yaklaşım biçiminin sonucu olarak sınavların güvenliğiniz ve amaçlarınıza ulaşmanız konusunda engel olduğunu düşünüyorsunuz. Bu düşünceler bilginizi yeterince ortaya koymanızı güçleştiriyor ve başarınızı tehdit ediyor." : "Gelecekteki mutluluğunuzun, başarınızın ve güvenliğinizin tek belirleyicisinin sınavlardaki başarınız olmadığının farkındasınız. Bu sebeple sınavlara geçilmesi gereken aşamalar olarak bakmanız, bilginizi yeterince ortaya koymanıza imkan veriyor.";
          case "Hazırlanmakla ilgili endişeler": return s >= 3 ? "Sınavları kişiliğiniz konusundaki değeriniz ve gelecekteki güvenliğinizin bir ölçüsü olarak gördüğünüz için herhangi bir sınava hazırlık dönemi sizin için bir kriz dönemi oluyor. Sınavda başarılı olmanızı sağlayacak olan hazırlanma tekniklerinizi öğrenirseniz, kendinize güveniniz artacak, endişelerinizi kontrol etmek için önemli bir adım atmış olacaksınız." : "Bir sınava verdiğiniz önem, o sınavın kendi değerinden büyük olmadığı için, sınavlara büyük bir gerginlik hissetmeden hazırlanıyorsunuz. Sınavda başarılı olabilmek için, sınav hazırlama sistemini bilmeniz, gereksiz gerginlikleri yaşamanıza ve sınava huzurlu bir şekilde çalışarak başarınızın yükselmesine imkan veriyor.";
          case "Bedensel tepkiler": return s >= 4 ? "Bir sınava hazırlanırken iştahsızlık, uykusuzluk, gerginlik gibi birçok bedensel rahatsızlıkla mücadele etmek zorunda kaldığınız anlaşılmaktadır. Bu rahatsızlıklar sınavla ilgili hazırlığınızı güçleştirmekte ve başarınızı olumsuz yönde etkilemektedir. Bedensel tepkilerinizi kontrol etmeyi başarmanız zihinsel olarak hem hazırlığınızı, hem de sınavda bildiklerinizi ortaya koymanızı kolaylaştıracaktır." : "Sınava hazırlık sırasında heyecanınızı kontrol edebildiğiniz bedensel olarak çalışmanızı zorlaştıracak bir rahatsızlık hissetmediğiniz anlaşılmaktadır.";
          case "Zihinsel tepkiler": return s >= 4 ? "Sınava hazırlanırken veya sınav arasında çevrenizde olan bitenden fazlasıyla etkilenmeniz ve dikkatinizi toplamakta güçlük çektiğiniz yüksek sınav kaygısının işaretidir. Bu durum düşünce akışını yavaşlatır ve başarıyı engeller. Zihinsel ve bedensel rahatsızlığınız birbirini körükler ve sınava hazırlığınızı zorlaştırır. Sınavlarda başarılı olabilmek için zihinsel tepkinizi kontrol altına almayı öğrenmeniz gerekmektedir." : "Zihinsel açıdan sınava hazırlanırken veya sınav sırasında önemli bir rahatsızlık yaşamadığınız görülmektedir. Heyecanınızı kontrol etmeniz, zihinsel ve duygusal olarak hazırlığınızı kolaylaştırmakta ve başarınızı artırmaktadır.";
          case "Genel sınav kaygısı": return s >= 3 ? "Sınavlarda kendinize güvenmediğiniz, sınavları varlığınız ve geleceğiniz için bir tehdit olarak gördüğünüz anlaşılmaktadır. Sınavlara sahip oldukları önemin çok üzerinde değer vermekte ve belki de bu sebeple çok fazla heyecanlanmaktasınız. Sınav kaygınızı azaltacak teknikleri öğrenmeniz, hem eğitim başarınızı yükseltecek, hem hayattan aldığınız zevki arttıracak, hem de sizi daha etkili bir insan yapacaktır." : "Sınavları geçilmesi gereken zorunlu engeller olarak görerek hazırlandığınız anlaşılmaktadır. Eğitim hayatındaki sınavların, hayatın bir parçası olduğunun farkındasınız ve bu tavrınız sınavlara hazırlığınızı kolaylaştırarak, eğitim başarınızı olumlu yönde etkilemektedir.";
          default: return null;
        }
      };

      for (const [cat, scoreVal] of Object.entries(category_scores)) {
        const text = getYorum(cat, Number(scoreVal));
        if (text) interpretations[cat] = text;
      }
    }

    // Beck Depresyon Yorumları
    if (isBeckDepresyon) {
      let beckResult = "";
      if (score <= 9) beckResult = "Minimal Depresyon";
      else if (score <= 16) beckResult = "Hafif depresyon";
      else if (score <= 29) beckResult = "Orta depresyon";
      else beckResult = "Şiddetli depresyon";
      interpretations["Genel Değerlendirme"] = beckResult;
    }

    // Beck Anksiyete Yorumları
    if (isBeckAnksiyete) {
      let anksiyeteResult = "";
      if (score <= 7) anksiyeteResult = "Minimal düzeyde anksiyete";
      else if (score <= 15) anksiyeteResult = "Hafif düzeyde anksiyete";
      else if (score <= 25) anksiyeteResult = "Orta düzeyde anksiyete";
      else anksiyeteResult = "Şiddetli düzeyde anksiyete";
      interpretations["Genel Değerlendirme"] = anksiyeteResult;
    }

    // 1. Veritabanına Kaydet
    const { error: dbError } = await supabase.from("scale_results").insert({
      scale_id, scale_name, patient_name, patient_email, patient_phone, score, category_scores, interpretations, answers
    });

    if (dbError) throw new Error("Veritabanı kayıt hatası: " + dbError.message);

    // Kategori Puanlarını ve Yorumları Mailler İçin HTML Formatına Çevir
    let categoryHtml = "";
    
    // Beck Ölçekleri İçin Özel Mail HTML Blok
    if (isBeckDepresyon || isBeckAnksiyete) {
      const araliklar = isBeckDepresyon 
        ? "• Minimal 0-9<br/>• Hafif 10-16<br/>• Orta 17-29<br/>• Şiddetli 30-63" 
        : "• Minimal 0-7<br/>• Hafif 8-15<br/>• Orta 16-25<br/>• Şiddetli 26-63";

      categoryHtml += `
        <div style="background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #082b34; font-size: 18px;">Durum: <span style="color: #00878a;">${interpretations["Genel Değerlendirme"]}</span></h4>
          <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.6;">
            ${araliklar}
          </p>
        </div>
      `;
    } 
    // Diğer Ölçekler İçin Alt Boyut HTML Blok
    else if (category_scores && Object.keys(category_scores).length > 0) {
      categoryHtml = `
        <h4 style="color: #082b34; margin-bottom: 15px; font-size: 18px;">Alt Boyut Değerlendirmeleri ve Yorumlar:</h4>
        <div style="margin-bottom: 20px;">
          ${Object.entries(category_scores).map(([cat, val]) => {
            const interpText = interpretations[cat] ? `<p style="margin-top: 10px; font-size: 14px; color: #555; line-height: 1.6; font-style: italic;">"${interpretations[cat]}"</p>` : "";
            return `
            <div style="background: #f8fafc; padding: 15px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: #082b34; font-size: 15px;">${cat}</strong> 
                <span style="background: #00878a; color: white; padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 14px;">${val} Puan</span>
              </div>
              ${interpText}
            </div>
            `;
          }).join('')}
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;" />
      `;
    }

    // 2. Mail Gönderimi (Admin)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "ayguntuceatasads@gmail.com", pass: "ihgi emxr jpzl brrh" },
    });

    const adminMailOptions = {
      from: '"Klinik Otomasyonu" <ayguntuceatasads@gmail.com>',
      to: "ayguntuceatasads@gmail.com",
      subject: `Yeni Ölçek Dolduruldu: ${patient_name} - ${scale_name}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00878a; margin-top: 0;">Yeni Ölçek Sonucu: ${scale_name}</h2>
          <p><strong>Danışan:</strong> ${patient_name}</p>
          <p><strong>E-posta:</strong> ${patient_email}</p>
          <p><strong>Telefon:</strong> ${patient_phone}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <h3 style="color: #d9534f; font-size: 24px; text-align: center;">Toplam Puan: ${score}</h3>
          
          ${categoryHtml}

          <h4 style="color: #082b34;">Verilen Yanıtlar:</h4>
          <ul style="padding-left: 20px;">
            ${Array.isArray(answers) 
              ? answers.map((item: any) => `<li style="margin-bottom: 15px;"><strong>${item.question}</strong> <br/> <span style="color: #00878a; font-weight: bold;">${item.answer}</span></li>`).join('')
              : Object.entries(answers).map(([q, a]) => `<li style="margin-bottom: 15px;"><strong>${q}</strong> <br/> <span style="color: #00878a; font-weight: bold;">${a}</span></li>`).join('')
            }
          </ul>
        </div>
      `,
    };
    await transporter.sendMail(adminMailOptions);

    // 3. Mail Gönderimi (Hasta - Puan Gizleme Mantığı İle)
    if (send_email_to_patient) {
      const isHiddenScore = lowerScaleName.includes("conners") || lowerScaleName.includes("young");

      const patientMailOptions = {
        from: '"Aygün Tuçe Ataş Önç" <ayguntuceatasads@gmail.com>',
        to: patient_email,
        subject: `${scale_name} Sonucunuz`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px;">
            <h2 style="color: #082b34; margin-top: 0;">Merhaba ${patient_name},</h2>
            <p>Doldurmuş olduğunuz <strong>${scale_name}</strong> başarıyla sistemimize ulaşmıştır.</p>
            
            ${isHiddenScore ? `
              <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0; font-size: 18px; color: #082b34; font-weight: bold;">Form sonuçlarınız uzmanımıza iletilmiştir.</p>
                <p style="margin-top: 15px; line-height: 1.6; color: #555;">Sonuçlarınız klinik olarak değerlendirildikten sonra sizinle iletişime geçilecektir. Dilerseniz <strong>0 (507) 465 49 43</strong> numaralı telefondan randevu veya bilgi alabilirsiniz.</p>
              </div>
            ` : `
              <div style="text-align: center; background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0; font-size: 16px;">Ölçek sonucundaki toplam puanınız</p>
                <strong style="font-size: 32px; color: #00878a;">${score}</strong>
              </div>
              
              ${categoryHtml}

              ${!(isBeckDepresyon || isBeckAnksiyete) ? `<p style="line-height: 1.6;">Sonuçlarınız uzmanımız tarafından değerlendirilecektir. Herhangi bir sorunuz olursa bizimle iletişime geçebilirsiniz.</p>` : ``}
            `}
            
            <p style="margin-top: 30px; color: #666;">Sağlıklı günler dileriz.</p>
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