-- GRID Marketplace: real listings, private product files and orders.
-- New tables + one private storage bucket only; no existing data changes.

create table if not exists public.marketplace_listings (
  id                uuid primary key default gen_random_uuid(),
  seller_id         uuid not null references auth.users (id) on delete cascade,
  kind              text not null check (kind in ('beat', 'sample_pack', 'service', 'merch')),
  title             text not null check (char_length(title) between 3 and 120),
  description       text check (description is null or char_length(description) <= 2000),
  price_pence       integer not null check (price_pence between 100 and 500000),
  pay_what_you_want boolean not null default false,
  cover_url         text,
  status            text not null default 'active' check (status in ('active', 'paused', 'deleted')),
  sales_count       integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists marketplace_listings_active_idx on public.marketplace_listings (status, created_at desc);
create index if not exists marketplace_listings_seller_idx on public.marketplace_listings (seller_id);

-- The downloadable file is kept apart so its storage path is never readable from the browser.
create table if not exists public.marketplace_listing_files (
  listing_id uuid primary key references public.marketplace_listings (id) on delete cascade,
  file_path  text not null,
  file_name  text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_orders (
  id                    uuid primary key default gen_random_uuid(),
  listing_id            uuid not null references public.marketplace_listings (id) on delete restrict,
  buyer_id              uuid not null references auth.users (id) on delete cascade,
  seller_id             uuid not null references auth.users (id) on delete cascade,
  amount_pence          integer not null check (amount_pence > 0),   -- what the seller earns
  fee_pence             integer not null check (fee_pence >= 0),     -- GRID fee (10%)
  total_pence           integer not null check (total_pence > 0),    -- what the buyer paid
  currency              text not null default 'gbp',
  status                text not null default 'pending' check (status in ('pending', 'paid', 'refunded', 'cancelled')),
  stripe_session_id     text unique,
  stripe_payment_intent text,
  shipping              jsonb,
  created_at            timestamptz not null default now(),
  paid_at               timestamptz,
  check (buyer_id <> seller_id)
);
create index if not exists marketplace_orders_buyer_idx on public.marketplace_orders (buyer_id, created_at desc);
create index if not exists marketplace_orders_seller_idx on public.marketplace_orders (seller_id, created_at desc);

alter table public.marketplace_listings enable row level security;
alter table public.marketplace_listing_files enable row level security;
alter table public.marketplace_orders enable row level security;

-- Anyone may browse active listings; sellers also see their own paused ones.
drop policy if exists "marketplace listings readable" on public.marketplace_listings;
create policy "marketplace listings readable" on public.marketplace_listings
  for select using (status = 'active' or seller_id = auth.uid());

-- Buyers and sellers see their own orders.
drop policy if exists "marketplace orders own" on public.marketplace_orders;
create policy "marketplace orders own" on public.marketplace_orders
  for select to authenticated using (buyer_id = auth.uid() or seller_id = auth.uid());

-- All writes (create listing, checkout, payment confirmation) happen on the server
-- with the service key after validation, so there are no insert/update policies.
-- marketplace_listing_files has no policies at all: server-only.

-- Private bucket for product files (downloads use short-lived signed links).
insert into storage.buckets (id, name, public, file_size_limit)
values ('marketplace-files', 'marketplace-files', false, 52428800)
on conflict (id) do nothing;
