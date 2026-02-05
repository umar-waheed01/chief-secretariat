/** Phase 1 — from MVP Architecture doc. Single dominant destination per item. */
export const INBOX_STATUS = ["Inbox", "Action", "Think", "Unsure"] as const;
export type InboxStatus = (typeof INBOX_STATUS)[number];

export const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export const TIME_TYPES = ["exact", "fuzzy", "none"] as const;
export type TimeType = (typeof TIME_TYPES)[number];

export const DESTINATION_GUESS = [
  "default",
  "inbox",
  "shopping",
  "ideas",
  "projects",
] as const;
export type DestinationGuess = (typeof DESTINATION_GUESS)[number];
