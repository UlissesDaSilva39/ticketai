-- Revenue phase 3: automatic payouts with Stripe Connect.
-- Safe to run more than once. Existing data is not changed.
begin;

-- Each member's connected Stripe account (Express) for receiving payouts.
create table if not exists public.payout_accounts (
  user_id            uuid primary key references auth.users (id) on delete cascade,
  stripe_account_id  text unique not null,
  payouts_enabled    boolean not null default false,
  details_submitted  boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
alter table public.payout_accounts enable row level security;
drop policy if exists "payout accounts own" on public.payout_accounts;
create policy "payout accounts own" on public.payout_accounts for select using (auth.uid() = user_id);

-- Withdrawals remember how they were paid (Stripe transfer or by hand).
alter table public.marketplace_payouts add column if not exists method text;
alter table public.marketplace_payouts add column if not exists stripe_transfer_id text;

commit;

-- Quick check: one row, rls = true
select relname as table_name, relrowsecurity as rls
from pg_class
where relnamespace = 'public'::regnamespace and relname in ('payout_accounts');
