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

  const searchParams = req.nextUrl.searchParams;
  const genre = searchParams.get('genre');
  const city = searchParams.get('city');
  const type = searchParams.get('type');
  const q = searchParams.get('q');

  let query = supabase
    .from('artists')
    .select('id, slug, name, handle, artist_type, genre, secondary_genres, city, country, bio, avatar_url, verified, created_at')
    .eq('status', 'active')
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  if (genre && genre !== 'All') query = query.eq('genre', genre);
  if (city && city !== 'All') query = query.eq('city', city);
  if (type && type !== 'All') query = query.eq('artist_type', type);
  if (q) query = query.or(`name.ilike.%${q}%,handle.ilike.%${q}%,genre.ilike.%${q}%,city.ilike.%${q}%`);

  const { data, error } = await query;

  if (error) {
    console.error('artists GET error:', error);
    return NextResponse.json({ error: 'Could not load artists' }, { status: 500 });
  }

  return NextResponse.json({ artists: data ?? [] });
}
