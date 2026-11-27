-- ============================================================
-- GRID LIVE: live rooms (YouTube Live / Twitch embed) with chat,
-- paid gifts (coins), goals, top supporters and shoppable products.
--
-- Money model: fans buy coin packs by card (Stripe). 1 coin = 1p of
-- gift value. Sending a gift spends coins; the host earns 70% of the
-- gift value into their seller balance, GRID keeps 30%.
--
-- New tables + two functions only. Safe to run more than once.
-- ============================================================
begin;

-- 1. Live rooms
create table if not exists public.live_streams (
  id             uuid primary key default gen_random_uuid(),
  host_id        uuid not null references auth.users (id) on delete cascade,
  title          text not null check (char_length(title) between 3 and 120),
  description    text check (description is null or char_length(description) <= 1000),
  category       text not null check (category in ('performance', 'dj-set', 'studio', 'listening-party', 'q-and-a', 'other')),
  provider       text not null check (provider in ('youtube', 'twitch')),
  provider_ref   text not null check (char_length(provider_ref) between 2 and 64), -- YouTube video id or Twitch channel
  status         text not null default 'scheduled' check (status in ('scheduled', 'live', 'ended')),
  scheduled_for  timestamptz,
  started_at     timestamptz,
  ended_at       timestamptz,
  goal_coins     integer check (goal_coins is null or goal_coins between 100 and 10000000),
  goal_label     text check (goal_label is null or char_length(goal_label) <= 80),
  cover_url      text,
  created_at     timestamptz not null default now()
);
create index if not exists live_streams_status_idx on public.live_streams (status, started_at desc);
create index if not exists live_streams_host_idx on public.live_streams (host_id, created_at desc);

-- 2. Chat, gift and purchase events shown in the room
create table if not exists public.live_messages (
  id          bigint generated always as identity primary key,
  stream_id   uuid not null references public.live_streams (id) on delete cascade,
  user_id     uuid references auth.users (id) on delete set null,
  kind        text not null default 'chat' check (kind in ('chat', 'gift', 'purchase', 'system')),
  body        text not null check (char_length(body) between 1 and 300),
  gift_id     text,
  coins       integer,
  created_at  timestamptz not null default now()
);
create index if not exists live_messages_stream_idx on public.live_messages (stream_id, id);

