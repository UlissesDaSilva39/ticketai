-- 1. Drop the broken table and its policies
drop table if exists public.threads cascade;

-- 2. Create the table correctly
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  participant_a uuid not null references auth.users(id) on delete cascade,
  participant_b uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint no_self_thread check (participant_a <> participant_b),
  constraint unique_pair unique (participant_a, participant_b)
);

-- 3. Enable security
alter table public.threads enable row level security;

-- 4. Create policies
create policy "users see own threads"
on public.threads for select
to authenticated
using (
  (select auth.uid()) = participant_a
  or (select auth.uid()) = participant_b
);

create policy "users create threads"
on public.threads for insert
to authenticated
with check ( (select auth.uid()) = participant_a );

-- 5. Indexes
create index threads_participant_a_idx on public.threads (participant_a);
create index threads_participant_b_idx on public.threads (participant_b);

-- 6. Force the API to reload the schema cache
notify pgrst, 'reload schema';