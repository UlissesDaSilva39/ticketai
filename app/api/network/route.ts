import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTier } from "@/lib/pro";
import { roleLabel } from "@/lib/display";

export const dynamic = "force-dynamic";

const COLS = "id, full_name, username, avatar_url, role, genre, city, created_at, headline, bio, open_to";
type Row = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: string | null;
  genre: string | null;
  city: string | null;
  created_at: string;
  headline: string | null;
  bio: string | null;
  open_to: string[] | null;
};

const nameOf = (p: { full_name: string | null; username: string | null }) =>
  (p.full_name && !p.full_name.includes("@") ? p.full_name : p.username) || "GRID member";

// GET /api/network: sidebar counts, pending connection requests, music-focused
// suggestion groups and "Catch up", each person with headline, Open-to badges
// and mutual connections.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [{ data: me }, { data: friendships }, { data: following }, { count: followers }, { count: events }] = await Promise.all([
    supabase.from("profiles").select("genre, city").eq("id", user.id).maybeSingle(),
    supabase.from("friendships").select("user_id, friend_id, status, created_at").or(`user_id.eq.${user.id},friend_id.eq.${user.id}`),
    supabase.from("follows").select("target_id, target_type").eq("follower_id", user.id),
    supabase.from("follows").select("id", { count: "exact", head: true }).eq("target_type", "user").eq("target_id", user.id),
    supabase.from("event_interest").select("id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const connected = new Set<string>();
  const sent = new Set<string>();
  const incoming: { id: string; at: string }[] = [];
  for (const f of friendships ?? []) {
    const other = f.user_id === user.id ? f.friend_id : f.user_id;
    if (f.status === "accepted") connected.add(other);
    else if (f.status === "pending" && f.user_id === user.id) sent.add(other);
    else if (f.status === "pending" && f.friend_id === user.id) incoming.push({ id: other, at: f.created_at });
  }
  const followRows = following ?? [];
  const followingSet = new Set(followRows.filter((f) => f.target_type === "user").map((f) => f.target_id as string));
  const pagesCount = followRows.filter((f) => f.target_type !== "user").length; // artists, venues, promoters

  // Invitations
  const incomingIds = incoming.map((i) => i.id);
  const { data: inviters } = incomingIds.length ? await supabase.from("profiles").select(COLS).in("id", incomingIds) : { data: [] as Row[] };

  // Suggestion pool: public members I'm not connected to and don't follow yet.
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
    return out;
  };
  const lc = (v: string | null | undefined) => (v ?? "").toLowerCase().trim();
  const myGenre = lc(me?.genre);
  const myCity = lc(me?.city);

  const rawGroups = [
    { id: "genre", title: myGenre ? `People in ${me?.genre}` : "Artists & producers", rows: take((p) => (myGenre ? lc(p.genre) === myGenre : p.role === "artist")) },
    { id: "open", title: "Open to collabs & bookings", rows: take((p) => (p.open_to ?? []).length > 0) },
    { id: "venues", title: myCity ? `Venues & promoters in ${me?.city}` : "Venues & promoters", rows: take((p) => (p.role === "venue" || p.role === "promoter") && (!myCity || lc(p.city) === myCity)) },
    { id: "industry", title: "A&R and labels", rows: take((p) => p.role === "a_and_r" || p.role === "record_company") },
    { id: "local", title: myCity ? `More people in ${me?.city}` : "New on GRID", rows: take((p) => (myCity ? lc(p.city) === myCity : true)) },
  ].filter((g) => g.rows.length > 0);

  const monthAgo = Date.now() - 30 * 86_400_000;
  const newNearbyRows = candidates.filter((p) => new Date(p.created_at).getTime() > monthAgo && (!myCity || lc(p.city) === myCity)).slice(0, 8);

  // Mutual connections for everyone we're about to show.
  const shown = [...((inviters ?? []) as Row[]), ...rawGroups.flatMap((g) => g.rows), ...newNearbyRows];
  const shownIds = [...new Set(shown.map((p) => p.id))];
  const theirConnections = new Map<string, Set<string>>();
  if (shownIds.length && connected.size) {
    const [a, b] = await Promise.all([
      supabase.from("friendships").select("user_id, friend_id").eq("status", "accepted").in("user_id", shownIds),
      supabase.from("friendships").select("user_id, friend_id").eq("status", "accepted").in("friend_id", shownIds),
    ]);
    for (const f of [...(a.data ?? []), ...(b.data ?? [])]) {
      for (const [person, other] of [
        [f.user_id, f.friend_id],
        [f.friend_id, f.user_id],
      ] as const) {
        if (!shownIds.includes(person) || !connected.has(other)) continue;
        if (!theirConnections.has(person)) theirConnections.set(person, new Set());
        theirConnections.get(person)!.add(other);
      }
    }
  }
  const mutualIds = [...new Set([...theirConnections.values()].flatMap((s) => [...s]))];
  const { data: mutualPeople } = mutualIds.length ? await supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", mutualIds) : { data: [] };
  const mutualName = Object.fromEntries((mutualPeople ?? []).map((p) => [p.id, nameOf(p)]));
  const mutualAvatar = Object.fromEntries((mutualPeople ?? []).map((p) => [p.id, p.avatar_url as string | null]));

  // "Who viewed your profile" (last 90 days). Premium sees who; others get anonymised hints.
  const tier = await getTier(user.id);
  const since = new Date(Date.now() - 90 * 86_400_000).toISOString();
  const admin = createAdminClient();
  const { data: viewRows, count: viewCount } = await admin
    .from("profile_views")
    .select("viewer_id, viewed_at", { count: "exact" })
    .eq("viewed_id", user.id)
    .gte("viewed_at", since)
    .order("viewed_at", { ascending: false })
    .limit(50);
  const latestByViewer = new Map<string, string>();
  for (const v of viewRows ?? []) if (!latestByViewer.has(v.viewer_id)) latestByViewer.set(v.viewer_id, v.viewed_at);
  const viewerIds = [...latestByViewer.keys()].slice(0, 10);
  const { data: viewerProfiles } = viewerIds.length
    ? await admin.from("profiles").select("id, full_name, username, avatar_url, headline, role, genre, city").in("id", viewerIds)
    : { data: [] };
  const vp = Object.fromEntries((viewerProfiles ?? []).map((p) => [p.id, p]));
  const premium = tier === "premium";
  const viewers = viewerIds
    .filter((id) => vp[id])
    .map((id) => {
      const p = vp[id];
      const role = roleLabel(p.role).replace(" / ", "/");
      const hint = `${p.role ? role : "Someone"}${p.city ? ` in ${p.city}` : " on GRID"}`;
      return premium
        ? { id, name: nameOf(p), username: p.username, avatar: p.avatar_url, headline: p.headline || hint, viewedAt: latestByViewer.get(id) }
        : { id: null, name: null, username: null, avatar: null, headline: hint, viewedAt: latestByViewer.get(id) }; // anonymised
    });

  const status = (id: string) => (connected.has(id) ? "connected" : sent.has(id) ? "sent" : incomingIds.includes(id) ? "received" : "none");
  const toPerson = (p: Row) => {
    const mutual = [...(theirConnections.get(p.id) ?? [])];
    return {
      id: p.id,
      name: nameOf(p),
      username: p.username,
      avatar: p.avatar_url,
      role: p.role,
      genre: p.genre,
      city: p.city,
      headline: p.headline || (p.bio ? p.bio.split("\n")[0].slice(0, 100) : null),
      openTo: p.open_to ?? [],
      mutualCount: mutual.length,
      mutualFirst: mutual[0] ? mutualName[mutual[0]] ?? null : null,
      mutualAvatars: mutual.slice(0, 2).map((m) => ({ name: mutualName[m] ?? "", avatar: mutualAvatar[m] ?? null })),
      connection: status(p.id),
      following: followingSet.has(p.id),
    };
  };

  return NextResponse.json({
    counts: {
      connections: connected.size,
      following: followingSet.size,
      followers: followers ?? 0,
      invitations: incoming.length,
      sent: sent.size,
      events: events ?? 0,
      pages: pagesCount,
    },
    invitations: ((inviters ?? []) as Row[]).map((p) => ({ ...toPerson(p), requestedAt: incoming.find((i) => i.id === p.id)?.at ?? null })),
    groups: rawGroups.map((g) => ({ id: g.id, title: g.title, people: g.rows.map(toPerson) })),
    newNearby: newNearbyRows.map(toPerson),
    hasProfileBasics: !!(me?.genre && me?.city),
    viewers: { premium, count: latestByViewer.size, total: viewCount ?? 0, items: viewers },
  });
}
