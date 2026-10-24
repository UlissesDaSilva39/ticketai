import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const params = req.nextUrl.searchParams;

  const city = params.get('city');
  const genre = params.get('genre');
  const sort = params.get('sort') ?? 'date';
  const q = params.get('q');

  let query = supabase
    .from('events')
    .select('id, title, description, start_date, end_date, timezone, event_type, status, hero_image, views, lineup, ticket_types, venue_id, venue_name, venue_city, featured_until, featured_tier, venues(name, city)')
    .eq('is_test', false)
    .eq('status', 'published')
    .gte('start_date', new Date().toISOString())
    .limit(100);

  if (sort === 'Popular') query = query.order('views', { ascending: false });
  else query = query.order('start_date', { ascending: true });

  if (genre && genre !== 'All') query = query.eq('event_type', genre);
  if (q) query = query.ilike('title', `%${q}%`);

  const { data, error } = await query;

  if (error) {
    console.error('events GET error:', error);
    return NextResponse.json({ error: 'Could not load events', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ events: data ?? [] });
}

