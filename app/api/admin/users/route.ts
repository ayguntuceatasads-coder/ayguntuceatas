import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Dikkat: Anon key değil, güçlü Service Role key kullanıyoruz
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Supabase Auth'a yeni kullanıcıyı sessizce ekle
    const { error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (authError) throw new Error(authError.message);

    // 2. Yetki tablosuna admin olarak işle
    const { error: dbError } = await supabaseAdmin.from("admin_roles").insert({ email, role: "admin" });
    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json();
    
    // SÜPER ADMİN KORUMASI (API SEVİYESİNDE)
    if (email === "ayguntuceatasads@gmail.com") {
      return NextResponse.json({ success: false, error: "Süper Admin hesabı silinemez!" }, { status: 403 });
    }

    // Yetki tablosundan sil (Böylece panele bir daha asla giremez)
    await supabaseAdmin.from("admin_roles").delete().eq("email", email);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}