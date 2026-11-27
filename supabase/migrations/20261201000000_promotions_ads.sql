-- Revenue phase 1: paid promotions ("Boost anything") and self-serve ad campaigns.
-- Safe to run more than once. Existing data is not changed.
begin;

-- 1) Paid post boosts reuse post_boosts: allow source 'paid'.
alter table public.post_boosts drop constraint if exists post_boosts_source_check;
alter table public.post_boosts add constraint post_boosts_source_check check (source in ('premium_monthly', 'admin', 'paid'));

-- 2) Promotions: a member pays to push their own post, listing, live or profile.
create table if not exists public.promotions (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users (id) on delete cascade,
  kind               text not null check (kind in ('post', 'listing', 'live', 'profile')),
  ref_id             uuid not null,
  plan               text not null check (plan in ('1d', '3d', '7d')),
  amount_pence       integer not null check (amount_pence > 0),
  status             text not null default 'pending' check (status in ('pending', 'active', 'cancelled')),
  stripe_session_id  text unique,
  starts_at          timestamptz,
  ends_at            timestamptz,
  created_at         timestamptz not null default now()
);
create index if not exists promotions_live_idx on public.promotions (kind, status, ends_at desc);
create index if not exists promotions_owner_idx on public.promotions (owner_id, created_at desc);

alter table public.promotions enable row level security;
-- Owners see their own; "Promoted" labels are served by the server (service key).
drop policy if exists "promotions own" on public.promotions;
create policy "promotions own" on public.promotions for select using (auth.uid() = owner_id);

-- 3) Ad campaigns: a sponsored card (headline, text, image, link) shown on GRID.
create table if not exists public.ad_campaigns (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users (id) on delete cascade,
  plan               text not null check (plan in ('basic', 'premium')),
  headline           text not null check (char_length(headline) between 3 and 80),
  body               text check (char_length(body) <= 200),
  image_url          text,
  link_url           text not null check (link_url ~ '^https://'),
  amount_pence       integer not null check (amount_pence > 0),
  status             text not null default 'pending_payment' check (status in ('pending_payment', 'in_review', 'active', 'rejected', 'ended')),
  review_note        text,
  days               integer not null check (days between 1 and 90),
  stripe_session_id  text unique,
  paid_at            timestamptz,
  starts_at          timestamptz,
  ends_at            timestamptz,
  impressions        integer not null default 0,
  clicks             integer not null default 0,
  created_at         timestamptz not null default now()
);
create index if not exists ad_campaigns_active_idx on public.ad_campaigns (status, ends_at desc);
create index if not exists ad_campaigns_owner_idx on public.ad_campaigns (owner_id, created_at desc);

alter table public.ad_campaigns enable row level security;
drop policy if exists "ad campaigns own" on public.ad_campaigns;
create policy "ad campaigns own" on public.ad_campaigns for select using (auth.uid() = owner_id);

-- Counting views and clicks in one statement (no lost updates). Server only.
create or replace function public.grid_ad_count(p_id uuid, p_click boolean)
returns void language sql security definer set search_path = public as $$
  update public.ad_campaigns
     set impressions = impressions + case when p_click then 0 else 1 end,
         clicks      = clicks + case when p_click then 1 else 0 end
   where id = p_id and status = 'active';
$$;
revoke all on function public.grid_ad_count(uuid, boolean) from public, anon, authenticated;
grant execute on function public.grid_ad_count(uuid, boolean) to service_role;

commit;

-- Quick check: two rows, rls = true
select relname as table_name, relrowsecurity as rls
from pg_class
where relnamespace = 'public'::regnamespace and relname in ('promotions', 'ad_campaigns');
