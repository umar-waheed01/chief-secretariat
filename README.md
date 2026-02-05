# Chief Secretariat

AI-first personal inbox: capture raw notes, classify and schedule automatically. Phase 1 MVP per the architecture document.

## Stack

- Next.js 16 (App Router), TypeScript (strict), Supabase (Auth + Postgres + RLS), OpenAI API.

## Setup

1. **Environment**

   Copy `.env.example` to `.env` and set:

   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase project)
   - `OPENAI_API_KEY` (for AI classification)

2. **Supabase**

   - Create a project at [supabase.com](https://supabase.com).
   - In **SQL Editor**, run the migration:  
     `supabase/migrations/001_initial_schema.sql`  
     (creates `inbox_items`, `shopping_items`, and RLS).
   - In **Authentication → URL Configuration**, add redirect URL:  
     `http://localhost:3000/auth/callback`  
     (and your production URL when you deploy).

3. **Run**

   ```bash
   npm install
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). Sign up, then capture notes; they are classified and shown in Inbox, Today, Shopping, Ideas, Unsure, etc.

## Project structure

- `app/` — App Router: `/` (redirect), `/login`, `/signup`, `/app/*` (dashboard + views), `/api/inbox`, `/api/shopping`, `/api/auth/callback`.
- `lib/supabase/` — Server and browser Supabase clients; middleware for auth refresh.
- `lib/ai/` — Versioned prompt, JSON schema validation, `classify()` (OpenAI).
- `lib/db/` — Types and due-day query helpers.
- `components/` — Capture form, toast, nav, list/item UI (minimal).
- `supabase/migrations/` — Schema and RLS.

## Architecture (Phase 1)

- **Single source of truth:** every input is stored first as an `inbox_items` row; `raw_text` is never modified.
- **Derived data:** `shopping_items` and due-day views are derived from inbox; rebuildable and disposable.
- **AI:** One OpenAI call per capture; response validated against Appendix B schema; on failure → Inbox + Unsure (capture still saved).
- **No service_role on client;** RLS on all tables.

See `MVP Architecture Intent & Phase-model-Numan.md` and `PROJECT_STRUCTURE.md` for full details.
