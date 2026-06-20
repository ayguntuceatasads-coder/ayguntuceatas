import { createClient } from "@/lib/supabase/server";

export default async function IletisimMesajlari() {
  const supabase = await createClient();

  // 'iletisim' türündeki mesajları çekiyoruz
  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("type", "randevu")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Randevu Formu Mesajları</h1>
      <div className="space-y-4">
        {messages?.map((msg) => (
          <div key={msg.id} className="p-4 bg-white rounded-lg shadow border">
            <h3 className="font-bold text-lg">{msg.subject}</h3>
            <p className="text-sm text-gray-500">{msg.name} - {msg.email}</p>
            <p className="mt-2 text-gray-700">{msg.message}</p>
            <span className="text-xs text-gray-400">
              {new Date(msg.created_at).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}