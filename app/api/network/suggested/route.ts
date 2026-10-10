import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, role, city, avatar_url')
      .limit(12);
    return NextResponse.json({ suggested: profiles ?? [], reasons: {} });
  }

  const { data: follows } = await supabase
    .from('follows')
    .select('followed_id')
    .eq('follower_id', user.id);

  const alreadyFollowing = new Set((follows ?? []).map((f: any) => f.followed_id));
  alreadyFollowing.add(user.id);

  const { data: myProfile } = await supabase
    .from('profiles')
    .select('city, role')
    .eq('id', user.id)
    .maybeSingle();

  const { data: candidates } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, city, avatar_url')
    .limit(50);

  const ranked = (candidates ?? [])
    .filter((p: any) => !alreadyFollowing.has(p.id))
    .map((p: any) => {
      let score = 0;
      const reasons: string[] = [];
      if (myProfile?.city && p.city === myProfile.city) {
        score += 3;
        reasons.push(`In ${p.city}`);
      }
      if (myProfile?.role && p.role === myProfile.role) {
        score += 2;
        reasons.push(`Also a ${p.role}`);
      }
      return { ...p, score, reasons };
    })
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 12);

  const reasons: Record<string, string[]> = {};
  ranked.forEach((p: any) => { reasons[p.id] = p.reasons; });

  return NextResponse.json({ suggested: ranked, reasons });
}
