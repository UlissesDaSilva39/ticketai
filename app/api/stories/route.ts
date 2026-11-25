import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type StoryRow = { id: string; author_id: string; media_url: string; media_type: "image" | "video"; caption: string | null; created_at: string };

// GET: active stories grouped by author: me first, then people I follow, then others;
// unseen groups before seen ones. Each group: { authorId, name, avatar, isMe, allSeen, items[] }.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ groups: [] });

  const { data: rows, error } = await supabase
    .from("stories")
    .select("id, author_id, media_url, media_type, caption, created_at")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .limit(300);
  if (error) return NextResponse.json({ groups: [], error: "Could not load stories" }, { status: 500 });

  const stories = (rows ?? []) as StoryRow[];
  const authorIds = [...new Set([user.id, ...stories.map((s) => s.author_id)])];
  const ids = stories.map((s) => s.id);

  const [{ data: profiles }, { data: views }, { data: follows }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", authorIds),
    ids.length
      ? supabase.from("story_views").select("story_id").eq("viewer_id", user.id).in("story_id", ids)
      : Promise.resolve({ data: [] as { story_id: string }[] }),
    supabase.from("follows").select("target_id").eq("follower_id", user.id).eq("target_type", "user"),
  ]);

  const seen = new Set((views ?? []).map((v) => v.story_id));
  const followed = new Set((follows ?? []).map((f) => f.target_id as string));
  const prof = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

  const byAuthor = new Map<string, StoryRow[]>();
  byAuthor.set(user.id, []); // always show "Your story"
  for (const s of stories) byAuthor.set(s.author_id, [...(byAuthor.get(s.author_id) ?? []), s]);

  const groups = [...byAuthor.entries()].map(([authorId, items]) => {
    const p = prof[authorId];
    const name = authorId === user.id ? "Your story" : (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";
    return {
      authorId,
      name,
      username: p?.username ?? null,
      avatar: p?.avatar_url ?? null,
      isMe: authorId === user.id,
      allSeen: items.every((i) => seen.has(i.id)),
      latest: items.length ? items[items.length - 1].created_at : "",
      items: items.map((i) => ({
        id: i.id,
        kind: i.media_type,
        url: i.media_url,
        caption: i.caption,
        createdAt: new Date(i.created_at).getTime(),
        seen: seen.has(i.id),
      })),
    };
  });

  const rank = (g: (typeof groups)[number]) => (g.isMe ? 0 : (g.allSeen ? 2 : 0) + (followed.has(g.authorId) ? 0 : 1) + 1);
  groups.sort((a, b) => rank(a) - rank(b) || b.latest.localeCompare(a.latest));

  return NextResponse.json({ groups: groups.filter((g) => g.isMe || g.items.length > 0).slice(0, 30) });
}

// POST: create a story from media already uploaded to post-media (see /api/posts/media-url).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!rateLimit(`story-create:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've shared a lot of stories this hour. Try again later." }, { status: 429 });
  }

  let body: { mediaUrl?: string; mediaType?: string; caption?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  // Only the user's own uploads in our bucket.
  const ownPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-media/${user.id}/`;
  if (typeof body.mediaUrl !== "string" || !body.mediaUrl.startsWith(ownPrefix)) {
    return NextResponse.json({ error: "Media must be uploaded through GRID." }, { status: 400 });
  }
  if (body.mediaType !== "image" && body.mediaType !== "video") {
    return NextResponse.json({ error: "Stories can be a photo or a video." }, { status: 400 });
  }
  const caption = typeof body.caption === "string" ? body.caption.trim().slice(0, 140) || null : null;

  const { data, error } = await supabase
    .from("stories")
    .insert({ author_id: user.id, media_url: body.mediaUrl, media_type: body.mediaType, caption })
    .select("id, media_url, media_type, caption, created_at")
    .single();
  if (error || !data) return NextResponse.json({ error: "Could not share your story." }, { status: 500 });

  return NextResponse.json({
    item: { id: data.id, kind: data.media_type, url: data.media_url, caption: data.caption, createdAt: new Date(data.created_at).getTime(), seen: true },
  });
}
