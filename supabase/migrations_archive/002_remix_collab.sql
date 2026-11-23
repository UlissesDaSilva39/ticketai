-- ============================================================
-- GRID Remix + Collaboration schema
-- Paste into Supabase → SQL Editor → Run
-- ============================================================

create table if not exists remix_requests (
  id uuid primary key default gen_random_uuid(),
  original_artist_slug text not null,
  original_track_id uuid,
  remixer_id uuid not null references auth.users(id) on delete cascade,
  remixer_name text,
  remixer_email text,
  proposed_split jsonb not null,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists remix_requests_remixer_idx on remix_requests (remixer_id, status);
create index if not exists remix_requests_artist_idx on remix_requests (original_artist_slug, status);

create table if not exists collab_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  role_needed text not null,
  genre text,
  bpm integer,
  description text not null,
  reference_url text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create index if not exists collab_posts_open_idx on collab_posts (status, created_at desc);

create table if not exists collab_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references collab_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_name text,
  message text not null,
  demo_url text,
  created_at timestamptz not null default now()
);

create index if not exists collab_replies_post_idx on collab_replies (post_id, created_at);

alter table remix_requests enable row level security;
alter table collab_posts enable row level security;
alter table collab_replies enable row level security;

drop policy if exists "remix_requests_select_own" on remix_requests;
create policy "remix_requests_select_own" on remix_requests
  for select using (
    auth.uid() = remixer_id or
    original_artist_slug = (select coalesce(raw_user_meta_data->>'slug','') from auth.users where id = auth.uid())
  );

drop policy if exists "remix_requests_insert_own" on remix_requests;
create policy "remix_requests_insert_own" on remix_requests
  for insert with check (auth.uid() = remixer_id);

drop policy if exists "remix_requests_update_own" on remix_requests;
create policy "remix_requests_update_own" on remix_requests
  for update using (auth.uid() = remixer_id);

drop policy if exists "collab_posts_select_all" on collab_posts;
create policy "collab_posts_select_all" on collab_posts for select using (true);

drop policy if exists "collab_posts_insert_own" on collab_posts;
create policy "collab_posts_insert_own" on collab_posts for insert with check (auth.uid() = author_id);

drop policy if exists "collab_posts_update_own" on collab_posts;
create policy "collab_posts_update_own" on collab_posts for update using (auth.uid() = author_id);

drop policy if exists "collab_replies_select_all" on collab_replies;
create policy "collab_replies_select_all" on collab_replies for select using (true);

drop policy if exists "collab_replies_insert_own" on collab_replies;
create policy "collab_replies_insert_own" on collab_replies for insert with check (auth.uid() = author_id);