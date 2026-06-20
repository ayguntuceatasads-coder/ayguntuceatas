import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  // 1. Oturum Kontrolü
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/admin-login");

  // VS CODE TERMİNALİNE GİRİŞ YAPAN MAİLİ YAZDIRIYORUZ
  console.log("--- GÜVENLİK KALKANI TESTİ ---");
  console.log("1. Giriş Yapan Email:", session.user.email);

  // 2. Kalkan Kontrolü
  const { data: roleData, error } = await supabase
    .from('admin_roles')
    .select('role')
    .eq('email', session.user.email)
    .single();

  // VS CODE TERMİNALİNE VERİTABANI SONUCUNU YAZDIRIYORUZ
  console.log("2. Veritabanında Bulunan Veri:", roleData);
  console.log("3. Varsa Veritabanı Hatası:", error);
  console.log("------------------------------");

  if (!roleData) {
    redirect("/admin-login?error=unauthorized");
  }

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}