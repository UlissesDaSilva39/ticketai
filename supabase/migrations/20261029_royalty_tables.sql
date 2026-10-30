-- ============================================================
-- Royalty Management tables
-- Run this in Supabase SQL Editor
-- ============================================================

create table if not exists royalty_statements (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references auth.users(id) on delete cascade,
  source text not null,
  period text not null,
  gross_cents integer not null default 0,
  fees_cents integer not null default 0,
  net_cents integer not null default 0,
  status text not null default 'pending' check (status in ('matched','unmatched','pending')),
  file_url text,
  imported_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists idx_royalty_statements_artist on royalty_statements(artist_id);
create index if not exists idx_royalty_statements_status on royalty_statements(status);

create table if not exists royalty_splits (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references auth.users(id) on delete cascade,
  track_title text not null,
  isrc text,
  collaborator_name text not null,
  collaborator_email text,
  collaborator_user_id uuid references auth.users(id) on delete set null,
  percentage numeric(5,2) not null check (percentage >= 0 and percentage <= 100),
  role text,
  status text not null default 'pending' check (status in ('assigned','pending','disputed')),
  created_at timestamptz not null default now()
);
create index if not exists idx_royalty_splits_artist on royalty_splits(artist_id);

create table if not exists royalty_payouts (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null,
  method text not null default 'bank' check (method in ('bank','paypal','stripe')),
  status text not null default 'pending' check (status in ('pending','processing','paid','failed')),
  period_label text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_royalty_payouts_artist on royalty_payouts(artist_id);

alter table royalty_statements enable row level security;
alter table royalty_splits enable row level security;
alter table royalty_payouts enable row level security;

drop policy if exists "artist can read own statements" on royalty_statements;
create policy "artist can read own statements" on royalty_statements
  for select using (auth.uid() = artist_id);

drop policy if exists "artist can insert own statements" on royalty_statements;
create policy "artist can insert own statements" on royalty_statements
  for insert with check (auth.uid() = artist_id);

drop policy if exists "artist can read own splits" on royalty_splits;
create policy "artist can read own splits" on royalty_splits
  for select using (auth.uid() = artist_id);

drop policy if exists "artist can insert own splits" on royalty_splits;
create policy "artist can insert own splits" on royalty_splits
  for insert with check (auth.uid() = artist_id);

drop policy if exists "artist can read own payouts" on royalty_payouts;
create policy "artist can read own payouts" on royalty_payouts
  for select using (auth.uid() = artist_id);
