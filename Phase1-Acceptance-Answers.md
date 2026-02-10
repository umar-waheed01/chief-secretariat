# Phase 1 — Architecture Acceptance Answers

Hi Numan,

Thank you for the structured review. Below are confirmations for each point, in the same order as your questions. The wording is kept consistent with our earlier discussions.

**Verification note (for your reference):** All answers are based on the current codebase. Most points are fully implemented; two are “architecture ready” but not yet wired in the UI/API: **(5)** the schema allows manual overrides and they would be persisted, but there is no edit-inbox-item API or UI yet; **(7)** the data model has a “projects” destination, but there is no dedicated Projects list page yet—only Inbox, Today, Tomorrow, Next 7 Days, Shopping, Ideas, and Unsure.

---

## Core Phase 1 acceptance questions

### 1) Single source of truth

Yes. Everything starts in one main place: the Inbox.

Every item the user adds is stored there first, and nothing is overwritten or lost. All other lists (like Today, Ideas, or Shopping) are simply different views of that same data. This keeps the system simple and consistent.

---

### 2) No irreversible writes

Yes. We do not transform or discard the original input.

The raw text is always stored as-is in the Inbox and is never modified. All other data (AI title, summary, status, due-day, destination) is stored alongside it. If we ever need to rebuild derived lists like Shopping, we can do that from the inbox row and the stored AI response. Nothing is written in a way that cannot be reconstructed from the inbox plus any user overrides we persist on the same item.

---

### 3) Capture never blocks

Yes. Capture is never blocked by validation or confidence.

Every submission is saved to the Inbox first. If the AI response is invalid or we are unsure, we still persist the item and fall back to a safe default (Inbox + Unsure). The user always gets a confirmation; we never reject or drop a capture because of schema validation, confidence thresholds, or classification uncertainty.

---

### 4) Phase 2 safety

Yes. The current schema is designed so Phase 2 can extend without breaking changes.

The inbox is the single source of truth, and derived data is linked by stable IDs. Export, retention rules, and extra views can be added by reading from the same inbox table and existing links. We do not see any need for a migration or refactor of the core model for those features.

---

## Related architectural aspects

### 5) User overrides and learning preparation

Yes. The structure is in place so that when a user manually corrects destination, status, or due-day, that override can be stored on the same inbox item and will survive any rebuild of derived data.

The schema allows updates to those fields, and the original AI output is kept in the stored response so we can compare later. Active learning from overrides can stay in Phase 2/3; Phase 1 already keeps these signals structurally. If the manual-override UI or API is not fully in place yet, it can be added without changing the model.

---

### 6) Reason trace (system and user-facing)

Yes. A minimal reason trace fits the Phase 1 model.

The AI already returns a short reason (e.g. “This sounds like a follow-up, but no date was provided.”). We store the full AI response, including confidence and that reason, in the inbox row. So we have confidence level, the reason text, and the rest of the classification in one place. We can later add reason codes (e.g. missing_date, ambiguity) or surface the existing reason in the UI without changing the core structure.

---

### 7) Views completeness (Phase 2)

Yes. The core views are intended to include a Projects list alongside Inbox, time buckets, Shopping, Ideas, and Unsure.

The data model already supports it: each item has a destination (including “projects”). Right now we have Inbox, Today, Tomorrow, Next 7 Days, Shopping, Ideas, and Unsure; a dedicated Projects view can be added in Phase 2 without any schema change.

---

### 8) Multi-association safety (project + person + reminder)

Yes. We don’t duplicate items.

Each item exists only once in the Inbox. If it relates to a project, a person, or a reminder, we attach that information to the same item (today via fields and stored AI output; later we can add link/association records). The same inbox item can appear in multiple contexts (e.g. “Today” and “Project X”) while remaining a single source of truth. The architecture supports this without duplication.

---

### 9) Export as a first-class use case

Yes. The model supports a deterministic, versioned export.

We can produce an export envelope that includes inbox items (with raw text), user overrides (the current fields on each item), link/association data when we have it, and version metadata (e.g. prompt version, schema version, export format version). External tools can consume this envelope in a well-defined way. Phase 1 gives us the stable structure; Phase 2 can add the actual export format and tooling.

---

### 10) Stable IDs for downstream processing

Yes. Entity IDs are stable and can be used as durable references.

Inbox items use stable UUIDs. Derived records (e.g. shopping items) reference them via `inbox_item_id`. Those IDs do not change when we rebuild or re-export. External systems can rely on them so that links and relations stay intact across exports and imports.

---

## Summary (views and data stores)

To tie this back to how things work today:

- There are only two actual data stores: the main Inbox (source of truth) and the Shopping list (derived from the Inbox).
- Everything else — Today, Tomorrow, Next 7 Days, Ideas, Unsure, and Projects when we add the view — is a filtered view of the Inbox, not a separate database.

If you’d like, we can also add a simple “ready for export” switch so that only approved items are included in automation or export.

Best regards,  
Muhammad
