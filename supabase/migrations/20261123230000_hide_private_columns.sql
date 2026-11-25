-- Hide private columns from logged-out visitors (the public "anon" role).
--
-- Before this, anyone with the public key could read:
--   profiles.stripe_customer_id, profiles.stripe_account_id
--   artists.email, artists.phone, artists.postcode
--   featured_placements.amount_paid_gbp, .notes, .created_by
--   promoters.commission_rate
--   venues.revenue_share_percent, venues.total_revenue
--
-- How: remove table-wide SELECT from anon and grant SELECT on the safe columns
-- only. Rows are still filtered by the existing RLS policies. Logged-in users
-- (authenticated) and server code using the service key are NOT changed.
-- No data is modified.
--
-- The app's public pages already request only these columns
-- (lib/db/public-columns.ts); keep both lists in sync.
-- featured_placements.payment_status stays readable: /api/featured and
-- /api/artists filter on it with the public key.

revoke select on public.profiles from anon;
grant select (id, full_name, role, created_at, bio, avatar_url, city, website, instagram,
              twitter, username, is_public, cover_image, genre, label, spotify, youtube, soundcloud)
  on public.profiles to anon;

revoke select on public.artists from anon;
grant select (id, owner_id, slug, name, handle, genre, artist_type, secondary_genres, city,
              country, bio, website, spotify, instagram, avatar_url, status, created_at,
              updated_at, cover_image, verified, external_id, source)
  on public.artists to anon;

revoke select on public.featured_placements from anon;
grant select (id, artist_id, artist_name, placement_type, starts_at, ends_at, payment_status, created_at)
  on public.featured_placements to anon;

revoke select on public.promoters from anon;
grant select (id, user_id, display_name, bio, instagram, tiktok, youtube, city, verified,
              created_at, next_event, event_count, tickets_sold, photos, slug)
  on public.promoters to anon;

revoke select on public.venues from anon;
grant select (id, organizer_id, name, slug, description, venue_type, address_line1, address_line2,
              city, county, postcode, country, latitude, longitude, capacity, standing_capacity,
              seated_capacity, accessibility_features, timezone, currency, hero_image, status,
              verified, created_at, contact_email, contact_phone, website, type, rating, reviews,
              bookings, image, updated_at, external_id, source)
  on public.venues to anon;

-- To undo:
-- grant select on public.profiles, public.artists, public.featured_placements,
--                 public.promoters, public.venues to anon;
