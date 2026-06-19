import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden">
      {/* Sol Sidebar */}
      <AdminSidebar />
      
      {/* Sağ İçerik Alanı */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        {children}
      </main>
    </div>
  );
}