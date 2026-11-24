-- Profile headline ("Founder & MD @ Kaizen Ticketing | ...") and "Open to" badges
-- (open to collabs / bookings / session work / looking for talent).
-- Adds two nullable/defaulted columns; no existing data is changed.

alter table public.profiles
  add column if not exists headline text check (headline is null or char_length(headline) <= 120);

alter table public.profiles
  add column if not exists open_to text[] not null default '{}'
  check (open_to <@ array['collabs', 'bookings', 'session_work', 'hiring']::text[]);

-- Both are public profile information: let logged-out visitors read them too
-- (profiles uses column-level grants for anon, see 20261123230000).
grant select (headline, open_to) on public.profiles to anon;