-- 3. Pinned products (merch, beats, licences, tickets, links)
create table if not exists public.live_products (
  id          uuid primary key default gen_random_uuid(),
  stream_id   uuid not null references public.live_streams (id) on delete cascade,
  kind        text not null check (kind in ('marketplace', 'licence', 'link')),
  ref_id      uuid,                      -- marketplace_listings.id or licence_listings.id
  url         text,                      -- for 'link' (tickets, merch store, pre-save…)
  title       text not null check (char_length(title) between 1 and 120),
  price_pence integer check (price_pence is null or price_pence between 0 and 1000000),
  image_url   text,
  position    integer not null default 0,
  pinned      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists live_products_stream_idx on public.live_products (stream_id, position);

-- 4. Coins
create table if not exists public.coin_wallets (
  user_id        uuid primary key references auth.users (id) on delete cascade,
  balance_coins  integer not null default 0 check (balance_coins >= 0),
  updated_at     timestamptz not null default now()
);

create table if not exists public.coin_purchases (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users (id) on delete cascade,
  pack_id           text not null,
  coins             integer not null check (coins > 0),
  amount_pence      integer not null check (amount_pence > 0),
  status            text not null default 'pending' check (status in ('pending', 'paid', 'cancelled', 'refunded')),
  stripe_session_id text unique,
  return_to         text,
  created_at        timestamptz not null default now(),
  paid_at           timestamptz
);
create index if not exists coin_purchases_user_idx on public.coin_purchases (user_id, created_at desc);

-- 5. Gifts (the money record; host earnings feed the seller balance)
create table if not exists public.gift_sends (
  id               uuid primary key default gen_random_uuid(),
  stream_id        uuid not null references public.live_streams (id) on delete restrict,
  sender_id        uuid not null references auth.users (id) on delete restrict,
  host_id          uuid not null references auth.users (id) on delete restrict,
  gift_id          text not null,
  coins            integer not null check (coins > 0),
  host_earn_pence  integer not null check (host_earn_pence >= 0),
  status           text not null default 'active' check (status in ('active', 'reversed')),
  created_at       timestamptz not null default now(),
  check (sender_id <> host_id)
);
create index if not exists gift_sends_stream_idx on public.gift_sends (stream_id, created_at desc);
create index if not exists gift_sends_host_idx on public.gift_sends (host_id, created_at desc);

-- 6. Security. Reads: rooms, products and chat are public (rooms are
-- shareable links); wallets, purchases and gift records are private.
-- Writes: only through the server (service key) and the functions below.
alter table public.live_streams   enable row level security;
alter table public.live_messages  enable row level security;
alter table public.live_products  enable row level security;
alter table public.coin_wallets   enable row level security;
alter table public.coin_purchases enable row level security;
alter table public.gift_sends     enable row level security;

drop policy if exists "live streams public" on public.live_streams;
create policy "live streams public" on public.live_streams for select using (true);
drop policy if exists "live messages public" on public.live_messages;
create policy "live messages public" on public.live_messages for select using (true);
drop policy if exists "live products public" on public.live_products;
create policy "live products public" on public.live_products for select using (true);
drop policy if exists "coin wallet own" on public.coin_wallets;
create policy "coin wallet own" on public.coin_wallets for select to authenticated using (user_id = auth.uid());
drop policy if exists "coin purchases own" on public.coin_purchases;
create policy "coin purchases own" on public.coin_purchases for select to authenticated using (user_id = auth.uid());
drop policy if exists "gift sends own" on public.gift_sends;
create policy "gift sends own" on public.gift_sends for select to authenticated using (sender_id = auth.uid() or host_id = auth.uid());

-- 7. Send a gift atomically: spend coins, record the gift, post it in chat.
--    Returns the sender's new balance, or raises 'insufficient_coins'.
create or replace function public.grid_send_gift(
  p_stream uuid, p_sender uuid, p_gift text, p_coins integer, p_host_share numeric, p_label text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_host uuid;
  v_status text;
  v_balance integer;
begin
  if p_coins <= 0 then raise exception 'invalid_amount'; end if;
  select host_id, status into v_host, v_status from live_streams where id = p_stream;
  if v_host is null then raise exception 'stream_not_found'; end if;
  if v_status <> 'live' then raise exception 'stream_not_live'; end if;
  if v_host = p_sender then raise exception 'own_stream'; end if;

  update coin_wallets
     set balance_coins = balance_coins - p_coins, updated_at = now()
   where user_id = p_sender and balance_coins >= p_coins
  returning balance_coins into v_balance;
  if v_balance is null then raise exception 'insufficient_coins'; end if;

  insert into gift_sends (stream_id, sender_id, host_id, gift_id, coins, host_earn_pence)
  values (p_stream, p_sender, v_host, p_gift, p_coins, floor(p_coins * p_host_share));

  insert into live_messages (stream_id, user_id, kind, body, gift_id, coins)
  values (p_stream, p_sender, 'gift', left(p_label, 300), p_gift, p_coins);

  return v_balance;
end;
$$;

-- 8. Credit a paid coin purchase exactly once (return page and webhook both call it).
create or replace function public.grid_credit_coins(p_purchase uuid, p_session text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid;
  v_coins integer;
  v_balance integer;
begin
  update coin_purchases
     set status = 'paid', paid_at = now()
   where id = p_purchase and stripe_session_id = p_session and status = 'pending'
  returning user_id, coins into v_user, v_coins;
  if v_user is null then
    return null; -- already credited (or not found)
  end if;
  insert into coin_wallets (user_id, balance_coins) values (v_user, v_coins)
  on conflict (user_id) do update set balance_coins = coin_wallets.balance_coins + excluded.balance_coins, updated_at = now()
  returning balance_coins into v_balance;
  return v_balance;
end;
$$;

-- Only the server (service role) may call these.
revoke all on function public.grid_send_gift(uuid, uuid, text, integer, numeric, text) from public, anon, authenticated;
revoke all on function public.grid_credit_coins(uuid, text) from public, anon, authenticated;
grant execute on function public.grid_send_gift(uuid, uuid, text, integer, numeric, text) to service_role;
grant execute on function public.grid_credit_coins(uuid, text) to service_role;

commit;

select relname as table_name, relrowsecurity as rls
from pg_class where relnamespace = 'public'::regnamespace
  and relname in ('live_streams', 'live_messages', 'live_products', 'coin_wallets', 'coin_purchases', 'gift_sends')
order by 1;
