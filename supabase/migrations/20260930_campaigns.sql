create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),

  organizer_id uuid not null,
  event_id uuid not null,

  name text not null,
  objective text not null default 'sell_tickets',
  status text not null default 'draft',

  budget numeric(12,2) not null default 0,

  audience jsonb not null default '{}'::jsonb,
  channels jsonb not null default '[]'::jsonb,

  start_date timestamptz,
  end_date timestamptz,

  tracking_code text not null unique,

  impressions integer not null default 0,
  clicks integer not null default 0,
  ticket_page_visits integer not null default 0,
  tickets_sold integer not null default 0,

  revenue numeric(12,2) not null default 0,
  spend numeric(12,2) not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_organizer_id_idx
on public.campaigns (organizer_id);

create index if not exists campaigns_event_id_idx
on public.campaigns (event_id);

create index if not exists campaigns_status_idx
on public.campaigns (status);

create index if not exists campaigns_tracking_code_idx
on public.campaigns (tracking_code);

alter table public.campaigns enable row level security;

drop policy if exists "campaigns_select_own" on public.campaigns;
drop policy if exists "campaigns_insert_own" on public.campaigns;
drop policy if exists "campaigns_update_own" on public.campaigns;
drop policy if exists "campaigns_delete_own" on public.campaigns;

create policy "campaigns_select_own"
on public.campaigns
for select
using (auth.uid() = organizer_id);

create policy "campaigns_insert_own"
on public.campaigns
for insert
with check (auth.uid() = organizer_id);

create policy "campaigns_update_own"
on public.campaigns
for update
using (auth.uid() = organizer_id);

create policy "campaigns_delete_own"
on public.campaigns
for delete
using (auth.uid() = organizer_id);