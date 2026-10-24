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

  const q = params.get('q');

  let query = supabase
    .from('labels')
    .select('id, name, slug, description, city, country, genres, roster, hero_image, website, status, verified, created_at')
    .eq('status', 'active')
    .order('verified', { ascending: false })
    .order('name', { ascending: true })
    .limit(100);

  if (q) query = query.or(`name.ilike.%${q}%,city.ilike.%${q}%,description.ilike.%${q}%`);

  const { data, error } = await query;

  if (error) {
    console.error('labels GET error:', error);
    return NextResponse.json({ error: 'Could not load labels', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ labels: data ?? [] });
}
