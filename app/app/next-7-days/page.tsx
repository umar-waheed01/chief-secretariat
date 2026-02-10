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
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Next 7 Days</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Due in the next week</p>
      </div>
      {!filtered.length ? (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted)]">Nothing due in the next 7 days.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-4 shadow-sm"
            >
              {formatInboxItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
