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
  const type = params.get('type');
  const q = params.get('q');

  let query = supabase
    .from('venues')
    .select('id, name, slug, description, venue_type, type, address_line1, city, county, postcode, country, capacity, hero_image, image, verified, rating, reviews, website, status, created_at')
    .limit(100);

  if (city && city !== 'All') query = query.eq('city', city);
  if (type && type !== 'All') query = query.eq('venue_type', type);
  if (q) query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,postcode.ilike.%${q}%`);

  const { data, error } = await query;

  if (error) {
    console.error('venues GET error:', error);
    return NextResponse.json({ error: 'Could not load venues', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ venues: data ?? [] });
}
