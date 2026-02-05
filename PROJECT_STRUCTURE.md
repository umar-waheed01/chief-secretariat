# Chief Secretariat — Phase 1 Project Structure

## Folder structure

```
app/
  layout.tsx                 # Root layout (fonts, globals)
  page.tsx                   # Home: redirect or dashboard entry
  globals.css
  (auth)/
    login/page.tsx           # Login form
    signup/page.tsx          # Signup form
  (app)/                     # Authenticated app
    layout.tsx               # Nav + capture form + toast area
    page.tsx                 # Dashboard (links to views)
    inbox/page.tsx
    today/page.tsx
    tomorrow/page.tsx
    next-7-days/page.tsx
    shopping/page.tsx
    ideas/page.tsx
    unsure/page.tsx
  api/
    auth/callback/route.ts   # Supabase auth callback
    inbox/route.ts           # POST capture, GET list (optional)
    shopping/route.ts        # PATCH toggle done
lib/
  supabase/
    server.ts                # createServerClient (SSR)
    client.ts                # createBrowserClient
  db/
    types.ts                 # InboxItem, ShoppingItem, enums
  ai/
    prompt.ts                # Versioned prompt text (Appendix A)
    schema.ts                # JSON schema + runtime validator (Appendix B)
    service.ts               # classify(rawText) → validated result or fallback
  constants.ts               # Status, confidence, destination enums
components/
  capture-form.tsx           # Client: textarea + submit → API → toast
  toast.tsx                  # Minimal toast (client)
  nav.tsx                    # Links to views
middleware.ts                # Supabase auth refresh
supabase/
  migrations/
    001_initial_schema.sql   # inbox_items, shopping_items, RLS
```

## Data flow

1. **Capture:** User submits raw text → `POST /api/inbox` → AI service (validate schema) → insert `inbox_items` → if shopping + confident → insert `shopping_items` → response → toast.
2. **Views:** Server Components read from Supabase (server client) by view (inbox, today, etc.); no business logic in UI.
3. **Shopping toggle:** `PATCH /api/shopping` updates `shopping_items.done` only.

## Rules enforced

- Single source of truth: `inbox_items`; `shopping_items` derived and rebuildable.
- AI behind `lib/ai/service.ts`; prompt in `lib/ai/prompt.ts`; schema in `lib/ai/schema.ts`.
- No service_role on client; RLS on all tables.
- Validation failure → Inbox + Unsure, capture still saved.
