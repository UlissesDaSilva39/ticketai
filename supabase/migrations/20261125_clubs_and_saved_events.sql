-- ============================================================
-- GRID: club memberships + saved events, with Row Level Security
-- Safe to run more than once. Runs as one transaction: if any
-- statement fails, nothing is changed.
--
-- Combines (and secures) these earlier files, which were never applied:
--   20261022_unified_clubs.sql
--   20261022_stripe_memberships.sql
--   20261027-111937_add_saved_events.sql
-- ============================================================
begin;

-- 1. Club tiers: the plans a venue / artist / promoter offers
create table if not exists public.club_tiers (
  id              uuid primary key default gen_random_uuid(),
  entity_type     text not null check (entity_type in ('venue', 'artist', 'promoter', 'dj')),
  entity_id       text not null,             -- slug of the venue/artist/promoter
  name            text not null,             -- 'Regular', 'Inner Circle', ...
  price_monthly   numeric not null check (price_monthly >= 0),
  description     text,
  perks           jsonb not null default '[]'::jsonb,
  is_popular      boolean not null default false,
  max_members     int,
  sort_order      int not null default 0,
  stripe_price_id text,
  created_at      timestamptz not null default now(),
  unique (entity_type, entity_id, name)
);
create index if not exists idx_club_tiers_entity on public.club_tiers (entity_type, entity_id);

-- 2. Memberships: who belongs to which club
create table if not exists public.user_memberships (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users(id) on delete cascade,
  entity_type            text not null,
  entity_id              text not null,
  tier_id                uuid not null references public.club_tiers(id),
  status                 text not null default 'pending'
                           check (status in ('pending', 'active', 'past_due', 'canceled')),
  stripe_subscription_id text,
  stripe_session_id      text,
  stripe_payment_status  text default 'pending',
  amount_paid            numeric,
  currency               text default 'gbp',
  started_at             timestamptz default now(),
  current_period_end     timestamptz,
  unique (user_id, entity_type, entity_id)
);
create index if not exists idx_user_memberships_user   on public.user_memberships (user_id);
create index if not exists idx_user_memberships_entity on public.user_memberships (entity_type, entity_id);

-- 3. Security: anyone can see tiers; users can only SEE their own memberships.
--    Memberships are created/activated only by the server (service role:
--    the Stripe webhook, or dev mode). That stops people giving themselves
--    a paid membership for free.
alter table public.club_tiers       enable row level security;
alter table public.user_memberships enable row level security;

drop policy if exists "club tiers are public" on public.club_tiers;
create policy "club tiers are public"
  on public.club_tiers for select
  using (true);

drop policy if exists "users read own memberships" on public.user_memberships;
create policy "users read own memberships"
  on public.user_memberships for select
  using (auth.uid() = user_id);

-- 4. Demo tiers so the club pages have something to show
insert into public.club_tiers (entity_type, entity_id, name, price_monthly, description, perks, is_popular, sort_order)
values
  ('venue',    'fabric',              'Regular',      15, 'The essentials',    '["Skip the queue", "10% off drinks", "Members newsletter"]', false, 1),
  ('venue',    'fabric',              'Inner Circle', 35, 'Best value',        '["Everything in Regular", "1 free ticket/month", "15% off drinks", "+1 guest passes"]', true, 2),
  ('artist',   'dj-proxy',            'Supporter',     5, 'Support the sound', '["Unreleased mixes", "Early ticket access", "Discord access"]', false, 1),
  ('artist',   'dj-proxy',            'Inner Circle', 15, 'The real vault',    '["Everything in Supporter", "Monthly track pack", "Shoutout in podcast", "15% off merch"]', true, 2),
  ('promoter', 'nightshift-presents', 'Guestlist',    10, 'Skip the line',     '["Priority guestlist", "Early bird ticket codes", "Secret location drops"]', true, 1)
on conflict (entity_type, entity_id, name) do nothing;

-- 5. Saved events (Wallet "save" button)
create table if not exists public.saved_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  event_id   uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);
create index if not exists saved_events_user_idx  on public.saved_events (user_id, created_at desc);
create index if not exists saved_events_event_idx on public.saved_events (event_id);

alter table public.saved_events enable row level security;

drop policy if exists "users can read own saves" on public.saved_events;
create policy "users can read own saves"
  on public.saved_events for select using (auth.uid() = user_id);

drop policy if exists "users can insert own saves" on public.saved_events;
create policy "users can insert own saves"
  on public.saved_events for insert with check (auth.uid() = user_id);

drop policy if exists "users can delete own saves" on public.saved_events;
create policy "users can delete own saves"
  on public.saved_events for delete using (auth.uid() = user_id);

commit;

-- Quick check (should list all three tables with rls = true):
select relname as table_name, relrowsecurity as rls
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('club_tiers', 'user_memberships', 'saved_events');
