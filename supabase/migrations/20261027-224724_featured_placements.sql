-- Featured placements: artists pay to appear at top of /music and Discover
create table if not exists public.featured_placements (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null,
  artist_name text not null,
  placement_type text not null check (placement_type in ('music_page', 'discover_feed', 'both')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  amount_paid_gbp numeric(10, 2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'refunded')),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists featured_active_idx on public.featured_placements (ends_at);
create index if not exists featured_type_idx on public.featured_placements (placement_type);

alter table public.featured_placements enable row level security;

drop policy if exists "anyone can read active features" on public.featured_placements;
create policy "anyone can read active features"
  on public.featured_placements for select
  using (ends_at > now() and payment_status = 'paid');

drop policy if exists "admins can manage features" on public.featured_placements;
create policy "admins can manage features"
  on public.featured_placements for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


