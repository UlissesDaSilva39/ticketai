import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const PAGE = 24;
const PERSON_COLUMNS = "id, full_name, username, avatar_url, role, genre, city, bio, headline, open_to";

// GET /api/people?tab=discover|following|followers&q=&role=&city=&offset=
export async function GET(req: Request) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const url = new URL(req.url);
  const tab = url.searchParams.get("tab") ?? "discover";
  const clean = (v: string | null) => (v ?? "").trim().slice(0, 60).replace(/[%,()*]/g, " ");
  const q = clean(url.searchParams.get("q"));
  const role = clean(url.searchParams.get("role"));
  const city = clean(url.searchParams.get("city"));
  const offset = Math.max(0, parseInt(url.searchParams.get("offset") || "0", 10) || 0);

  // Who I follow (needed for every tab's Follow buttons).
  const { data: myFollows } = await supabase.from("follows").select("target_id").eq("follower_id", user.id).eq("target_type", "user");
  const followingSet = new Set((myFollows ?? []).map((f) => f.target_id as string));

  let ids: string[] | null = null;
  if (tab === "following") ids = [...followingSet];
  if (tab === "connections") {
    const { data: fr } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .limit(1000);
    ids = [...new Set((fr ?? []).map((f) => (f.user_id === user.id ? f.friend_id : f.user_id) as string))];
  }
  if (tab === "followers") {
    const { data: fans } = await supabase.from("follows").select("follower_id").eq("target_type", "user").eq("target_id", user.id).limit(500);
    ids = [...new Set((fans ?? []).map((f) => f.follower_id as string))];
  }
  if (ids && ids.length === 0) return NextResponse.json({ people: [], hasMore: false });

  let query = supabase.from("profiles").select(PERSON_COLUMNS).not("username", "is", null).neq("id", user.id);
  if (ids) query = query.in("id", ids);
  else query = query.eq("is_public", true);
  if (q) query = query.or(`full_name.ilike.%${q}%,username.ilike.%${q}%`);
  if (role) query = query.eq("role", role);
  if (city) query = query.ilike("city", `%${city}%`);

  const { data, error } = await query.order("created_at", { ascending: false }).range(offset, offset + PAGE - 1);
  if (error) return NextResponse.json({ error: "Could not load people" }, { status: 500 });

  const rows = data ?? [];
  const rowIds = rows.map((p) => p.id);
  const tiers: Record<string, "pro" | "premium"> = {};
  if (rowIds.length) {
    const { data: subs } = await createAdminClient()
      .from("subscriptions")
      .select("user_id, plan")
      .in("user_id", rowIds)
      .in("status", ["trialing", "active", "past_due"]);
    for (const s of subs ?? []) tiers[s.user_id] = s.plan === "premium" ? "premium" : "pro";
  }

  const people = rows.map((p) => ({
    id: p.id,
    name: (p.full_name && !p.full_name.includes("@") ? p.full_name : p.username) || "GRID member",
    username: p.username,
    avatar: p.avatar_url,
    role: p.role,
    genre: p.genre,
    city: p.city,
    bio: p.bio ? String(p.bio).slice(0, 140) : null,
    headline: p.headline || (p.bio ? String(p.bio).split("\n")[0].slice(0, 100) : null),
    openTo: (p.open_to as string[] | null) ?? [],
    following: followingSet.has(p.id),
    tier: tiers[p.id] ?? null,
  }));

  // Premium perk: Premium members first in Discover.
  if (tab === "discover") people.sort((a, b) => Number(b.tier === "premium") - Number(a.tier === "premium"));

  return NextResponse.json({ people, hasMore: rows.length === PAGE });
}
