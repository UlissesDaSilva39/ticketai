create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text check (role in ('fan', 'artist', 'promoter', 'venue', 'label', 'industry')),
  city text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_status_idx on public.waitlist (status, created_at desc);
create index if not exists waitlist_email_idx on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

drop policy if exists "users can see their own waitlist entry" on public.waitlist;
create policy "users can see their own waitlist entry"
  on public.waitlist for select
  using (auth.uid() = user_id);

drop policy if exists "users can insert their own waitlist entry" on public.waitlist;
create policy "users can insert their own waitlist entry"
  on public.waitlist for insert
  with check (auth.uid() = user_id);

drop policy if exists "admins can manage waitlist" on public.waitlist;
create policy "admins can manage waitlist"
  on public.waitlist for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );