# Session handover — P0 done, seed next

## Status
- /home P0 fixes applied (Today label, landmarks, composer a11y)
- Playwright suite: home.spec.ts + home-a11y.spec.ts written
- SEED-PLAN.md written
- Next: seed the database

## Env
- .env.local has SUPABASE_SERVICE_ROLE_KEY ✅
- NEXT_PUBLIC_SUPABASE_URL ✅

## What to build next
1. scripts/seed.ts (see SEED-PLAN.md)
2. scripts/cleanup-seed.ts
3. package.json scripts: seed, seed:clean, seed:fresh

## Confirmed schema (from code)
profiles:
  id (uuid, = auth.users.id)
  username (text, unique)
  full_name (text)
  avatar_url (text)
  genre (text)
  city (text)
  role (text)

events:
  id
  title
  start_date (timestamp)
  hero_image (text)
  ticket_types (jsonb)
  venue_id (uuid)
  status (text, 'published' | ...)
  views (int)

posts:
  id
  body (text)
  author_id (uuid)
  author_type (text)
  like_count (int)
  comment_count (int)
  share_count (int)
  created_at (timestamp)

post_comments:
  id, post_id, author_id, body, created_at

follows:
  follower_id (uuid), target_id (uuid)

## 40 tables total (full list in pw-all-results.txt or run the discovery command)

## Test IDs convention
00000000-0000-4000-8000-{NNNNNNNNNNNN}
