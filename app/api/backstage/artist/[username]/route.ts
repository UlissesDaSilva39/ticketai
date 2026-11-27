import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isBackstageMember } from "@/lib/backstage/server";

export const dynamic = "force-dynamic";

// GET /api/backstage/artist/<username>: an artist's Backstage (tiers + posts; posts locked for non-members).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = createAdminClient();
  const { data: artist } = await admin.from("profiles").select("id, full_name, username, avatar_url, role, city, bio").eq("username", username).maybeSingle();
  if (!artist) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [tiersRes, postsRes, membersRes] = await Promise.all([
    admin.from("backstage_tiers").select("id, name, price_pence, perks").eq("artist_id", artist.id).eq("active", true).order("price_pence", { ascending: true }),
    admin.from("backstage_posts").select("id, body, media_url, created_at").eq("artist_id", artist.id).order("created_at", { ascending: false }).limit(30),
    admin.from("backstage_members").select("id", { count: "exact", head: true }).eq("artist_id", artist.id).in("status", ["active", "trialing", "past_due"]),
  ]);
  if (tiersRes.error) return NextResponse.json({ setupPending: true, tiers: [], posts: [] });
  const member = await isBackstageMember(artist.id, user?.id);
  return NextResponse.json({
    artist: { id: artist.id, name: artist.full_name && !artist.full_name.includes("@") ? artist.full_name : artist.username, username: artist.username, avatar: artist.avatar_url, role: artist.role, city: artist.city, bio: artist.bio ?? null },
    tiers: tiersRes.data ?? [],
    memberCount: membersRes.count ?? 0,
    isOwner: user?.id === artist.id,
    isMember: member,
    signedIn: !!user,
    posts: (postsRes.data ?? []).map((p) =>
      member ? { id: p.id, body: p.body, mediaUrl: p.media_url, createdAt: p.created_at, locked: false } : { id: p.id, body: "", mediaUrl: null, createdAt: p.created_at, locked: true } // nothing of a locked post leaves the server
    ),
  });
}
