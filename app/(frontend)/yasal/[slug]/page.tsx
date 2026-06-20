import { supabase } from "@/lib/supabase";

export default async function LegalPage({ params }: { params: { slug: string } }) {
  const { data: doc } = await supabase
    .from("legal_documents")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!doc) return <div>Belge bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-bold mb-10">{doc.title}</h1>
      <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: doc.content }} />
    </div>
  );
}