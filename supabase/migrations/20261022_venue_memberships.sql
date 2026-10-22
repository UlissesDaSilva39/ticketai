-- ============================================================
-- Venue Memberships - full schema
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Extend venues table
ALTER TABLE venues ADD COLUMN IF NOT EXISTS membership_enabled BOOLEAN DEFAULT false;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS membership_blurb TEXT;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS member_count INT DEFAULT 0;
ALTER TABLE venues ADD COLUMN IF NOT EXISTS founder_spots_remaining INT DEFAULT 50;

-- 2. Membership tiers (per venue)
CREATE TABLE IF NOT EXISTS venue_membership_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  price_monthly NUMERIC NOT NULL,
  currency TEXT DEFAULT 'GBP',
  description TEXT,
  perks JSONB DEFAULT '[]'::jsonb,
  max_members INT,
  is_popular BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (venue_id, slug)
);
CREATE INDEX IF NOT EXISTS idx_vmt_venue ON venue_membership_tiers(venue_id);

-- 3. Active memberships
CREATE TABLE IF NOT EXISTS venue_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES venue_membership_tiers(id),
  status TEXT NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  UNIQUE (user_id, venue_id)
);
CREATE INDEX IF NOT EXISTS idx_vm_venue ON venue_memberships(venue_id);
CREATE INDEX IF NOT EXISTS idx_vm_user ON venue_memberships(user_id);

-- 4. Member testimonials (social proof)
CREATE TABLE IF NOT EXISTS venue_club_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_tier TEXT,
  quote TEXT NOT NULL,
  rating INT DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vct_venue ON venue_club_testimonials(venue_id);

-- 5. View for venue club page
CREATE OR REPLACE VIEW venue_club_view AS
SELECT
  v.id, v.slug, v.name, v.city, v.membership_enabled, v.membership_blurb,
  v.member_count, v.founder_spots_remaining,
  v.photo_url,
  COALESCE(
    (SELECT json_agg(json_build_object(
      'slug', t.slug, 'name', t.name, 'price', t.price_monthly,
      'description', t.description, 'perks', t.perks,
      'popular', t.is_popular, 'maxMembers', t.max_members,
      'spotsRemaining', CASE WHEN t.max_members IS NOT NULL
        THEN t.max_members - COALESCE((SELECT COUNT(*) FROM venue_memberships vm WHERE vm.tier_id = t.id AND vm.status = 'active'), 0)
        ELSE NULL END
    ) ORDER BY t.sort_order)
    FROM venue_membership_tiers t WHERE t.venue_id = v.id),
    '[]'::json
  ) AS tiers,
  COALESCE(
    (SELECT json_agg(json_build_object(
      'author', c.author_name, 'tier', c.author_tier,
      'quote', c.quote, 'rating', c.rating
    ) ORDER BY c.created_at DESC)
    FROM venue_club_testimonials c WHERE c.venue_id = v.id LIMIT 5),
    '[]'::json
  ) AS testimonials
FROM venues v
WHERE v.membership_enabled = true;

-- 6. Seed Fabric club as example
INSERT INTO venue_membership_tiers (venue_id, slug, name, price_monthly, description, perks, is_popular, sort_order)
SELECT v.id, 'regular', 'Regular', 15, 'The essentials, every month',
  '["Skip the queue","10% off drinks until 11pm","Early ticket access (24h)","Free cloakroom","Members newsletter"]'::jsonb,
  false, 1
FROM venues v WHERE v.slug = 'fabric'
ON CONFLICT (venue_id, slug) DO NOTHING;

INSERT INTO venue_membership_tiers (venue_id, slug, name, price_monthly, description, perks, is_popular, sort_order)
SELECT v.id, 'inner-circle', 'Inner Circle', 35, 'Best value - most popular',
  '["Everything in Regular","1 free ticket/month","15% off drinks all night","+1 guest passes","Priority tables","Secret lineups","Discounted club entry"]'::jsonb,
  true, 2
FROM venues v WHERE v.slug = 'fabric'
ON CONFLICT (venue_id, slug) DO NOTHING;

INSERT INTO venue_membership_tiers (venue_id, slug, name, price_monthly, description, perks, max_members, is_popular, sort_order)
SELECT v.id, 'founder', 'Founder', 75, 'Limited to 50 - lifetime perks',
  '["Everything in Inner Circle","2 free tickets/month","Private bar access","20% off all drinks","Free entry ALL events","Quarterly exclusive merch","Meet-the-artist events","Name on Founders Wall"]'::jsonb,
  50, false, 3
FROM venues v WHERE v.slug = 'fabric'
ON CONFLICT (venue_id, slug) DO NOTHING;

-- Enable membership for Fabric
UPDATE venues SET membership_enabled = true, membership_blurb = 'Join the Fabric family. Skip the queue, get priority tickets, and be part of the world''s most iconic club.'
WHERE slug = 'fabric';

-- Seed testimonials
INSERT INTO venue_club_testimonials (venue_id, author_name, author_tier, quote, rating)
SELECT v.id, 'Sarah M.', 'Inner Circle', 'Best £35 I spend each month. I go to Fabric 2-3 times anyway, and the free tickets alone pay for it.', 5
FROM venues v WHERE v.slug = 'fabric'
ON CONFLICT DO NOTHING;

INSERT INTO venue_club_testimonials (venue_id, author_name, author_tier, quote, rating)
SELECT v.id, 'James T.', 'Founder', 'Being a founder is worth every penny. The private bar and meet-the-artist events are incredible.', 5
FROM venues v WHERE v.slug = 'fabric'
ON CONFLICT DO NOTHING;