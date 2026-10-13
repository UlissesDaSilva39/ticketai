-- ============================================================
--  TicketAI — Seed Data (idempotent)
--  Safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Ensure required columns exist (no-op if already present)
-- ------------------------------------------------------------
alter table if exists public.venues
  add column if not exists city text,
  add column if not exists slug text,
  add column if not exists capacity int;

alter table if exists public.artists
  add column if not exists genre text,
  add column if not exists city text,
  add column if not exists slug text,
  add column if not exists bio text,
  add column if not exists cover_image text;

alter table if exists public.events
  add column if not exists slug text,
  add column if not exists city text,
  add column if not exists genre text,
  add column if not exists status text default 'published';

-- ------------------------------------------------------------
-- 1. Test users (auth.users + profiles)
--    Uses Supabase's built-in auth.users, then mirrors to profiles.
-- ------------------------------------------------------------
do $$
declare
  v_fan_id uuid;
  v_promoter_id uuid;
  v_artist_user_id uuid;
begin
  -- Fan user
 cd C:\Users\User\ticketai

New-Item -ItemType Directory -Force -Path .\scripts | Out-Null

$sql = @'
-- ============================================================
--  TicketAI — Seed Data (idempotent)
--  Safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Ensure required columns exist (no-op if already present)
-- ------------------------------------------------------------
alter table if exists public.venues
  add column if not exists city text,
  add column if not exists slug text,
  add column if not exists capacity int;

alter table if exists public.artists
  add column if not exists genre text,
  add column if not exists city text,
  add column if not exists slug text,
  add column if not exists bio text,
  add column if not exists cover_image text;

alter table if exists public.events
  add column if not exists slug text,
  add column if not exists city text,
  add column if not exists genre text,
  add column if not exists status text default 'published';

-- ------------------------------------------------------------
-- 1. Test users (auth.users + profiles)
--    Uses Supabase's built-in auth.users, then mirrors to profiles.
-- ------------------------------------------------------------
do $$
declare
  v_fan_id uuid;
  v_promoter_id uuid;
  v_artist_user_id uuid;
