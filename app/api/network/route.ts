import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const COLS = "id, full_name, username, avatar_url, role, genre, city, created_at";
type Row = { id: string; full_name: string | null; username: string | null; avatar_url: string | null; role: string | null; genre: string | null; city: string | null; created_at: string };

// GET /api/network: counts, pending connection requests, and suggestion groups
// tailored for music (same genre, venues/promoters nearby, A&R and labels, artists nearby).
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [{ data: me }, { data: friendships }, { data: following }, { count: followers }] = await Promise.all([
    supabase.from("profiles").select("genre, city").eq("id", user.id).maybeSingle(),
    supabase.from("friendships").select("user_id, friend_id, status, created_at").or(`user_id.eq.${user.id},friend_id.eq.${user.id}`),
    supabase.from("follows").select("target_id").eq("follower_id", user.id).eq("target_type", "user"),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("target_type", "user").eq("target_id", user.id),
  ]);

  const fr = friendships ?? [];
  const connected = new Set<string>();
  const sent = new Set<string>();
  const incoming: { id: string; at: string }[] = [];
  for (const f of fr) {
    const other = f.user_id === user.id ? f.friend_id : f.user_id;
    if (f.status === "accepted") connected.add(other);
    else if (f.status === "pending" && f.user_id === user.id) sent.add(other);
    else if (f.status === "pending" && f.friend_id === user.id) incoming.push({ id: other, at: f.created_at });
  }
  const followingSet = new Set((following ?? []).map((f) => f.target_id as string));

  const status = (id: string) =>
    connected.has(id) ? "connected" : sent.has(id) ? "sent" : incoming.some((i) => i.id === id) ? "received" : "none";
  const toPerson = (p: Row) => ({
    id: p.id,
    name: (p.full_name && !p.full_name.includes("@") ? p.full_name : p.username) || "GRID member",
    username: p.username,
    avatar: p.avatar_url,
    role: p.role,
    genre: p.genre,
    city: p.city,
    connection: status(p.id),
    following: followingSet.has(p.id),
  });

  // Invitations: people who asked to connect with me.
  const incomingIds = incoming.map((i) => i.id);
  const { data: inviters } = incomingIds.length ? await supabase.from("profiles").select(COLS).in("id", incomingIds) : { data: [] as Row[] };
  const invitations = (inviters ?? []).map((p) => ({ ...toPerson(p as Row), requestedAt: incoming.find((i) => i.id === p.id)?.at ?? null }));

  // Suggestions: public members I'm not connected to and don't follow yet.
  const exclude = new Set([user.id, ...connected, ...sent, ...incomingIds, ...followingSet]);
  const { data: pool } = await supabase
    .from("profiles")
    .select(COLS)
    .eq("is_public", true)
    .not("username", "is", null)
    .neq("id", user.id)
    .order("created_at", { ascending: false })
    .limit(300);
  const candidates = ((pool ?? []) as Row[]).filter((p) => !exclude.has(p.id));
  const used = new Set<string>();
  const take = (pred: (p: Row) => boolean, n = 6) => {
    const out = candidates.filter((p) => !used.has(p.id) && pred(p)).slice(0, n);
    out.forEach((p) => used.add(p.id));
    return out.map(toPerson);
  };
  const lc = (v: string | null | undefined) => (v ?? "").toLowerCase().trim();
  const myGenre = lc(me?.genre);
  const myCity = lc(me?.city);

  const groups = [
    { id: "genre", title: myGenre ? `People in ${me?.genre}` : "Artists & producers", people: take((p) => (myGenre ? lc(p.genre) === myGenre : p.role === "artist")) },
    { id: "venues", title: myCity ? `Venues & promoters in ${me?.city}` : "Venues & promoters", people: take((p) => (p.role === "venue" || p.role === "promoter") && (!myCity || lc(p.city) === myCity)) },
    { id: "industry", title: "A&R and labels", people: take((p) => p.role === "a_and_r" || p.role === "record_company") },
    { id: "local", title: myCity ? `More people in ${me?.city}` : "New on GRID", people: take((p) => (myCity ? lc(p.city) === myCity : true)) },
  ].filter((g) => g.people.length > 0);

  // Catch up: who joined recently near me, and who accepted my requests recently.
  const monthAgo = Date.now() - 30 * 86_400_000;
  const newNearby = candidates
    .filter((p) => new Date(p.created_at).getTime() > monthAgo && (!myCity || lc(p.city) === myCity))
    .slice(0, 8)
    .map(toPerson);

  return NextResponse.json({
    counts: { connections: connected.size, following: followingSet.size, followers: followers ?? 0, invitations: invitations.length, sent: sent.size },
    invitations,
    groups,
    newNearby,
    hasProfileBasics: !!(me?.genre && me?.city),
  });
}
