import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, artists: [] });
  }

  const { data: artists } = await supabase
    .from('artists')
    .select('id, slug, name, status, owner_id')
    .eq('owner_id', user.id);

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    artists: artists ?? [],
  });
}
