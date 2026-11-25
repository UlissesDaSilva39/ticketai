-- Premium tier (£15/month), post boosts, and who-started-a-chat tracking.
-- Existing data is not changed: one constraint is widened, one nullable column
-- is added, and one new table is created.

-- 1) Subscriptions can now be 'pro' or 'premium'.
alter table public.subscriptions drop constraint if exists subscriptions_plan_check;
alter table public.subscriptions add constraint subscriptions_plan_check check (plan in ('pro', 'premium'));

-- 2) Remember who started each conversation, for the weekly new-chat limits
--    (Free 5, Pro 30, Premium unlimited). Old conversations stay NULL.
alter table public.conversations add column if not exists started_by uuid references auth.users (id) on delete set null;
create index if not exists conversations_started_by_idx on public.conversations (started_by, created_at desc);

-- 3) Post boosts: a boosted post is pinned at the top of the feed until ends_at.
--    Premium members get one free boost per calendar month.
create table if not exists public.post_boosts (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  source      text not null default 'premium_monthly' check (source in ('premium_monthly', 'admin')),
  starts_at   timestamptz not null default now(),
  ends_at     timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists post_boosts_active_idx on public.post_boosts (ends_at desc);
create index if not exists post_boosts_user_idx on public.post_boosts (user_id, starts_at desc);

alter table public.post_boosts enable row level security;

-- Boosts are public information (the feed shows "Boosted"); only the server creates them.
create policy "Anyone reads boosts"
  on public.post_boosts for select
  using (true);
