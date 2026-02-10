import type {
  Confidence,
  DestinationGuess,
  InboxStatus,
  TimeType,
} from "@/lib/constants";

/** Single source of truth — raw_text never modified. */
export interface InboxItem {
  id: string;
  user_id: string;
  raw_text: string;
  ai_title: string;
  ai_summary: string;
  status: InboxStatus;
  confidence: Confidence;
  time_type: TimeType;
  time_offset_days: number | null;
  destination_guess: DestinationGuess;
  ai_raw: Record<string, unknown>;
  prompt_version: string;
  created_at: string;
  /** UNBU retention: set by trigger from profiles.plan; null = paid / no expiry */
  purge_at: string | null;
  /** UNBU: plan at creation (free | light | heavy) */
  plan_at_creation: string | null;
}

/** Derived from inbox; rebuildable; linked by inbox_item_id. */
export interface ShoppingItem {
  id: string;
  inbox_item_id: string;
  item_name: string;
  store: string;
  done: boolean;
}

export interface ShoppingItemWithInbox extends ShoppingItem {
  inbox_item?: Pick<InboxItem, "id" | "ai_title" | "created_at">;
}
