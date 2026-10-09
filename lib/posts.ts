import type { SupabaseClient } from "@supabase/supabase-js";

export type PostAuthor = {
  id: string;
  username: string | null;
  full_name: string | null;
};

export type FeedPost = {
  id: string;
  author_id: string;
  artist_slug: string | null;
  artist?: { slug: string; name: string; avatar_url: string | null; verified: boolean } | null;
  author_type: string;
  body: string | null;
  event_id: string | null;
  audio_url: string | null;
  image_url: string | null;
  like_count: number;
  comment_count: number;
  share_count: number;
  created_at: string;
  author: PostAuthor | null;
  liked_by_me: boolean;
};

export type FeedEventSummary = {
  id: string;
  title: string;
  start_date: string | null;
  hero_image: string | null;
  ticket_types: Array<{ name: string; price: number; quantity: number }> | null;
};

export async function fetchFeed(
  supabase: SupabaseClient,
  opts: { userId: string | null; followingOnly?: boolean; limit?: number }
): Promise<FeedPost[]> {
  const limit = opts.limit ?? 30;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, author_id, author_type, artist_slug, body, event_id, audio_url, image_url, like_count, comment_count, share_count, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !posts) return [];

  const authorIds = Array.from(new Set(posts.map((p) => p.author_id)));

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, full_name")
    .in("id", authorIds);

  const profileMap = new Map<string, PostAuthor>();
  for (const p of profiles || []) profileMap.set(p.id, p);

  const artistSlugs = Array.from(new Set((posts as any[]).map((row) => row.artist_slug).filter(Boolean)));
  const { data: artists } = artistSlugs.length > 0
    ? await supabase.from("artists").select("slug, name, avatar_url, verified").in("slug", artistSlugs)
    : { data: [] as any[] };
  const artistMap = new Map<string, any>();
  for (const a of (artists as any[]) || []) artistMap.set(a.slug, a);

  let likedSet = new Set<string>();
  if (opts.userId) {
    const { data: likes } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", opts.userId)
      .in("post_id", posts.map((p) => p.id));
    likedSet = new Set((likes || []).map((l) => l.post_id));
  }

  return posts.map((p) => ({
    ...p,
    author: profileMap.get(p.author_id) ?? null,
    artist: (p as any).artist_slug ? artistMap.get((p as any).artist_slug) ?? null : null,
    liked_by_me: likedSet.has(p.id),
  }));
}

export async function fetchEventsForPosts(
  supabase: SupabaseClient,
  eventIds: string[]
): Promise<Map<string, FeedEventSummary>> {
  if (eventIds.length === 0) return new Map();

  const { data } = await supabase
    .from("events")
    .select("id, title, start_date, hero_image, ticket_types")
    .in("id", eventIds);

  const map = new Map<string, FeedEventSummary>();
  for (const e of data || []) map.set(e.id, e);
  return map;
}

export function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  const d = Math.floor(h / 24);
  if (d < 7) return d + "d";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export function priceFrom(types: Array<{ price: number }> | null): number | null {
  if (!types || types.length === 0) return null;
  const valid = types.map((t) => Number(t.price)).filter((n) => !isNaN(n));
  if (valid.length === 0) return null;
  return Math.min(...valid);
}