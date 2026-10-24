import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { target_type, target_id, verification_method, notes } = body;

    if (!target_type || !target_id || !verification_method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
    }

    // Check for existing pending claim
    const { data: existing } = await supabase
      .from('profile_claims')
      .select('id, status')
      .eq('claimant_id', user.id)
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        claim_id: existing.id,
        status: existing.status,
        already_exists: true,
      });
    }

    const { data: created, error } = await supabase
      .from('profile_claims')
      .insert({
        claimant_id: user.id,
        target_type,
        target_id,
        verification_method,
        notes: notes || null,
        status: 'pending',
      })
      .select('id, status')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ claim_id: created.id, status: created.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profile_claims')
    .select('id, claimant_id, target_type, target_id, verification_method, status, notes, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ claims: data ?? [] });
}