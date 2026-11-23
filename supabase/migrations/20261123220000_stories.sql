-- Stories: photo/video posts that disappear after 24 hours.
-- Adds two NEW tables only; no existing table or data is changed.

create table if not exists public.stories (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references auth.users (id) on delete cascade,
  media_url   text not null check (length(media_url) <= 1000),
  media_type  text not null check (media_type in ('image', 'video')),
  caption     text check (caption is null or length(caption) <= 200),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '24 hours')
);

create index if not exists stories_active_idx on public.stories (expires_at desc, created_at desc);
create index if not exists stories_author_idx on public.stories (author_id, created_at desc);

-- Who has seen which story (for the green "unseen" ring).
create table if not exists public.story_views (
  story_id   uuid not null references public.stories (id) on delete cascade,
  viewer_id  uuid not null references auth.users (id) on delete cascade,
  viewed_at  timestamptz not null default now(),
  primary key (story_id, viewer_id)
);

create index if not exists story_views_viewer_idx on public.story_views (viewer_id);

-- ---------- Row Level Security ----------
alter table public.stories enable row level security;
alter table public.story_views enable row level security;

-- Logged-in members see stories that haven't expired; authors also see their own expired ones.
create policy "Members read active stories"
  on public.stories for select to authenticated
  using (expires_at > now() or author_id = auth.uid());

create policy "Members post own stories"
  on public.stories for insert to authenticated
  with check (author_id = auth.uid());

create policy "Authors delete own stories"
  on public.stories for delete to authenticated
  using (author_id = auth.uid());

-- A viewer records and reads their own views; a story's author can see who viewed it.
create policy "Viewers record own views"
  on public.story_views for insert to authenticated
  with check (viewer_id = auth.uid());

create policy "Viewers and authors read views"
  on public.story_views for select to authenticated
  using (
    viewer_id = auth.uid()
    or exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid())
  );
