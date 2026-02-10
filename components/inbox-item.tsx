import type { InboxItem } from "@/lib/db/types";

export function formatInboxItem(
  item: Pick<
    InboxItem,
    | "raw_text"
    | "ai_title"
    | "ai_summary"
    | "status"
    | "confidence"
    | "destination_guess"
    | "created_at"
  >
) {
  const date = item.created_at
    ? new Date(item.created_at).toLocaleString()
    : "";
  return (
    <>
      <div className="font-medium text-[var(--foreground)]">
        {item.ai_title || item.raw_text.slice(0, 60)}
      </div>
      {item.ai_summary && (
        <div className="mt-1 text-sm text-[var(--muted)]">{item.ai_summary}</div>
      )}
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--muted)]">
        <span>{item.status}</span>
        <span>{item.confidence}</span>
        <span>{item.destination_guess}</span>
        <span>{date}</span>
      </div>
    </>
  );
}