begin
  -- Fan user
  select id into v_fan_id from auth.users where email = 'fan@ticketai.test';
  if v_fan_id is null then
    v_fan_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    values (v_fan_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            'fan@ticketai.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now());
  end if;

  -- Promoter user
  select id into v_promoter_id from auth.users where email = 'promoter@ticketai.test';
  if v_promoter_id is null then
    v_promoter_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    values (v_promoter_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            'promoter@ticketai.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now());
  end if;

  -- Artist user
  select id into v_artist_user_id from auth.users where email = 'artist@ticketai.test';
  if v_artist_user_id is null then
    v_artist_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    values (v_artist_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            'artist@ticketai.test', crypt('Test1234!', gen_salt('bf')), now(), now(), now());
  end if;

  -- Mirror into profiles if that table exists
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='profiles') then
    insert into public.profiles (id, username, full_name, role)
    values
      (v_fan_id, 'test_fan', 'Test Fan', 'attendee'),
      (v_promoter_id, 'test_promoter', 'Test Promoter', 'promoter'),
      (v_artist_user_id, 'test_artist', 'Test Artist', 'artist')
    on conflict (id) do update set
      username = excluded.username,
      full_name = excluded.full_name,
      role = excluded.role;
  end if;
end $$;

-- ------------------------------------------------------------
-- 2. Venues
-- ------------------------------------------------------------
insert into public.venues (id, name, slug, city, capacity, address, description)
values
  ('11111111-1111-1111-1111-111111111111', 'Fabric London',      'fabric-london',      'London',     1600, '77A Charterhouse St, London',       'Iconic underground club in Farringdon.'),
  ('22222222-2222-2222-2222-222222222222', 'Warehouse Project',  'warehouse-project',  'Manchester', 5000, 'Mayfield Depot, Manchester',        'Massive industrial space for large-scale events.'),
  ('33333333-3333-3333-3333-333333333333', 'Berghain',           'berghain',           'Berlin',     1500, 'Am Wriezener Bahnhof, Berlin',      'Legendary techno temple.')
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  city = excluded.city,
  capacity = excluded.capacity;

-- ------------------------------------------------------------
-- 3. Artists
-- ------------------------------------------------------------
insert into public.artists (id, name, slug, genre, city, bio, cover_image)
values
  ('aaaa1111-1111-1111-1111-111111111111', 'Peggy Gou',    'peggy-gou',    'House',  'Berlin',   'Korean-born DJ and producer based in Berlin.',        null),
  ('aaaa2222-2222-2222-2222-222222222222', 'Fred again..', 'fred-again',   'Electronic', 'London', 'British producer and DJ known for the Actual Life series.', null),
  ('aaaa3333-3333-3333-3333-333333333333', 'Charlotte de Witte', 'charlotte-de-witte', 'Techno', 'Brussels', 'Belgian techno DJ and producer, KNTXT label boss.', null)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  genre = excluded.genre,
  city = excluded.city;

-- ------------------------------------------------------------
-- 4. Events
-- ------------------------------------------------------------
insert into public.events (id, title, slug, description, venue_id, city, genre, starts_at, ends_at, capacity, status, price_pence)
values
  ('eeee1111-1111-1111-1111-111111111111', 'Peggy Gou — London',    'peggy-gou-london',    'Peggy Gou brings her signature house sound to Fabric.',       '11111111-1111-1111-1111-111111111111', 'London',     'House',      now() + interval '14 days', now() + interval '14 days 6 hours', 1600, 'published', 2500),
  ('eeee2222-2222-2222-2222-222222222222', 'Fred again.. — Manchester', 'fred-again-manchester', 'Fred again.. live at Warehouse Project.',                  '22222222-2222-2222-2222-222222222222', 'Manchester', 'Electronic', now() + interval '21 days', now() + interval '21 days 5 hours', 5000, 'published', 3500),
  ('eeee3333-3333-3333-3333-333333333333', 'Charlotte de Witte — Berlin', 'charlotte-berghain', 'Charlotte de Witte returns to Berghain.',                   '33333333-3333-3333-3333-333333333333', 'Berlin',     'Techno',     now() + interval '30 days', now() + interval '30 days 8 hours', 1500, 'published', 3000),
  ('eeee4444-4444-4444-4444-444444444444', 'House Night at Fabric',  'house-night-fabric',  'Weekly house night featuring local DJs.',                     '11111111-1111-1111-1111-111111111111', 'London',     'House',      now() + interval '7 days',  now() + interval '7 days 6 hours',  1600, 'published', 1500),
  ('eeee5555-5555-5555-5555-555555555555', 'Techno Marathon',        'techno-marathon-whp', 'All-night techno session.',                                   '22222222-2222-2222-2222-222222222222', 'Manchester', 'Techno',     now() + interval '45 days', now() + interval '45 days 10 hours', 5000, 'published', 4000)
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  starts_at = excluded.starts_at,
  status = excluded.status;

-- ------------------------------------------------------------
-- 5. Feed posts (only if table exists)
-- ------------------------------------------------------------
do $$
declare
  v_promoter_id uuid;
begin
  if not exists (select 1 from information_schema.tables where table_schema='public' and table_name='posts') then
    return;
  end if;

  select id into v_promoter_id from auth.users where email = 'promoter@ticketai.test' limit 1;

  insert into public.posts (id, author_id, body, created_at)
  values
    ('99991111-1111-1111-1111-111111111111', v_promoter_id, 'Just announced: Peggy Gou at Fabric in 2 weeks. Tickets flying.', now() - interval '2 hours'),
    ('99992222-2222-2222-2222-222222222222', v_promoter_id, 'Fred again.. Manchester is officially sold out. Waitlist open.',  now() - interval '1 day'),
    ('99993333-3333-3333-3333-333333333333', v_promoter_id, 'Techno Marathon lineup dropping next week.',                       now() - interval '3 days'),
    ('99994444-4444-4444-4444-444444444444', v_promoter_id, 'Reminder: Berghain is cash-only at the door.',                     now() - interval '5 days')
  on conflict (id) do nothing;
end $$;

-- ------------------------------------------------------------
-- 6. Follows (only if table exists)
-- ------------------------------------------------------------
do $$
declare
  v_fan_id uuid;
begin
  if not exists (select 1 from information_schema.tables where table_schema='public' and table_name='follows') then
    return;
  end if;

  select id into v_fan_id from auth.users where email = 'fan@ticketai.test' limit 1;

  insert into public.follows (follower_id, target_type, target_id)
  values
    (v_fan_id, 'artist',  'aaaa1111-1111-1111-1111-111111111111'),
    (v_fan_id, 'artist',  'aaaa2222-2222-2222-2222-222222222222'),
    (v_fan_id, 'venue',   '11111111-1111-1111-1111-111111111111')
  on conflict do nothing;
end $$;

-- ------------------------------------------------------------
-- 7. Verify counts
-- ------------------------------------------------------------
select 'users'   as table_name, count(*) from auth.users     where email like '%@ticketai.test'
union all
select 'venues'  as table_name, count(*) from public.venues  where id::text like '1111%' or id::text like '2222%' or id::text like '3333%'
union all
select 'artists' as table_name, count(*) from public.artists where id::text like 'aaaa%'
union all
select 'events'  as table_name, count(*) from public.events  where id::text like 'eeee%';