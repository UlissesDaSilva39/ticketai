-- ============================================================
--  venue_follows — mirrors artist_follows
-- ============================================================
create table if not exists public.venue_follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references auth.users(id) on delete cascade,
  venue_slug text not null,
  created_at timestamptz not null default now(),
  unique (follower_id, venue_slug)
);

create index if not exists venue_follows_venue_idx on public.venue_follows(venue_slug);
create index if not exists venue_follows_follower_idx on public.venue_follows(follower_id);

-- Enable RLS
alter table public.venue_follows enable row level security;

-- Everyone can read counts
drop policy if exists "venue_follows_read_all" on public.venue_follows;
create policy "venue_follows_read_all" on public.venue_follows
  for select using (true);

-- Signed-in users can follow themselves
drop policy if exists "venue_follows_insert_self" on public.venue_follows;
create policy "venue_follows_insert_self" on public.venue_follows
  for insert with check (auth.uid() = follower_id);

-- Signed-in users can unfollow themselves
drop policy if exists "venue_follows_delete_self" on public.venue_follows;
create policy "venue_follows_delete_self" on public.venue_follows
  for delete using (auth.uid() = follower_id);