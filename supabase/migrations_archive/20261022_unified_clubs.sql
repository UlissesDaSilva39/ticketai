-- ============================================================
-- Unified Club Architecture (Venues, Artists, Promoters, DJs)
-- ============================================================

-- 1. Central Tiers Table
CREATE TABLE IF NOT EXISTS club_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- 'venue', 'artist', 'promoter'
  entity_id TEXT NOT NULL,   -- The slug of the entity
  name TEXT NOT NULL,        -- 'Regular', 'Inner Circle', etc.
  price_monthly NUMERIC NOT NULL,
  description TEXT,
  perks JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  max_members INT,
  sort_order INT DEFAULT 0,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, name)
);

CREATE INDEX IF NOT EXISTS idx_club_tiers_entity ON club_tiers(entity_type, entity_id);

-- 2. Central Memberships Table
CREATE TABLE IF NOT EXISTS user_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  tier_id UUID NOT NULL REFERENCES club_tiers(id),
  status TEXT NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  UNIQUE (user_id, entity_type, entity_id)
);

CREATE INDEX IF NOT EXISTS idx_user_memberships_user ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_entity ON user_memberships(entity_type, entity_id);

-- 3. Seed Data (Venues, Artists, Promoters)
INSERT INTO club_tiers (entity_type, entity_id, name, price_monthly, description, perks, is_popular)
VALUES 
  -- Fabric (Venue)
  ('venue', 'fabric', 'Regular', 15, 'The essentials', '["Skip the queue", "10% off drinks", "Members newsletter"]', false),
  ('venue', 'fabric', 'Inner Circle', 35, 'Best value', '["Everything in Regular", "1 free ticket/month", "15% off drinks", "+1 guest passes"]', true),
  
  -- DJ Proxy (Artist/DJ)
  ('artist', 'dj-proxy', 'Supporter', 5, 'Support the sound', '["Unreleased mixes", "Early ticket access", "Discord access"]', false),
  ('artist', 'dj-proxy', 'Inner Circle', 15, 'The real vault', '["Everything in Supporter", "Monthly track pack", "Shoutout in podcast", "15% off merch"]', true),
  
  -- Nightshift (Promoter)
  ('promoter', 'nightshift-presents', 'Guestlist', 10, 'Skip the line', '["Priority guestlist", "Early bird ticket codes", "Secret location drops"]', true)
ON CONFLICT (entity_type, entity_id, name) DO NOTHING;