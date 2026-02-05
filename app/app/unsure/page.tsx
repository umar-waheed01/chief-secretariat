import { createClient } from "@/lib/supabase/server";
import { formatInboxItem } from "@/components/inbox-item";

export default async function UnsurePage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inbox_items")
    .select(
      "id, raw_text, ai_title, ai_summary, status, confidence, destination_guess, created_at"
    )
    .eq("status", "Unsure")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Unsure Review Queue</h1>
      {!items?.length ? (
        <p className="text-gray-500 text-sm">No items needing review.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 rounded p-3 text-sm"
            >
              {formatInboxItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
