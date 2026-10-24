import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  try {
    const body = await req.json();
    const title = body.title;
    const org = body.org;
    const category = body.category;
    const location = body.location;
    const remote = body.remote;
    const compensation = body.compensation;
    const description = body.description;
    const deadline = body.deadline;
    if (!title || !org || !category) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from('opportunities')
      .insert({ title: title, org: org, category: category, location: location, remote: !!remote, compensation: compensation, description: description, deadline: deadline })
      .select()
      .single();
    if (error) return NextResponse.json({ error: 'Could not create opportunity', detail: error.message }, { status: 500 });
    return NextResponse.json({ opportunity: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
