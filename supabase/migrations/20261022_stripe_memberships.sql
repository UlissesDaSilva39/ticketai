-- Add Stripe tracking columns to user_memberships
ALTER TABLE user_memberships ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;
ALTER TABLE user_memberships ADD COLUMN IF NOT EXISTS stripe_payment_status TEXT DEFAULT 'pending';
ALTER TABLE user_memberships ADD COLUMN IF NOT EXISTS amount_paid NUMERIC;
ALTER TABLE user_memberships ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'gbp';