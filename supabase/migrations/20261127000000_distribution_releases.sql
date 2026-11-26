-- ============================================================
-- GRID Distribution (early access): release builder.
-- Artists prepare releases (details, artwork, tracks, credits) and
-- run store checks now; delivery to stores comes with a partner later.
-- New tables + one private bucket only. Safe to run more than once.
-- ============================================================
begin;

create table if not exists public.releases (
  id                  uuid primary key default gen_random_uuid(),
  owner_id            uuid not null references auth.users (id) on delete cascade,
  title               text not null default '' check (char_length(title) <= 200),
  primary_artist      text not null default '' check (char_length(primary_artist) <= 200),
  release_type        text not null default 'single' check (release_type in ('single', 'ep', 'album')),
  genre               text check (genre is null or char_length(genre) <= 60),
  language            text check (language is null or char_length(language) <= 40),
  label_name          text check (label_name is null or char_length(label_name) <= 200),
  copyright_line      text check (copyright_line is null or char_length(copyright_line) <= 200), -- e.g. "2026 Ulisses Silva"
  release_date        date,
  upc                 text check (upc is null or upc ~ '^[0-9]{12,13}$'),
  explicit            boolean not null default false,
  artwork_path        text,
  artwork_width       integer,
  artwork_height      integer,
  status              text not null default 'draft'
                        check (status in ('draft', 'ready', 'submitted', 'in_review', 'live', 'rejected', 'taken_down')),
  notify_on_launch    boolean not null default true,
  rights_confirmed_at timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists releases_owner_idx on public.releases (owner_id, updated_at desc);

create table if not exists public.release_tracks (
  id               uuid primary key default gen_random_uuid(),
  release_id       uuid not null references public.releases (id) on delete cascade,
  position         integer not null check (position between 1 and 100),
  title            text not null default '' check (char_length(title) <= 200),
  version          text check (version is null or char_length(version) <= 100),  -- e.g. "Extended Mix"
  featured_artists text check (featured_artists is null or char_length(featured_artists) <= 300),
  composers        text check (composers is null or char_length(composers) <= 300),
  producers        text check (producers is null or char_length(producers) <= 300),
  isrc             text check (isrc is null or isrc ~ '^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$'),
  explicit         boolean not null default false,
  audio_path       text,
  audio_name       text,
  created_at       timestamptz not null default now(),
  unique (release_id, position)
);
create index if not exists release_tracks_release_idx on public.release_tracks (release_id, position);

alter table public.releases       enable row level security;
alter table public.release_tracks enable row level security;

-- Owners can read their own releases and tracks. All writes go through the
-- server (validated, service key), so there are no insert/update policies.
drop policy if exists "releases own" on public.releases;
create policy "releases own" on public.releases
  for select to authenticated using (owner_id = auth.uid());

drop policy if exists "release tracks own" on public.release_tracks;
create policy "release tracks own" on public.release_tracks
  for select to authenticated using (
    exists (select 1 from public.releases r where r.id = release_id and r.owner_id = auth.uid())
  );

-- Private bucket for artwork and master audio (50 MB per file on the free plan).
insert into storage.buckets (id, name, public, file_size_limit)
values ('distribution-files', 'distribution-files', false, 52428800)
on conflict (id) do nothing;

commit;

-- Quick check: two rows, rls = true
select relname as table_name, relrowsecurity as rls
from pg_class
where relnamespace = 'public'::regnamespace and relname in ('releases', 'release_tracks');
