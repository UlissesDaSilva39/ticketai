-- =====================================================================
-- Hide private columns from logged-out visitors (the public "anon" key)
-- Status: NOT APPLIED. Review and test before running in the SQL editor.
--
-- Found 2026-11-23 by reading 1 row per table with the public key:
--   profiles             -> stripe_customer_id, stripe_account_id readable by anyone
--   artists              -> email, phone, postcode readable by anyone
--   featured_placements  -> amount_paid_gbp, payment_status, notes, created_by
--   promoters            -> commission_rate
--   venues               -> revenue_share_percent, total_revenue
--
-- READY TO RUN (updated 2026-11-23): the public pages that read these tables
-- as a logged-out visitor now select only safe columns via
-- lib/db/public-columns.ts (keep that file and the GRANT lists below in sync):
--   app/u/[username]/page.tsx, app/organizers/[id]/page.tsx, app/venue/[slug]/page.tsx
-- Owner dashboards that read private columns (organizer, venue/promoter
-- dashboards) are members-only in proxy.ts, so they use the logged-in role,
-- which this script does not change.
--
-- HOW TO RUN: Supabase dashboard → SQL Editor → paste this file → Run.
-- Then open /u/<a username> and /organizers/<id> while logged out to confirm.
--
-- How it works: Postgres column privileges. We remove table-wide SELECT for the
-- anon role and grant SELECT only on the safe columns. Logged-in users
-- (authenticated) and server code using the service key are unaffected.
-- =====================================================================

begin;

-- profiles: hide Stripe IDs
revoke select on public.profiles from anon;
grant select (id, full_name, role, created_at, bio, avatar_url, city, website, instagram,
              twitter, username, is_public, cover_image, genre, label, spotify, youtube, soundcloud)
  on public.profiles to anon;

-- artists: hide personal contact details
revoke select on public.artists from anon;
grant select (id, owner_id, slug, name, handle, genre, artist_type, secondary_genres, city,
              country, bio, website, spotify, instagram, avatar_url, status, created_at,
              updated_at, cover_image, verified, external_id, source)
  on public.artists to anon;

-- featured_placements: hide money and internal notes
revoke select on public.featured_placements from anon;
grant select (id, artist_id, artist_name, placement_type, starts_at, ends_at, created_at)
  on public.featured_placements to anon;

-- promoters: hide commission rate
revoke select on public.promoters from anon;
grant select (id, user_id, display_name, bio, instagram, tiktok, youtube, city, verified,
              created_at, next_event, event_count, tickets_sold, photos, slug)
  on public.promoters to anon;

-- venues: hide revenue figures
revoke select on public.venues from anon;
grant select (id, organizer_id, name, slug, description, venue_type, address_line1, address_line2,
              city, county, postcode, country, latitude, longitude, capacity, standing_capacity,
              seated_capacity, accessibility_features, timezone, currency, hero_image, status,
              verified, created_at, contact_email, contact_phone, website, type, rating, reviews,
              bookings, image, updated_at, external_id, source)
  on public.venues to anon;

commit;

-- Undo (if something breaks):
-- grant select on public.profiles, public.artists, public.featured_placements,
--                 public.promoters, public.venues to anon;
