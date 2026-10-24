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
  const q = params.get('q');

  let query = supabase
    .from('festivals')
    .select('id, name, slug, description, city, country, start_date, end_date, venue_id, capacity, genres, lineup, hero_image, website, status, verified, created_at')
    .eq('status', 'active')
    .order('start_date', { ascending: true })
    .limit(100);

  if (city && city !== 'All') query = query.eq('city', city);
  if (q) query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query;

  if (error) {
    console.error('festivals GET error:', error);
    return NextResponse.json({ error: 'Could not load festivals', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ festivals: data ?? [] });
}
