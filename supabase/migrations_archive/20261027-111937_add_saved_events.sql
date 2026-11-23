-- Additive: creates saved_events table for Wallet
-- RLS enabled. Users can only see / modify their own rows.

create table if not exists public.saved_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  event_id   uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, event_id)
);

create index if not exists saved_events_user_idx on public.saved_events (user_id, created_at desc);
create index if not exists saved_events_event_idx on public.saved_events (event_id);

alter table public.saved_events enable row level security;

drop policy if exists "users can read own saves" on public.saved_events;
create policy "users can read own saves"
  on public.saved_events
  for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert own saves" on public.saved_events;
create policy "users can insert own saves"
  on public.saved_events
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "users can delete own saves" on public.saved_events;
create policy "users can delete own saves"
  on public.saved_events
  for delete
  using (auth.uid() = user_id);