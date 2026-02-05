import { createClient } from "@/lib/supabase/server";
import { formatInboxItem } from "@/components/inbox-item";

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inbox_items")
    .select(
      "id, raw_text, ai_title, ai_summary, status, confidence, destination_guess, created_at"
    )
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Inbox</h1>
      {!items?.length ? (
        <p className="text-gray-500 text-sm">
          No items yet. Capture a note above.
        </p>
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
