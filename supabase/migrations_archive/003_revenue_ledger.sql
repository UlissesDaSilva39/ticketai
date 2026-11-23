-- ============================================================
-- GRID Revenue Ledger
-- Run this in Supabase → SQL Editor
-- ============================================================

create table if not exists revenue_ledger (
  id uuid primary key default gen_random_uuid(),
  remix_request_id uuid references remix_requests(id) on delete cascade,
  logged_by uuid references auth.users(id) not null,
  amount_cents integer not null,
  currency text default 'USD',
  source text not null, -- 'stream', 'sale', 'sync', 'live'
  notes text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table revenue_ledger enable row level security;

-- Policies: only the two parties in the remix_request can view/insert
drop policy if exists "ledger_select_own" on revenue_ledger;
create policy "ledger_select_own" on revenue_ledger for select using (
  exists (
    select 1 from remix_requests r 
    where r.id = remix_request_id 
    and (r.remixer_id = auth.uid() or r.original_artist_slug = (select coalesce(raw_user_meta_data->>'slug','') from auth.users where id = auth.uid()))
  )
);

drop policy if exists "ledger_insert_own" on revenue_ledger;
create policy "ledger_insert_own" on revenue_ledger for insert with check (
  exists (
    select 1 from remix_requests r 
    where r.id = remix_request_id 
    and (r.remixer_id = auth.uid() or r.original_artist_slug = (select coalesce(raw_user_meta_data->>'slug','') from auth.users where id = auth.uid()))
  )
);