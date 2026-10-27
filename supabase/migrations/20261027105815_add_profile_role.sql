-- Additive only. Nullable with default, so existing rows are unaffected.
alter table public.profiles
  add column if not exists role text
  check (role in ('fan','artist','industry'))
  default 'fan';
