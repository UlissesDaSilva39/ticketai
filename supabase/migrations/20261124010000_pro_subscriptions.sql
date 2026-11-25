-- GRID Pro: who is Pro, kept in sync with Stripe. Adds two NEW tables only.

-- One row per member who has ever started Pro checkout; updated from Stripe.
create table if not exists public.subscriptions (
  user_id                uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text unique,
  plan                   text not null default 'pro' check (plan in ('pro')),
  status                 text not null, -- Stripe status: trialing, active, past_due, canceled, unpaid, incomplete, ...
  trial_end              timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx on public.subscriptions (stripe_customer_id);

-- Free Pro time given by GRID (e.g. the referral reward), separate from paid plans.
create table if not exists public.pro_grants (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  source      text not null check (source in ('referral', 'admin')),
  starts_at   timestamptz not null default now(),
  expires_at  timestamptz not null,
  note        text,
  created_at  timestamptz not null default now()
);

create index if not exists pro_grants_user_idx on public.pro_grants (user_id, expires_at desc);
-- The referral reward is given once per member.
create unique index if not exists pro_grants_one_referral_reward on public.pro_grants (user_id) where source = 'referral';

-- ---------- Row Level Security ----------
-- Members can read only their own rows. All writes come from the server
-- (Stripe webhook / checkout confirmation / referral reward) with the service key.
alter table public.subscriptions enable row level security;
alter table public.pro_grants enable row level security;

create policy "Members read own subscription"
  on public.subscriptions for select to authenticated
  using (user_id = auth.uid());

create policy "Members read own pro grants"
  on public.pro_grants for select to authenticated
  using (user_id = auth.uid());
