import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);

  const { data: posts } = await supabase
    .from("posts")
    .select("id, body, author_id, author_type, image_url, video_url, audio_url, audio_title, audio_artist, event_id, like_count, comment_count, share_count, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const list = posts || [];
  const authorIds = [...new Set(list.map((p) => p.author_id))];
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url, role, genre").in("id", authorIds)
    : { data: [] };

  const authors: Record<string, { name: string; username: string | null; avatar: string | null; role: string | null; genre: string | null; pro?: boolean }> = {};
  for (const p of profiles || []) {
    // Some older accounts saved their email as the name; never show emails publicly.
    const realName = p.full_name && !p.full_name.includes("@") ? p.full_name : null;
    authors[p.id] = {
      name: realName || p.username || "GRID member",
      username: p.username,
      avatar: p.avatar_url,
      role: p.role,
      genre: p.genre,
    };
  }

  const liked: Record<string, boolean> = {};
  if (user && list.length) {
    const { data: userLikes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", list.map((p) => p.id));
    for (const l of userLikes || []) liked[l.post_id] = true;
  }

  // Pro badge: which authors have an active subscription or free Pro grant.
  if (authorIds.length) {
    const admin = createAdminClient();
    const nowIso = new Date().toISOString();
    const [{ data: subs }, { data: grants }] = await Promise.all([
      admin.from("subscriptions").select("user_id").in("user_id", authorIds).in("status", ["trialing", "active", "past_due"]),
      admin.from("pro_grants").select("user_id").in("user_id", authorIds).gt("expires_at", nowIso),
    ]);
    for (const row of [...(subs ?? []), ...(grants ?? [])]) {
      if (authors[row.user_id]) authors[row.user_id].pro = true;
    }
  }

  // Attach shared events (title, date, venue, image) for event cards.
  const eventIds = [...new Set(list.map((p) => p.event_id).filter(Boolean))] as string[];
  const { data: events } = eventIds.length
    ? await supabase.from("events").select("id, title, start_date, venue_name, venue_city, hero_image").in("id", eventIds)
    : { data: [] };
  const eventsById = Object.fromEntries((events ?? []).map((e) => [e.id, e]));
  const postsWithEvents = list.map((p) => ({ ...p, event: p.event_id ? eventsById[p.event_id] ?? null : null }));

  // Which of these authors the viewer already follows (for the Follow button).
  const following: Record<string, boolean> = {};
  if (user && authorIds.length) {
    const { data: f } = await supabase
      .from("follows")
      .select("target_id")
      .eq("follower_id", user.id)
      .eq("target_type", "user")
      .in("target_id", authorIds);
    for (const row of f || []) following[row.target_id] = true;
  }

  return NextResponse.json({ posts: postsWithEvents, authors, liked, following, viewerId: user?.id ?? null });
}
