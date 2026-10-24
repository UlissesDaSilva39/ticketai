import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const ALLOWED = ['display_name', 'bio', 'city', 'instagram', 'tiktok', 'youtube', 'commission_rate'];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

    const { data: promoter } = await supabase
      .from('promoters')
      .select('id, user_id')
      .eq('id', id)
      .maybeSingle();

    if (!promoter) return NextResponse.json({ error: 'Promoter not found' }, { status: 404 });
    if (promoter.user_id !== user.id) {
      return NextResponse.json({ error: 'You do not own this promoter profile' }, { status: 403 });
    }

    const updates: Record<string, any> = {};
    for (const key of ALLOWED) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No editable fields provided' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('promoters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ promoter: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}