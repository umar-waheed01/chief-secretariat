/**
 * Runtime validation for AI response — Appendix B contract.
 * Failure → fallback to Inbox + Unsure; capture never blocked.
 */

const DESTINATION = [
  "default",
  "inbox",
  "shopping",
  "ideas",
  "projects",
] as const;
const STATUS = ["Inbox", "Think", "Action", "Unsure"] as const;
const TIME_TYPE = ["exact", "fuzzy", "none"] as const;
const CONFIDENCE = ["high", "medium", "low"] as const;

export interface ClassificationResult {
  destination: (typeof DESTINATION)[number];
  ai_title: string;
  ai_summary: string;
  status: (typeof STATUS)[number];
  time_type: (typeof TIME_TYPE)[number];
  time_offset_days: number | null;
  confidence: (typeof CONFIDENCE)[number];
  decision_reason: string;
  people: string[];
  projects: string[];
  ideas: string[];
  store: string;
  items: string[];
}

const REQUIRED_KEYS: (keyof ClassificationResult)[] = [
  "destination",
  "ai_title",
  "ai_summary",
  "status",
  "time_type",
  "time_offset_days",
  "confidence",
  "decision_reason",
  "people",
  "projects",
  "ideas",
  "store",
  "items",
];

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export function validateClassificationPayload(
  raw: unknown
): ClassificationResult | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw))
    return null;
  const o = raw as Record<string, unknown>;

  for (const key of REQUIRED_KEYS) {
    if (!(key in o)) return null;
  }

  const destination = o.destination;
  if (
    typeof destination !== "string" ||
    !DESTINATION.includes(destination as (typeof DESTINATION)[number])
  )
    return null;

  const ai_title = o.ai_title;
  if (typeof ai_title !== "string" || ai_title.length > 80) return null;

  const ai_summary = o.ai_summary;
  if (typeof ai_summary !== "string") return null;

  const status = o.status;
  if (
    typeof status !== "string" ||
    !STATUS.includes(status as (typeof STATUS)[number])
  )
    return null;

  const time_type = o.time_type;
  if (
    typeof time_type !== "string" ||
    !TIME_TYPE.includes(time_type as (typeof TIME_TYPE)[number])
  )
    return null;

  const time_offset_days = o.time_offset_days;
  if (
    time_offset_days !== null &&
    (typeof time_offset_days !== "number" || time_offset_days < 1)
  )
    return null;

  const confidence = o.confidence;
  if (
    typeof confidence !== "string" ||
    !CONFIDENCE.includes(confidence as (typeof CONFIDENCE)[number])
  )
    return null;

  const decision_reason = o.decision_reason;
  if (typeof decision_reason !== "string" || decision_reason.length > 200)
    return null;

  if (
    !isStringArray(o.people) ||
    !isStringArray(o.projects) ||
    !isStringArray(o.ideas) ||
    !isStringArray(o.items)
  )
    return null;

  const store = o.store;
  if (typeof store !== "string") return null;

  return {
    destination: destination as ClassificationResult["destination"],
    ai_title,
    ai_summary,
    status: status as ClassificationResult["status"],
    time_type: time_type as ClassificationResult["time_type"],
    time_offset_days: time_offset_days as number | null,
    confidence: confidence as ClassificationResult["confidence"],
    decision_reason,
    people: o.people,
    projects: o.projects,
    ideas: o.ideas,
    store,
    items: o.items,
  };
}
