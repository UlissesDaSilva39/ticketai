-- ============================================================
--  Unify follow system
--  Migrate artist_follows -> follows
--  Run this once in Supabase SQL editor BEFORE the API changes go live
-- ============================================================

-- 1. Make sure follows has the right unique constraint so duplicates are blocked
ALTER TABLE public.follows
  DROP CONSTRAINT IF EXISTS follows_unique_follower_target;
ALTER TABLE public.follows
  ADD CONSTRAINT follows_unique_follower_target
  UNIQUE (follower_id, target_type, target_id);

-- 2. Ensure target_type only accepts the four expected values
ALTER TABLE public.follows
  DROP CONSTRAINT IF EXISTS follows_target_type_check;
ALTER TABLE public.follows
  ADD CONSTRAINT follows_target_type_check
  CHECK (target_type IN ('artist','promoter','venue','user'));

-- 3. Index for fast "who does this follower follow"
CREATE INDEX IF NOT EXISTS follows_follower_idx
  ON public.follows (follower_id, target_type);

-- 4. Index for fast "who follows this target"
CREATE INDEX IF NOT EXISTS follows_target_idx
  ON public.follows (target_type, target_id);

-- 5. Migrate every artist_follows row into follows
--    Only inserts rows that don't already exist (idempotent)
INSERT INTO public.follows (follower_id, target_type, target_id)
SELECT af.follower_id, 'artist', a.id
FROM   public.artist_follows af
JOIN   public.artists a ON a.slug = af.artist_slug
WHERE  NOT EXISTS (
         SELECT 1 FROM public.follows f
         WHERE  f.follower_id = af.follower_id
           AND  f.target_type = 'artist'
           AND  f.target_id   = a.id
       );

-- 6. Report how many rows moved
SELECT COUNT(*) AS follows_total,
       COUNT(*) FILTER (WHERE target_type='artist') AS follows_artist
FROM public.follows;

-- NOTE: Do NOT drop artist_follows yet. Keep it as a backup.
-- Once you've confirmed the new button works, run:
--   DROP TABLE public.artist_follows;