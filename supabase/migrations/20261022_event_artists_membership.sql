-- ============================================================
-- Migration: Event artist linkage + membership + enriched queries
-- Run this in Supabase SQL editor
-- ============================================================

-- 1. Artists table (create if missing)
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  bio TEXT,
  city TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  membership_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);

-- 2. Event <-> Artist junction (many-to-many)
CREATE TABLE IF NOT EXISTS event_artists (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  billing_order INT DEFAULT 0,
  PRIMARY KEY (event_id, artist_id)
);

CREATE INDEX IF NOT EXISTS idx_event_artists_event ON event_artists(event_id);
CREATE INDEX IF NOT EXISTS idx_event_artists_artist ON event_artists(artist_id);

-- 3. Add membership_url to events (for promoter membership CTA)
ALTER TABLE events ADD COLUMN IF NOT EXISTS membership_url TEXT;

-- 4. Promoter relation (organizer acts as promoter)
--    organizer_id already exists and points to profiles
--    Adding explicit promoter_id if organizer represents profile
ALTER TABLE events ADD COLUMN IF NOT EXISTS promoter_id UUID REFERENCES profiles(id);

-- 5. Views for fast featured queries
CREATE OR REPLACE VIEW featured_events_enriched AS
SELECT
  e.id, e.title, e.start_date, e.hero_image, e.featured_until,
  e.featured_tier, e.membership_url,
  v.slug AS venue_slug, v.name AS venue_name, v.city AS venue_city,
  p.username AS promoter_slug, p.full_name AS promoter_name,
  COALESCE(
    (SELECT json_agg(
      json_build_object('slug', a.slug, 'name', a.name)
      ORDER BY ea.billing_order
    )
    FROM event_artists ea
    JOIN artists a ON a.id = ea.artist_id
    WHERE ea.event_id = e.id),
    '[]'::json
  ) AS artists
FROM events e
LEFT JOIN venues v ON v.id = e.venue_id
LEFT JOIN profiles p ON p.id = COALESCE(e.promoter_id, e.organizer_id)
WHERE e.status = 'published';

-- 6. Seed sample artists so featured events show artist links
INSERT INTO artists (slug, name, bio, city, verified) VALUES
  ('paper-lions', 'Paper Lions', 'Jazz quartet from London', 'London', true),
  ('analog-dreams', 'Analog Dreams', 'Electronic producer', 'London', true),
  ('alice-waves', 'Alice Waves', 'House DJ', 'London', true),
  ('dj-proxy', 'DJ Proxy', 'Techno resident', 'London', true),
  ('nightshift-collective', 'Nightshift Collective', 'Rotating DJ crew', 'London', true)
ON CONFLICT (slug) DO NOTHING;