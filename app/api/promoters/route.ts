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
  const verifiedOnly = params.get('verified') === 'true';
  const q = params.get('q');

  let query = supabase
    .from('promoters')
    .select('id, display_name, bio, instagram, tiktok, youtube, city, commission_rate, verified, created_at, next_event, event_count, tickets_sold, photos')
    .order('verified', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(100);

  if (city && city !== 'All') query = query.eq('city', city);
  if (verifiedOnly) query = query.eq('verified', true);
  if (q) query = query.or(`display_name.ilike.%${q}%,city.ilike.%${q}%,bio.ilike.%${q}%`);

  const { data, error } = await query;

  if (error) {
    console.error('promoters GET error:', error);
    return NextResponse.json({ error: 'Could not load promoters', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ promoters: data ?? [] });
}
