Dokumentinhalt (copy & paste)

# UNBU – Free Plan Retention Architecture

## Phase 1 Schema Requirements & Phase 2 Implementation Reference

### Product Rule (Free Plan)

- Free items fade out gradually based on age.
- Day 0–24h: fully visible.
- From Day 1 to Day 5: continuous fade (UI only).
- After Day 5: items disappear from the list.
- Server-side job hard-deletes expired Free items.

No countdowns, no urgency signals.

---

## Phase 1 – Architecture Requirements (Schema & Query Contract)

### Required Table Fields (e.g. `inbox_items`)

- `created_at` (timestamptz, default `now()`)
- `purge_at` (timestamptz, REQUIRED)
- `plan_at_creation` (text or enum: `free | light | heavy`, recommended)

Rule:

- For Free items:  
  `purge_at = created_at + interval '5 days'`
- For paid plans:  
  `purge_at = NULL`

### Read-only System Fields

The following fields must be immutable after insert:

- `created_at`
- `purge_at`

### List Query Rule (Free)

- Free items must be excluded from lists when:
  `purge_at <= now()`

(UI fade logic is client-side only.)

---

## UI / Client Logic (No DB Writes)

Fade is computed dynamically from timestamps:

- `fade_start = created_at + 24 hours`
- `fade_end = purge_at`

Fade factor (0…1):

- `now < fade_start` → fade = 0
- `now >= fade_end` → item hidden
- else: linear interpolation

No background jobs required for fading.

---

## Phase 2 – Database Implementation Reference

### Schema Additions

```sql
alter table public.inbox_items
  add column if not exists purge_at timestamptz,
  add column if not exists plan_at_creation text;

create index if not exists inbox_items_purge_at_idx
  on public.inbox_items (purge_at);

Automatic purge_at Assignment on Insert
create or replace function public.set_free_purge_at()
returns trigger
language plpgsql
as $$
declare
  v_plan text;
begin
  select p.plan into v_plan
  from public.profiles p
  where p.id = new.user_id;

  if v_plan is null then
    v_plan := 'free';
  end if;

  new.plan_at_creation := v_plan;

  if v_plan = 'free' then
    new.purge_at := new.created_at + interval '5 days';
  else
    new.purge_at := null;
  end if;

  return new;
end;
$$;

create trigger trg_set_free_purge_at
before insert on public.inbox_items
for each row
execute function public.set_free_purge_at();

Block Updates to System Fields
create or replace function public.block_system_field_updates()
returns trigger
language plpgsql
as $$
begin
  if new.purge_at is distinct from old.purge_at then
    raise exception 'purge_at is read-only';
  end if;

  if new.created_at is distinct from old.created_at then
    raise exception 'created_at is read-only';
  end if;

  return new;
end;
$$;

create trigger trg_block_system_field_updates
before update on public.inbox_items
for each row
execute function public.block_system_field_updates();

Hard Delete (Scheduled Job)
delete from public.inbox_items
where purge_at is not null
  and purge_at < now();


(Executed hourly or daily via cron / scheduled function.)

Notes

Phase 1 must include the schema fields and list filtering.

Phase 2 adds triggers, RLS/RPC hardening, and scheduled purge.

Fade behavior is purely visual and intentionally non-urgent.
```
