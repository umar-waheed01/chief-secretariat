import { createClient } from "@/lib/supabase/server";
import { formatInboxItem } from "@/components/inbox-item";

export default async function IdeasPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("inbox_items")
    .select(
      "id, raw_text, ai_title, ai_summary, status, confidence, destination_guess, created_at"
    )
    .eq("destination_guess", "ideas")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">Ideas</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">Ideas list</p>
      {!items?.length ? (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted)]">No ideas yet.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
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
    </div>
  );
}
