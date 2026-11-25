import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { rateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  const supabase = createClient(url, key);
  const params = req.nextUrl.searchParams;
  const category = params.get('category');
  const location = params.get('location');
  const remote = params.get('remote');
  const q = params.get('q');

  let query = supabase
    .from('opportunities')
    .select('id, title, org, category, location, remote, compensation, description, deadline, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (category && category !== 'All') query = query.eq('category', category);
  if (location && location !== 'All') query = query.eq('location', location);
  if (remote === 'true') query = query.eq('remote', true);
  if (q) query = query.or('title.ilike.%' + q + '%,org.ilike.%' + q + '%,description.ilike.%' + q + '%');
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Could not load opportunities', detail: error.message }, { status: 500 });
  return NextResponse.json({ opportunities: data ?? [] });
}

const CATEGORIES = ['gig', 'booking', 'collab', 'job', 'session', 'remix'];
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

// Create an opportunity. Requires login; the poster is recorded in created_by so
// applicants can reach them (previously anyone could post, via the service key).
export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    if (!rateLimit(`opportunity-create:${user.id}`, 5, 60 * 60 * 1000).ok) {
      return NextResponse.json({ error: 'Too many posts. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const title = str(body.title, 120);
    const org = str(body.org, 120);
    const category = str(body.category, 20).toLowerCase();
    const location = str(body.location, 80) || null;
    const compensation = str(body.compensation, 80) || null;
    const description = str(body.description, 4000) || null;
    const deadline = /^\d{4}-\d{2}-\d{2}$/.test(String(body.deadline ?? '')) ? String(body.deadline) : null;
    if (!title || !org || !category) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Category must be one of: ' + CATEGORIES.join(', ') }, { status: 400 });
    }

    // Insert with the service client (table permissions unknown), but only after the
    // login check above and with created_by forced to the logged-in user.
    const { data, error } = await createAdminClient()
      .from('opportunities')
      .insert({ title, org, category, location, remote: !!body.remote, compensation, description, deadline, created_by: user.id })
      .select()
      .single();
    if (error) return NextResponse.json({ error: 'Could not create opportunity', detail: error.message }, { status: 500 });
    return NextResponse.json({ opportunity: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
