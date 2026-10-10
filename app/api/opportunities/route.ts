import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const FALLBACK = [
  { id: '1', title: 'DJ WANTED', org: 'XYZ Events', category: 'gig', location: 'London', compensation: '£500-£1,000', deadline: null },
  { id: '2', title: 'PRODUCER COLLABORATION', org: 'Independent', category: 'collab', location: 'Remote', compensation: 'Paid', deadline: null },
  { id: '3', title: 'FESTIVAL APPLICATIONS OPEN', org: 'Berlin House Festival', category: 'festival', location: 'Berlin', compensation: '', deadline: null },
  { id: '4', title: 'MUSIC MARKETING MANAGER', org: 'XYZ Records', category: 'job', location: 'London', compensation: 'Full-time', deadline: null },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get('type');

  try {
    const supabase = await createServerSupabase();
    let query = supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return NextResponse.json({ opportunities: FALLBACK });
    }

    return NextResponse.json({ opportunities: data });
  } catch {
    return NextResponse.json({ opportunities: FALLBACK });
  }
}
