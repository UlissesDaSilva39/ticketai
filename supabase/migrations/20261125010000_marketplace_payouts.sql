-- Seller withdrawals for the GRID Marketplace. New table only.
-- A seller requests a payout of their cleared balance; GRID pays it and marks it paid.

create table if not exists public.marketplace_payouts (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid not null references auth.users (id) on delete cascade,
  amount_pence integer not null check (amount_pence > 0),
  status       text not null default 'requested' check (status in ('requested', 'paid', 'rejected')),
  note         text,
  created_at   timestamptz not null default now(),
  paid_at      timestamptz
);
create index if not exists marketplace_payouts_seller_idx on public.marketplace_payouts (seller_id, created_at desc);

alter table public.marketplace_payouts enable row level security;

-- Sellers can see their own withdrawals; requests are created on the server after
-- checking the balance, so there is no insert/update policy.
drop policy if exists "marketplace payouts own" on public.marketplace_payouts;
create policy "marketplace payouts own" on public.marketplace_payouts
  for select to authenticated using (seller_id = auth.uid());
