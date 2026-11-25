-- ============================================================
-- GRID Licensing: members licence their tracks to other members
-- (creators, brands, film/TV/games) through a standard agreement,
-- paid with Stripe. New tables only; no existing data changes.
-- Runs as one transaction and is safe to run more than once.
-- ============================================================
begin;

-- 1. Tracks offered for licensing, with a price per licence type.
--    A null price means that licence type is not offered.
create table if not exists public.licence_listings (
  id                uuid primary key default gen_random_uuid(),
  owner_id          uuid not null references auth.users (id) on delete cascade,
  track_title       text not null check (char_length(track_title) between 1 and 120),
  artist_name       text not null check (char_length(artist_name) between 1 and 120),
  genre             text check (genre is null or char_length(genre) <= 40),
  isrc              text check (isrc is null or isrc ~ '^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$'),
  composer          text not null check (char_length(composer) between 1 and 200),
  publisher         text check (publisher is null or char_length(publisher) <= 200),
  description       text check (description is null or char_length(description) <= 1000),
  cover_url         text,
  preview_url       text,                       -- public preview (e.g. SoundCloud/YouTube link)
  price_creator     integer check (price_creator    is null or price_creator    between 100 and 500000),
  price_commercial  integer check (price_commercial is null or price_commercial between 100 and 500000),
  price_sync        integer check (price_sync       is null or price_sync       between 100 and 500000),
  -- The owner's sworn statements when listing (stored for disputes).
  rights_confirmed_at timestamptz not null,
  status            text not null default 'active' check (status in ('active', 'paused', 'deleted')),
  deals_count       integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  check (coalesce(price_creator, price_commercial, price_sync) is not null)
);
create index if not exists licence_listings_active_idx on public.licence_listings (status, created_at desc);
create index if not exists licence_listings_owner_idx  on public.licence_listings (owner_id);

-- 2. The master audio file, kept apart so its storage path is never public.
create table if not exists public.licence_listing_files (
  listing_id uuid primary key references public.licence_listings (id) on delete cascade,
  file_path  text not null,
  file_name  text not null,
  created_at timestamptz not null default now()
);

-- 3. Deals: one row per licence bought, with a frozen copy of the agreement
--    the buyer accepted (text + SHA-256), who accepted it, when and from where.
create table if not exists public.licence_deals (
  id                    uuid primary key default gen_random_uuid(),
  listing_id            uuid not null references public.licence_listings (id) on delete restrict,
  buyer_id              uuid not null references auth.users (id) on delete restrict,
  seller_id             uuid not null references auth.users (id) on delete restrict,
  licence_type          text not null check (licence_type in ('creator', 'commercial', 'sync')),
  project_title         text not null check (char_length(project_title) between 2 and 200),
  buyer_legal_name      text not null check (char_length(buyer_legal_name) between 2 and 200),
  amount_pence          integer not null check (amount_pence > 0),   -- what the licensor earns
  fee_pence             integer not null check (fee_pence >= 0),     -- GRID fee
  total_pence           integer not null check (total_pence > 0),    -- what the licensee paid
  currency              text not null default 'gbp',
  agreement_version     text not null,
  agreement_text        text not null,
  agreement_sha256      text not null check (agreement_sha256 ~ '^[0-9a-f]{64}$'),
  accepted_at           timestamptz not null default now(),
  accepted_ip           text,
  accepted_user_agent   text,
  status                text not null default 'pending'
                          check (status in ('pending', 'active', 'refunded', 'cancelled', 'revoked')),
  stripe_session_id     text unique,
  stripe_payment_intent text,
  created_at            timestamptz not null default now(),
  paid_at               timestamptz,
  check (buyer_id <> seller_id)
);
create index if not exists licence_deals_buyer_idx  on public.licence_deals (buyer_id, created_at desc);
create index if not exists licence_deals_seller_idx on public.licence_deals (seller_id, created_at desc);
create index if not exists licence_deals_listing_idx on public.licence_deals (listing_id);

-- 4. Security
alter table public.licence_listings      enable row level security;
alter table public.licence_listing_files enable row level security;
alter table public.licence_deals         enable row level security;

-- Anyone can browse active listings; owners also see their paused ones.
drop policy if exists "licence listings readable" on public.licence_listings;
create policy "licence listings readable" on public.licence_listings
  for select using (status = 'active' or owner_id = auth.uid());

-- Licensee and licensor can see their own deals (the signed agreement).
drop policy if exists "licence deals own" on public.licence_deals;
create policy "licence deals own" on public.licence_deals
  for select to authenticated using (buyer_id = auth.uid() or seller_id = auth.uid());

-- All writes happen on the server with the service key after validation,
-- so there are no insert/update/delete policies. licence_listing_files has
-- no policies at all: server only. Master files use the existing private
-- 'marketplace-files' bucket and are downloaded through short-lived links.

commit;

-- Quick check: three rows, rls = true
select relname as table_name, relrowsecurity as rls
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('licence_listings', 'licence_listing_files', 'licence_deals');
