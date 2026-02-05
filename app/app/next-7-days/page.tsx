import { createClient } from "@/lib/supabase/server";
import { isDueNext7Days } from "@/lib/db/queries";
import { formatInboxItem } from "@/components/inbox-item";
import type { InboxItem } from "@/lib/db/types";

export default async function Next7DaysPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inbox_items")
    .select(
      "id, raw_text, ai_title, ai_summary, status, confidence, destination_guess, created_at, time_type, time_offset_days"
    )
    .eq("time_type", "exact")
    .not("time_offset_days", "is", null)
    .order("created_at", { ascending: false });

  const filtered = (items ?? []).filter((i) =>
    isDueNext7Days(i as unknown as InboxItem)
  );

  return (
    <div>
      <h1 className="text-lg font-semibold mb-3">Next 7 Days</h1>
      {!filtered.length ? (
        <p className="text-gray-500 text-sm">Nothing due in the next 7 days.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
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
