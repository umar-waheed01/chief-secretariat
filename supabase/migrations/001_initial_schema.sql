-- Chief Secretariat Phase 1 — Single source of truth: inbox_items
-- Derived: shopping_items (rebuildable from inbox_items + ai_raw)

-- Inbox: every user input stored first; raw_text never modified
CREATE TABLE inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text TEXT NOT NULL,
  ai_title TEXT NOT NULL DEFAULT '',
  ai_summary TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Inbox', 'Action', 'Think', 'Unsure')) DEFAULT 'Inbox',
  confidence TEXT NOT NULL CHECK (confidence IN ('high', 'medium', 'low')) DEFAULT 'low',
  time_type TEXT NOT NULL CHECK (time_type IN ('exact', 'fuzzy', 'none')) DEFAULT 'none',
  time_offset_days INTEGER CHECK (time_offset_days IS NULL OR time_offset_days >= 1),
  destination_guess TEXT NOT NULL CHECK (destination_guess IN ('default', 'inbox', 'shopping', 'ideas', 'projects')) DEFAULT 'inbox',
  ai_raw JSONB NOT NULL DEFAULT '{}',
  prompt_version TEXT NOT NULL DEFAULT '1.0.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_inbox_items_user_id ON inbox_items(user_id);
CREATE INDEX idx_inbox_items_created_at ON inbox_items(user_id, created_at DESC);
CREATE INDEX idx_inbox_items_status ON inbox_items(user_id, status);
CREATE INDEX idx_inbox_items_destination ON inbox_items(user_id, destination_guess);
CREATE INDEX idx_inbox_items_time ON inbox_items(user_id, time_type, time_offset_days) WHERE time_type = 'exact';

-- Derived: shopping items; linked to inbox_item; disposable/rebuildable
CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inbox_item_id UUID NOT NULL REFERENCES inbox_items(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  store TEXT NOT NULL DEFAULT '',
  done BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_shopping_items_inbox_item_id ON shopping_items(inbox_item_id);

-- RLS: users see only their own data
ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own inbox_items"
  ON inbox_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own inbox_items"
  ON inbox_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own inbox_items"
  ON inbox_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own inbox_items"
  ON inbox_items FOR DELETE
  USING (auth.uid() = user_id);

-- shopping_items: access via inbox_item ownership
CREATE POLICY "Users can read own shopping_items"
  ON shopping_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM inbox_items i WHERE i.id = shopping_items.inbox_item_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Users can insert shopping_items for own inbox"
  ON shopping_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM inbox_items i WHERE i.id = shopping_items.inbox_item_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Users can update own shopping_items"
  ON shopping_items FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM inbox_items i WHERE i.id = shopping_items.inbox_item_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own shopping_items"
  ON shopping_items FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM inbox_items i WHERE i.id = shopping_items.inbox_item_id AND i.user_id = auth.uid())
  );
