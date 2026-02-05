/**
 * Deterministic query helpers. No business logic — only filters and sorts.
 */
import type { InboxItem } from "@/lib/db/types";

export function isDueToday(item: InboxItem): boolean {
  if (item.time_type !== "exact" || item.time_offset_days == null) return false;
  const created = new Date(item.created_at);
  const createdDate = new Date(
    Date.UTC(
      created.getUTCFullYear(),
      created.getUTCMonth(),
      created.getUTCDate()
    )
  );
  const due = new Date(createdDate);
  due.setUTCDate(due.getUTCDate() + item.time_offset_days);
  const today = new Date();
  const todayStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  return due.getTime() === todayStart.getTime();
}

export function isDueTomorrow(item: InboxItem): boolean {
  if (item.time_type !== "exact" || item.time_offset_days == null) return false;
  const created = new Date(item.created_at);
  const createdDate = new Date(
    Date.UTC(
      created.getUTCFullYear(),
      created.getUTCMonth(),
      created.getUTCDate()
    )
  );
  const due = new Date(createdDate);
  due.setUTCDate(due.getUTCDate() + item.time_offset_days);
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStart = new Date(
    Date.UTC(
      tomorrow.getUTCFullYear(),
      tomorrow.getUTCMonth(),
      tomorrow.getUTCDate()
    )
  );
  return due.getTime() === tomorrowStart.getTime();
}

export function isDueNext7Days(item: InboxItem): boolean {
  if (item.time_type !== "exact" || item.time_offset_days == null) return false;
  const created = new Date(item.created_at);
  const createdDate = new Date(
    Date.UTC(
      created.getUTCFullYear(),
      created.getUTCMonth(),
      created.getUTCDate()
    )
  );
  const due = new Date(createdDate);
  due.setUTCDate(due.getUTCDate() + item.time_offset_days);
  const today = new Date();
  const todayStart = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const weekEnd = new Date(todayStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  return (
    due.getTime() >= todayStart.getTime() && due.getTime() <= weekEnd.getTime()
  );
}
