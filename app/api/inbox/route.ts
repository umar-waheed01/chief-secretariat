/**
 * POST: capture raw text → AI classify → persist inbox (+ derived shopping if applicable).
 * GET: not used for listing (views use Server Components); optional for client if needed.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classify } from "@/lib/ai/service";
import type { DestinationGuess, InboxStatus } from "@/lib/constants";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { raw_text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rawText = typeof body.raw_text === "string" ? body.raw_text.trim() : "";
  if (!rawText) {
    return NextResponse.json(
      { error: "raw_text is required and must be non-empty" },
      { status: 400 }
    );
  }

  const response = await classify(rawText);

  let status: InboxStatus = "Inbox";
  let confidence: "high" | "medium" | "low" = "low";
  let destination_guess: DestinationGuess = "inbox";
  let ai_title = "";
  let ai_summary = "";
  let time_type: "exact" | "fuzzy" | "none" = "none";
  let time_offset_days: number | null = null;
  let ai_raw: Record<string, unknown> = {};
  const prompt_version = response.promptVersion;

  if (response.success) {
    const r = response.result;
    status = r.status;
    confidence = r.confidence;
    destination_guess = r.destination === "default" ? "inbox" : r.destination;
    ai_title = r.ai_title;
    ai_summary = r.ai_summary;
    time_type = r.time_type;
    time_offset_days = r.time_offset_days;
    ai_raw = (response.raw as Record<string, unknown>) ?? {};
  }

  const { data: inboxRow, error: inboxError } = await supabase
    .from("inbox_items")
    .insert({
      user_id: user.id,
      raw_text: rawText,
      ai_title,
      ai_summary,
      status,
      confidence,
      time_type,
      time_offset_days,
      destination_guess,
      ai_raw,
      prompt_version,
    })
    .select("id")
    .single();

  if (inboxError) {
    return NextResponse.json(
      { error: "Failed to save inbox item", details: inboxError.message },
      { status: 500 }
    );
  }

  const inboxId = inboxRow?.id as string;
  let shoppingCount = 0;

  if (
    response.success &&
    response.result.destination === "shopping" &&
    response.result.items.length > 0 &&
    (response.result.confidence === "high" ||
      response.result.confidence === "medium")
  ) {
    const store = response.result.store || "";
    const rows = response.result.items.map((item_name: string) => ({
      inbox_item_id: inboxId,
      item_name,
      store,
      done: false,
    }));
    const { data: inserted } = await supabase
      .from("shopping_items")
      .insert(rows)
      .select("id");
    shoppingCount = inserted?.length ?? 0;
  }

  const storeFromAi = response.success ? response.result.store : undefined;
  const message = formatToastMessage(
    destination_guess,
    status,
    storeFromAi,
    shoppingCount,
    time_type,
    time_offset_days
  );

  return NextResponse.json({
    ok: true,
    inbox_id: inboxId,
    destination_guess,
    status,
    shopping_count: shoppingCount,
    message,
  });
}

function formatToastMessage(
  destination: DestinationGuess,
  status: InboxStatus,
  store: string | undefined,
  shoppingCount: number,
  timeType: string,
  timeOffsetDays: number | null
): string {
  const parts = ["Saved"];
  if (destination === "shopping" && (store || shoppingCount > 0)) {
    parts.push("Shopping");
    if (store) parts.push(store);
    if (shoppingCount > 0) parts.push(`${shoppingCount} items`);
  } else if (
    status === "Action" &&
    timeType === "exact" &&
    timeOffsetDays != null
  ) {
    parts.push("Action");
    if (timeOffsetDays === 0) parts.push("Due today");
    else if (timeOffsetDays === 1) parts.push("Due tomorrow");
    else parts.push(`Due in ${timeOffsetDays} days`);
  } else {
    parts.push(status);
  }
  return parts.join(" · ");
}
