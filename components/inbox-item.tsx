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
      <div className="font-medium">
        {item.ai_title || item.raw_text.slice(0, 60)}
      </div>
      {item.ai_summary && (
        <div className="text-gray-600 mt-1">{item.ai_summary}</div>
      )}
      <div className="text-gray-400 text-xs mt-1">
        {item.status} · {item.confidence} · {item.destination_guess} · {date}
      </div>
    </>
  );
}
