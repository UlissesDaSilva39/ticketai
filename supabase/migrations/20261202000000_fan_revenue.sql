-- Revenue phase 2: paid demo submissions + priority messages, Backstage fan
-- memberships, and coin tips. Safe to run more than once. Existing data is not changed.
begin;

-- 1) Reviewers: labels, curators, promoters and A&Rs who accept paid submissions.
create table if not exists public.reviewers (
  user_id          uuid primary key references auth.users (id) on delete cascade,
  headline         text not null check (char_length(headline) between 3 and 120),
  genres           text[] not null default '{}',
  accepts_demos    boolean not null default true,
  accepts_messages boolean not null default true,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.reviewers enable row level security;
drop policy if exists "reviewers public" on public.reviewers;
create policy "reviewers public" on public.reviewers for select using (active);

-- 2) Submissions: a paid demo (track link) or a priority message.
--    The reviewer must reply within 7 days or the sender is refunded.
create table if not exists public.submissions (
  id                  uuid primary key default gen_random_uuid(),
  kind                text not null check (kind in ('demo', 'message')),
  sender_id           uuid not null references auth.users (id) on delete cascade,
  reviewer_id         uuid not null references auth.users (id) on delete cascade,
  title               text check (char_length(title) <= 120),
  track_url           text check (track_url is null or track_url ~ '^https://'),
  message             text not null check (char_length(message) between 1 and 1000),
  amount_pence        integer not null check (amount_pence > 0),
  reviewer_earn_pence integer not null check (reviewer_earn_pence >= 0),
  status              text not null default 'pending_payment' check (status in ('pending_payment', 'sent', 'replied', 'refunded')),
  verdict             text check (verdict in ('pass', 'maybe', 'love')),
  reply               text check (char_length(reply) <= 2000),
  stripe_session_id   text unique,
  paid_at             timestamptz,
  due_at              timestamptz,
  replied_at          timestamptz,
  created_at          timestamptz not null default now(),
  check (sender_id <> reviewer_id)
);
create index if not exists submissions_reviewer_idx on public.submissions (reviewer_id, status, paid_at desc);
create index if not exists submissions_sender_idx on public.submissions (sender_id, created_at desc);
create index if not exists submissions_due_idx on public.submissions (status, due_at);
alter table public.submissions enable row level security;
drop policy if exists "submissions parties" on public.submissions;
create policy "submissions parties" on public.submissions for select using (auth.uid() in (sender_id, reviewer_id));

-- 3) Backstage: fans pay artists monthly for exclusive posts.
create table if not exists public.backstage_tiers (
  id           uuid primary key default gen_random_uuid(),
  artist_id    uuid not null references auth.users (id) on delete cascade,
  name         text not null check (char_length(name) between 2 and 40),
  price_pence  integer not null check (price_pence in (300, 500, 1000)),
  perks        text check (char_length(perks) <= 300),
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  unique (artist_id, price_pence)
);
alter table public.backstage_tiers enable row level security;
drop policy if exists "backstage tiers public" on public.backstage_tiers;
create policy "backstage tiers public" on public.backstage_tiers for select using (active);

create table if not exists public.backstage_members (
  id                      uuid primary key default gen_random_uuid(),
  artist_id               uuid not null references auth.users (id) on delete cascade,
  fan_id                  uuid not null references auth.users (id) on delete cascade,
  tier_id                 uuid references public.backstage_tiers (id) on delete set null,
  price_pence             integer not null,
  status                  text not null default 'incomplete',
  stripe_subscription_id  text unique,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (artist_id, fan_id),
  check (artist_id <> fan_id)
);
create index if not exists backstage_members_artist_idx on public.backstage_members (artist_id, status);
alter table public.backstage_members enable row level security;
drop policy if exists "backstage members parties" on public.backstage_members;
create policy "backstage members parties" on public.backstage_members for select using (auth.uid() in (artist_id, fan_id));

-- Every paid month (artist keeps 90%); feeds the artist's GRID balance.
create table if not exists public.backstage_payments (
  id                 uuid primary key default gen_random_uuid(),
  artist_id          uuid not null references auth.users (id) on delete cascade,
  fan_id             uuid not null references auth.users (id) on delete cascade,
  stripe_invoice_id  text unique not null,
  amount_pence       integer not null,
  artist_earn_pence  integer not null,
  paid_at            timestamptz not null default now()
);
alter table public.backstage_payments enable row level security;
drop policy if exists "backstage payments artist" on public.backstage_payments;
create policy "backstage payments artist" on public.backstage_payments for select using (auth.uid() = artist_id);

-- Members-only posts (served by the server after checking membership).
create table if not exists public.backstage_posts (
  id          uuid primary key default gen_random_uuid(),
  artist_id   uuid not null references auth.users (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 5000),
  media_url   text check (media_url is null or media_url ~ '^https://'),
  created_at  timestamptz not null default now()
);
create index if not exists backstage_posts_artist_idx on public.backstage_posts (artist_id, created_at desc);
alter table public.backstage_posts enable row level security;
-- No select policy: only the server (service key) reads these.

-- 4) Tips with GRID coins on posts and profiles (creator keeps 70%).
create table if not exists public.tip_sends (
  id               uuid primary key default gen_random_uuid(),
  sender_id        uuid not null references auth.users (id) on delete cascade,
  creator_id       uuid not null references auth.users (id) on delete cascade,
  target_type      text not null check (target_type in ('post', 'profile')),
  target_id        uuid not null,
  coins            integer not null check (coins > 0),
  creator_earn_pence integer not null,
  status           text not null default 'active' check (status in ('active', 'reversed')),
  created_at       timestamptz not null default now(),
  check (sender_id <> creator_id)
);
create index if not exists tip_sends_creator_idx on public.tip_sends (creator_id, created_at desc);
alter table public.tip_sends enable row level security;
drop policy if exists "tips parties" on public.tip_sends;
create policy "tips parties" on public.tip_sends for select using (auth.uid() in (sender_id, creator_id));

create or replace function public.grid_send_tip(
  p_sender uuid, p_creator uuid, p_target_type text, p_target uuid, p_coins integer, p_share numeric
) returns integer
language plpgsql security definer set search_path = public as $$
declare v_balance integer;
begin
  if p_coins <= 0 then raise exception 'invalid_amount'; end if;
  if p_sender = p_creator then raise exception 'own_content'; end if;
  update coin_wallets set balance_coins = balance_coins - p_coins, updated_at = now()
   where user_id = p_sender and balance_coins >= p_coins
  returning balance_coins into v_balance;
  if v_balance is null then raise exception 'insufficient_coins'; end if;
  insert into tip_sends (sender_id, creator_id, target_type, target_id, coins, creator_earn_pence)
  values (p_sender, p_creator, p_target_type, p_target, p_coins, floor(p_coins * p_share));
  return v_balance;
end;
$$;
revoke all on function public.grid_send_tip(uuid, uuid, text, uuid, integer, numeric) from public, anon, authenticated;
grant execute on function public.grid_send_tip(uuid, uuid, text, uuid, integer, numeric) to service_role;

commit;

-- Quick check: seven rows, rls = true
select relname as table_name, relrowsecurity as rls
from pg_class
where relnamespace = 'public'::regnamespace
  and relname in ('reviewers', 'submissions', 'backstage_tiers', 'backstage_members', 'backstage_payments', 'backstage_posts', 'tip_sends');
