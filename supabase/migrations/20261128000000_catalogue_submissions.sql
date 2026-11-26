-- ============================================================
-- GRID Programme: "Submit your catalogue" form on /licensing.
-- Submissions used to be saved only in the visitor's browser, so GRID
-- never received them. New table only; safe to run more than once.
-- Read them in Supabase: Table Editor -> catalogue_submissions.
-- ============================================================
begin;

create table if not exists public.catalogue_submissions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users (id) on delete set null,  -- set when the sender was logged in
  artist_name  text not null check (char_length(artist_name) between 1 and 200),
  email        text not null check (char_length(email) between 3 and 254),
  track_title  text not null check (char_length(track_title) between 1 and 200),
  isrc         text check (isrc is null or char_length(isrc) <= 20),
  master_owner text not null check (char_length(master_owner) between 1 and 200),
  composer     text not null check (char_length(composer) between 1 and 300),
  publisher    text check (publisher is null or char_length(publisher) <= 200),
  message      text check (message is null or char_length(message) <= 2000),
  status       text not null default 'new' check (status in ('new', 'reviewing', 'accepted', 'declined')),
  created_at   timestamptz not null default now()
);
create index if not exists catalogue_submissions_created_idx on public.catalogue_submissions (created_at desc);

-- Server-only: no policies, so nobody can read or write it from the browser.
-- The /api/licensing/catalogue route inserts with the service key.
alter table public.catalogue_submissions enable row level security;

commit;

select relname as table_name, relrowsecurity as rls
from pg_class where relnamespace = 'public'::regnamespace and relname = 'catalogue_submissions';
