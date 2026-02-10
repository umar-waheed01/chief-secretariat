-- UNBU Free Plan Retention — Phase 1 schema only (future use)
-- Adds purge_at, plan_at_creation to inbox_items; profiles table for future trigger.
-- Triggers and scheduled purge can be added in a later migration.

-- Profiles: plan at signup/default for future set_free_purge_at trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'light', 'heavy')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Inbox: retention fields (Phase 2 trigger will set purge_at from profiles.plan)
ALTER TABLE public.inbox_items
  ADD COLUMN IF NOT EXISTS purge_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_at_creation TEXT;

CREATE INDEX IF NOT EXISTS inbox_items_purge_at_idx
  ON public.inbox_items (purge_at)
  WHERE purge_at IS NOT NULL;
