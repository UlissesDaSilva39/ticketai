# Seed plan (next session)

## Prep done
- .env.local has SUPABASE_SERVICE_ROLE_KEY ✅
- No SQL migrations in repo — schema inferred from code
- 40 tables identified: see seed-plan.md

## Tables to seed (phase 1)
profiles, posts, post_comments, post_likes, follows,
venues, events

## Tables to seed (phase 2 — optional)
artist_tracks, artist_follows, notifications,
notification_preferences, opportunities, tickets

## IDs
All seed rows use deterministic UUIDs:
  00000000-0000-4000-8000-{NNNNNNNNNNNN}
Cleanup = DELETE WHERE id::text LIKE '00000000-0000-4000-8000-%'

## Scripts
scripts/seed.ts
scripts/cleanup-seed.ts
package.json:
  "seed": "tsx scripts/seed.ts"
  "seed:clean": "tsx scripts/cleanup-seed.ts"
  "seed:fresh": "npm run seed:clean && npm run seed"

## Column shapes (confirmed from code)
profiles: id, username, full_name, avatar_url, genre, city, role
events:   id, title, start_date, hero_image, ticket_types, venue_id, status, views
posts:    id, body, author_id, author_type, like_count, comment_count,
          share_count, created_at
post_comments: id, post_id, author_id, body, created_at
follows:  follower_id, target_id
