import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { openToLabels } from "@/lib/open-to";

export const dynamic = "force-dynamic";

// GET /api/network/catchup: "Catch up" with your music network, built only from
// real activity of people you're connected to or follow:
//   release     new tracks they posted
//   show        upcoming events they host or are going to
//   open        they're open to collabs / bookings / sessions / hiring
//   connection  people you recently connected with
//   joined      new members near you
//   anniversary GRID anniversaries
// Message buttons only pre-type a draft; nothing is ever sent automatically.

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

type CatchupType = "release" | "show" | "open" | "connection" | "joined" | "anniversary";

const DAY = 86_400_000;
const nameOf = (p: { full_name: string | null; username: string | null }) =>
  (p.full_name && !p.full_name.includes("@") ? p.full_name : p.username) || "GRID member";
const firstName = (n: string) => n.split(" ")[0];
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const [{ data: me }, { data: friendships }, { data: follows }] = await Promise.all([
    supabase.from("profiles").select("city").eq("id", user.id).maybeSingle(),
    supabase.from("friendships").select("user_id, friend_id, status, created_at").or(`user_id.eq.${user.id},friend_id.eq.${user.id}`),
    supabase.from("follows").select("target_id").eq("follower_id", user.id).eq("target_type", "user"),
  ]);

  const connected = new Map<string, string>(); // id -> friendship date
  const sent = new Set<string>();
  const received = new Set<string>();
  for (const f of friendships ?? []) {
    const other = f.user_id === user.id ? f.friend_id : f.user_id;
    if (f.status === "accepted") connected.set(other, f.created_at);
    else if (f.status === "pending") (f.user_id === user.id ? sent : received).add(other);
  }
  const followingSet = new Set((follows ?? []).map((f) => f.target_id as string));
  const circle = [...new Set([...connected.keys(), ...followingSet])].filter((id) => id !== user.id);

  const now = Date.now();
  const since60 = new Date(now - 60 * DAY).toISOString();

  // Activity from my circle, in parallel.
  const [{ data: circleProfiles }, { data: releases }, { data: hosted }, { data: going }, { data: newbies }] = await Promise.all([
    circle.length ? supabase.from("profiles").select(COLS).in("id", circle) : Promise.resolve({ data: [] as Row[] }),
    circle.length
      ? supabase
          .from("posts")
          .select("id, author_id, audio_url, audio_title, created_at")
          .in("author_id", circle)
          .not("audio_url", "is", null)
          .gte("created_at", since60)
          .order("created_at", { ascending: false })
          .limit(30)
      : Promise.resolve({ data: [] as { id: string; author_id: string; audio_url: string; audio_title: string | null; created_at: string }[] }),
    circle.length
      ? supabase
          .from("events")
          .select("id, organizer_id, title, start_date, venue_name, venue_city, status, is_test")
          .in("organizer_id", circle)
          .gte("start_date", new Date(now).toISOString())
          .order("start_date", { ascending: true })
          .limit(20)
      : Promise.resolve({ data: [] as EventRow[] }),
    circle.length
      ? supabase.from("event_interest").select("user_id, event_id, status, created_at").in("user_id", circle).eq("status", "going").limit(60)
      : Promise.resolve({ data: [] as { user_id: string; event_id: string; status: string; created_at: string }[] }),
    me?.city
      ? supabase
          .from("profiles")
          .select(COLS)
          .eq("is_public", true)
          .not("username", "is", null)
          .neq("id", user.id)
          .ilike("city", me.city)
          .gte("created_at", new Date(now - 30 * DAY).toISOString())
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] as Row[] }),
  ]);

  // Events people in my circle are going to (upcoming only).
  type EventRow = { id: string; organizer_id: string | null; title: string | null; start_date: string | null; venue_name: string | null; venue_city: string | null; status: string | null; is_test: boolean | null };
  const goingEventIds = [...new Set((going ?? []).map((g) => g.event_id))];
  const { data: goingEvents } = goingEventIds.length
    ? await supabase.from("events").select("id, organizer_id, title, start_date, venue_name, venue_city, status, is_test").in("id", goingEventIds)
    : { data: [] as EventRow[] };
  const live = (e: EventRow) => !e.is_test && !["draft", "cancelled", "canceled"].includes((e.status ?? "").toLowerCase()) && !!e.start_date && new Date(e.start_date).getTime() >= now;
  const eventById = new Map(((goingEvents ?? []) as EventRow[]).filter(live).map((e) => [e.id, e]));

  const people = new Map<string, Row>();
  for (const p of [...((circleProfiles ?? []) as Row[]), ...((newbies ?? []) as Row[])]) people.set(p.id, p);

  const status = (id: string) => (connected.has(id) ? "connected" : sent.has(id) ? "sent" : received.has(id) ? "received" : "none");
  const person = (p: Row) => ({
    id: p.id,
    name: nameOf(p),
    username: p.username,
    avatar: p.avatar_url,
    role: p.role,
    genre: p.genre,
    city: p.city,
    headline: p.headline || (p.bio ? p.bio.split("\n")[0].slice(0, 100) : null),
    openTo: p.open_to ?? [],
    connection: status(p.id),
    following: followingSet.has(p.id),
  });

  type Item = {
    key: string;
    type: CatchupType;
    date: string;
    person: ReturnType<typeof person>;
    text: string;
    detail: string | null;
    href: string | null;
    audio: { url: string; title: string } | null;
    draft: string | null;
    action: string | null;
  };
  const items: Item[] = [];
  const push = (it: Omit<Item, "person"> & { personId: string }) => {
    const p = people.get(it.personId);
    if (!p || !p.username) return;
    const { personId: _omit, ...rest } = it;
    void _omit;
    items.push({ ...rest, person: person(p) });
  };

  // New releases
  for (const r of releases ?? []) {
    const p = people.get(r.author_id);
    if (!p) continue;
    const title = r.audio_title?.trim() || "a new track";
    push({
      key: `release:${r.id}`,
      type: "release",
      personId: r.author_id,
      date: r.created_at,
      text: `released ${r.audio_title ? `“${title}”` : title}`,
      detail: `Posted ${shortDate(r.created_at)}`,
      href: `/u/${p.username}`,
      audio: { url: r.audio_url, title },
      draft: `Congrats on ${r.audio_title ? `“${title}”` : "the new release"}, ${firstName(nameOf(p))}! Just had a listen 🔥`,
      action: "Congratulate",
    });
  }

  // Upcoming shows they host
  const seenShow = new Set<string>();
  for (const e of ((hosted ?? []) as EventRow[]).filter(live)) {
    if (!e.organizer_id) continue;
    seenShow.add(`${e.organizer_id}:${e.id}`);
    const where = [e.venue_name, e.venue_city].filter(Boolean).join(", ");
    push({
      key: `show:${e.organizer_id}:${e.id}`,
      type: "show",
      personId: e.organizer_id,
      date: e.start_date!,
      text: `has a show coming up: ${e.title ?? "Untitled event"}`,
      detail: `${new Date(e.start_date!).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}${where ? ` · ${where}` : ""}`,
      href: `/events/${e.id}`,
      audio: null,
      draft: `Good luck with ${e.title ?? "the show"}! 🎤`,
      action: "Wish luck",
    });
  }
  // ...and shows they're going to
  for (const g of going ?? []) {
    const e = eventById.get(g.event_id);
    if (!e || seenShow.has(`${g.user_id}:${e.id}`)) continue;
    seenShow.add(`${g.user_id}:${e.id}`);
    push({
      key: `going:${g.user_id}:${e.id}`,
      type: "show",
      personId: g.user_id,
      date: e.start_date!,
      text: `is going to ${e.title ?? "an event"}`,
      detail: `${new Date(e.start_date!).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}${e.venue_city ? ` · ${e.venue_city}` : ""}`,
      href: `/events/${e.id}`,
      audio: null,
      draft: `Saw you're going to ${e.title ?? "this event"} — fancy meeting up there?`,
      action: "Meet up",
    });
  }

  // Open to collabs / bookings / sessions / hiring
  for (const p of (circleProfiles ?? []) as Row[]) {
    const labels = openToLabels(p.open_to ?? []);
    if (!labels.length) continue;
    const PHRASE: Record<string, string> = { collabs: "collabs", bookings: "bookings", session_work: "session work", hiring: "hiring talent" };
    const what = labels.map((l) => PHRASE[l.value] ?? l.value).join(", ").replace(/, ([^,]*)$/, " & $1");
    push({
      key: `open:${p.id}`,
      type: "open",
      personId: p.id,
      date: p.created_at,
      text: `is open to ${what}`,
      detail: p.headline || p.city || null,
      href: `/u/${p.username}`,
      audio: null,
      draft: `Hi ${firstName(nameOf(p))}, I saw you're open to ${what}. I'd love to chat about working together.`,
      action: "Reach out",
    });
  }

  // Recently connected
  for (const [id, at] of connected) {
    if (new Date(at).getTime() < now - 60 * DAY) continue;
    const p = people.get(id);
    if (!p) continue;
    push({
      key: `connection:${id}`,
      type: "connection",
      personId: id,
      date: at,
      text: "is now a connection",
      detail: `Connected ${shortDate(at)}`,
      href: `/u/${p.username}`,
      audio: null,
      draft: `Great to connect, ${firstName(nameOf(p))}! What are you working on at the moment?`,
      action: "Say hi",
    });
  }

  // New members near me (not already in my circle)
  for (const p of (newbies ?? []) as Row[]) {
    if (connected.has(p.id) || followingSet.has(p.id)) continue;
    push({
      key: `joined:${p.id}`,
      type: "joined",
      personId: p.id,
      date: p.created_at,
      text: "joined GRID",
      detail: [p.city, shortDate(p.created_at)].filter(Boolean).join(" · "),
      href: `/u/${p.username}`,
      audio: null,
      draft: `Welcome to GRID, ${firstName(nameOf(p))}! 👋`,
      action: "Welcome",
    });
  }

  // GRID anniversaries in the last 14 days (1+ years)
  for (const p of (circleProfiles ?? []) as Row[]) {
    const joined = new Date(p.created_at);
    const years = new Date(now).getFullYear() - joined.getFullYear();
    if (years < 1) continue;
    const anniv = new Date(joined);
    anniv.setFullYear(joined.getFullYear() + years);
    const diff = now - anniv.getTime();
    if (diff < 0 || diff > 14 * DAY) continue;
    push({
      key: `anniversary:${p.id}`,
      type: "anniversary",
      personId: p.id,
      date: anniv.toISOString(),
      text: `celebrates ${years} year${years === 1 ? "" : "s"} on GRID`,
      detail: shortDate(anniv.toISOString()),
      href: `/u/${p.username}`,
      audio: null,
      draft: `Happy ${years}-year GRID anniversary, ${firstName(nameOf(p))}! 🎉`,
      action: "Congratulate",
    });
  }

  // Shows sorted soonest-first; everything else newest-first.
  const showItems = items.filter((i) => i.type === "show").sort((a, b) => a.date.localeCompare(b.date));
  const rest = items.filter((i) => i.type !== "show").sort((a, b) => b.date.localeCompare(a.date));
  const ordered = [...rest.filter((i) => i.type === "release"), ...showItems, ...rest.filter((i) => i.type !== "release")];

  const counts = { release: 0, show: 0, open: 0, connection: 0, joined: 0, anniversary: 0 } as Record<CatchupType, number>;
  for (const i of ordered) counts[i.type]++;

  return NextResponse.json({ items: ordered.slice(0, 80), counts, circleSize: circle.length });
}
