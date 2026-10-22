CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, name TEXT NOT NULL, bio TEXT, city TEXT,
  avatar_url TEXT, verified BOOLEAN DEFAULT false, membership_url TEXT,
  follower_count INT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);

ALTER TABLE venues ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS capacity INT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS membership_url TEXT;

CREATE TABLE IF NOT EXISTS event_artists (
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
  billing_order INT DEFAULT 0,
  is_headliner BOOLEAN DEFAULT false,
  PRIMARY KEY (event_id, artist_id)
);
CREATE INDEX IF NOT EXISTS idx_event_artists_event ON event_artists(event_id);

ALTER TABLE events ADD COLUMN IF NOT EXISTS membership_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS promoter_id UUID REFERENCES profiles(id);
ALTER TABLE events ADD COLUMN IF NOT EXISTS age_restriction TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS doors_open_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT, city TEXT, genre TEXT, price_max NUMERIC,
  notify BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE VIEW featured_events_view AS
SELECT e.id, e.title, e.start_date, e.hero_image, e.featured_until,
  e.membership_url, e.ticket_types, e.age_restriction, e.doors_open_at,
  v.slug AS venue_slug, v.name AS venue_name, v.city AS venue_city,
  v.membership_url AS venue_membership_url,
  p.username AS promoter_slug, p.full_name AS promoter_name,
  COALESCE((SELECT json_agg(json_build_object('slug', a.slug, 'name', a.name, 'verified', a.verified) ORDER BY ea.billing_order)
    FROM event_artists ea JOIN artists a ON a.id = ea.artist_id WHERE ea.event_id = e.id), '[]'::json) AS artists
FROM events e
LEFT JOIN venues v ON v.id = e.venue_id
LEFT JOIN profiles p ON p.id = COALESCE(e.promoter_id, e.organizer_id)
WHERE e.status = 'published';

INSERT INTO artists (slug, name, bio, city, verified) VALUES
  ('paper-lions', 'Paper Lions', 'Jazz quartet', 'London', true),
  ('analog-dreams', 'Analog Dreams', 'Electronic producer', 'London', true),
  ('alice-waves', 'Alice Waves', 'House DJ', 'London', true),
  ('dj-proxy', 'DJ Proxy', 'Techno resident', 'London', true),
  ('nightshift-collective', 'Nightshift Collective', 'DJ crew', 'London', true),
  ('bobby-beats', 'Bobby Beats', 'UK Garage', 'London', false)
ON CONFLICT (slug) DO NOTHING;