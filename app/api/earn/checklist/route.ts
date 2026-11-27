import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/earn/checklist: the member's "Start earning" steps and which are done.
// Any table that isn't set up yet simply counts as "not done".
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const admin = createAdminClient();
  const has = async (q: PromiseLike<{ count: number | null; error: unknown }>, min = 1) => {
    const { count, error } = await q;
    return !error && (count ?? 0) >= min;
  };
  const head = { count: "exact" as const, head: true };
  const [track, market, licence, backstage, live, invites] = await Promise.all([
    has(admin.from("posts").select("id", head).eq("author_id", user.id).not("audio_url", "is", null)),
    has(admin.from("marketplace_listings").select("id", head).eq("seller_id", user.id)),
    has(admin.from("licence_listings").select("id", head).eq("owner_id", user.id)),
    has(admin.from("backstage_tiers").select("id", head).eq("artist_id", user.id).eq("active", true)),
    has(admin.from("live_streams").select("id", head).eq("host_id", user.id)),
    has(admin.from("referrals").select("referred_id", head).eq("referrer_id", user.id), 3),
  ]);
  const steps = [
    { id: "track", title: "Share a track", text: "Fans can tip you from day one.", href: "/home#composer", done: track },
    { id: "sell", title: "List a beat, merch or licence", text: "Sell and license without leaving GRID.", href: "/marketplace", done: market || licence },
    { id: "backstage", title: "Open Backstage", text: "Monthly income from your biggest fans.", href: "/backstage", done: backstage },
    { id: "live", title: "Go live", text: "Earn gifts and sell while you play.", href: "/live/new", done: live },
    { id: "invite", title: "Invite 3 friends", text: "Get a free month of Pro.", href: "/home#invite", done: invites },
  ];
  return NextResponse.json({ steps, done: steps.filter((s) => s.done).length });
}
