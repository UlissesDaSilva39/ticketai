-- Invites & referrals: every member gets a personal invite code; sign-ups that
-- come through a code are recorded. Adds two NEW tables only; no existing data changes.

create table if not exists public.referral_codes (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  code       text not null unique check (code ~ '^[A-Z0-9]{6,12}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id           uuid primary key default gen_random_uuid(),
  referrer_id  uuid not null references auth.users (id) on delete cascade,
  referred_id  uuid not null unique references auth.users (id) on delete cascade, -- a person can only be referred once
  code         text not null,
  created_at   timestamptz not null default now(),
  check (referrer_id <> referred_id)
);

create index if not exists referrals_referrer_idx on public.referrals (referrer_id, created_at desc);

-- ---------- Row Level Security ----------
-- Members can read only their own code and their own referrals.
-- All writes happen on the server with the service key (no insert/update policies),
-- so nobody can fake a referral from the browser.
alter table public.referral_codes enable row level security;
alter table public.referrals enable row level security;

create policy "Members read own invite code"
  on public.referral_codes for select to authenticated
  using (user_id = auth.uid());

create policy "Members read own referrals"
  on public.referrals for select to authenticated
  using (referrer_id = auth.uid() or referred_id = auth.uid());
