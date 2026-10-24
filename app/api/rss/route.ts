import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('rss_items')
    .select('id, source_name, title, link, pub_date')
    .order('pub_date', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'Could not load rss', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}