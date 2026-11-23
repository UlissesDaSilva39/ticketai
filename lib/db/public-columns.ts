// Columns that logged-out visitors (the public "anon" key) are allowed to read.
// Must match the GRANT lists in supabase/security/hide-private-columns.sql.
// Public pages should select these instead of "*", which would fail for
// visitors once the private columns are hidden.

export const PUBLIC_PROFILE_COLUMNS =
  "id, full_name, role, created_at, bio, avatar_url, city, website, instagram, twitter, username, is_public, cover_image, genre, label, spotify, youtube, soundcloud";

export const PUBLIC_ARTIST_COLUMNS =
  "id, owner_id, slug, name, handle, genre, artist_type, secondary_genres, city, country, bio, website, spotify, instagram, avatar_url, status, created_at, updated_at, cover_image, verified, external_id, source";

export const PUBLIC_FEATURED_COLUMNS =
  "id, artist_id, artist_name, placement_type, starts_at, ends_at, created_at";

export const PUBLIC_PROMOTER_COLUMNS =
  "id, user_id, display_name, bio, instagram, tiktok, youtube, city, verified, created_at, next_event, event_count, tickets_sold, photos, slug";

export const PUBLIC_VENUE_COLUMNS =
  "id, organizer_id, name, slug, description, venue_type, address_line1, address_line2, city, county, postcode, country, latitude, longitude, capacity, standing_capacity, seated_capacity, accessibility_features, timezone, currency, hero_image, status, verified, created_at, contact_email, contact_phone, website, type, rating, reviews, bookings, image, updated_at, external_id, source";
