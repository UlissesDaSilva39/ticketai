-- "Who viewed your profile": one row per viewer, per profile, per day.
-- New table only; no existing data changes.

create table if not exists public.profile_views (
  id         uuid primary key default gen_random_uuid(),
  viewer_id  uuid not null references auth.users (id) on delete cascade,
  viewed_id  uuid not null references auth.users (id) on delete cascade,
  viewed_on  date not null default current_date,
  viewed_at  timestamptz not null default now(),
  check (viewer_id <> viewed_id),
  unique (viewer_id, viewed_id, viewed_on)
);

create index if not exists profile_views_viewed_idx on public.profile_views (viewed_id, viewed_at desc);

alter table public.profile_views enable row level security;

-- Nobody reads this table directly from the browser: the server decides what each
-- member may see (full details for Premium, anonymised hints otherwise).
-- Writes also happen only on the server (service key). No policies = no direct access.
