export default function OuterAdminLayout({ children }: { children: React.ReactNode }) {
  // Dış katman sadece bir taşıyıcı görevi görür. Tüm menü ve güvenlik kalkanı admin/layout.tsx içindedir.
  return <>{children}</>;
}