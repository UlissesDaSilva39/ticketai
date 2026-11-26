-- ============================================================
-- GRID Newsletters: members create music newsletters, write articles
-- (with track embeds), publish them, and others subscribe.
-- New tables only; safe to run more than once; one transaction.
-- Images use the existing public 'post-media' bucket.
-- ============================================================
begin;

create table if not exists public.newsletters (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users (id) on delete cascade,
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 80),
  name        text not null check (char_length(name) between 3 and 80),
  description text not null check (char_length(description) between 10 and 300),
  category    text not null check (category in ('releases', 'gig-diary', 'studio', 'scene', 'gear', 'business', 'other')),
  frequency   text not null check (frequency in ('daily', 'weekly', 'biweekly', 'monthly')),
  cover_url   text,
  status      text not null default 'active' check (status in ('active', 'archived')),
  created_at  timestamptz not null default now()
);
create index if not exists newsletters_owner_idx on public.newsletters (owner_id);

create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  author_id     uuid not null references auth.users (id) on delete cascade,
  newsletter_id uuid references public.newsletters (id) on delete set null,   -- null = individual article
  title         text not null default '' check (char_length(title) <= 150),
  summary       text check (summary is null or char_length(summary) <= 300),
  body          text not null default '' check (char_length(body) <= 100000), -- GRID Markdown
  cover_url     text,
  status        text not null default 'draft' check (status in ('draft', 'published')),
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists articles_author_idx on public.articles (author_id, updated_at desc);
create index if not exists articles_published_idx on public.articles (status, published_at desc);
create index if not exists articles_newsletter_idx on public.articles (newsletter_id, published_at desc);

create table if not exists public.newsletter_subscriptions (
  newsletter_id uuid not null references public.newsletters (id) on delete cascade,
  user_id       uuid not null references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (newsletter_id, user_id)
);
create index if not exists newsletter_subscriptions_user_idx on public.newsletter_subscriptions (user_id);

alter table public.newsletters              enable row level security;
alter table public.articles                 enable row level security;
alter table public.newsletter_subscriptions enable row level security;

-- Anyone can read active newsletters; owners also see archived ones.
drop policy if exists "newsletters readable" on public.newsletters;
create policy "newsletters readable" on public.newsletters
  for select using (status = 'active' or owner_id = auth.uid());

-- Anyone can read published articles; authors also see their drafts.
drop policy if exists "articles readable" on public.articles;
create policy "articles readable" on public.articles
  for select using (status = 'published' or author_id = auth.uid());

-- Members see their own subscriptions (counts are computed on the server).
drop policy if exists "subscriptions own" on public.newsletter_subscriptions;
create policy "subscriptions own" on public.newsletter_subscriptions
  for select to authenticated using (user_id = auth.uid());

-- All writes go through the server (validated, service key): no write policies.

commit;

select relname as table_name, relrowsecurity as rls
from pg_class where relnamespace = 'public'::regnamespace
  and relname in ('newsletters', 'articles', 'newsletter_subscriptions');
