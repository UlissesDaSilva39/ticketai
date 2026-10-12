-- Events seed (2 per artist, attached to venues)
DO $$
DECLARE
  artist_rec RECORD;
  venue_rec RECORD;
  i INTEGER := 0;
  artist_ids UUID[];
  venue_ids UUID[];
BEGIN
  -- Get first 20 artists and first 20 venues
  SELECT array_agg(id) INTO artist_ids FROM (SELECT id FROM artists WHERE slug NOT IN ('demoticketaiorguk') ORDER BY created_at LIMIT 20) sub;
  SELECT array_agg(id) INTO venue_ids FROM (SELECT id FROM venues ORDER BY created_at LIMIT 20) sub;
  
  FOR artist_rec IN SELECT id, name, slug FROM artists WHERE id = ANY(artist_ids) LOOP
    FOR i IN 1..2 LOOP
      INSERT INTO events (title, organizer_id, venue_id, start_date, end_date, description, status, hero_image, ticket_types, is_test)
      VALUES (
        artist_rec.name || ' Live at ' || (SELECT name FROM venues WHERE id = venue_ids[1 + (i % array_length(venue_ids, 1))]),
        artist_ids[1],
        venue_ids[1 + (i % array_length(venue_ids, 1))],
        NOW() + (INTERVAL '1 day' * (30 + (i * 7) + (random() * 30)::int)),
        NOW() + (INTERVAL '1 day' * (30 + (i * 7) + (random() * 30)::int)) + INTERVAL '4 hours',
        'Live performance from ' || artist_rec.name || '.',
        'published',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80',
        '[{"name":"General Admission","price":1500,"quantity":500},{"name":"VIP","price":3500,"quantity":50}]'::jsonb,
        false
      );
    END LOOP;
  END LOOP;
END $$;
