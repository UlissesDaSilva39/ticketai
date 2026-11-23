import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(req.url);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);

  const { data: posts } = await supabase
    .from("posts")
    .select("id, body, author_id, author_type, image_url, video_url, audio_url, audio_title, audio_artist, like_count, comment_count, share_count, created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const list = posts || [];
  const authorIds = [...new Set(list.map((p) => p.author_id))];
  const { data: profiles } = authorIds.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url, role, genre").in("id", authorIds)
    : { data: [] };

  const authors: Record<string, { name: string; username: string | null; avatar: string | null; role: string | null; genre: string | null }> = {};
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

  return NextResponse.json({ posts: list, authors, liked });
}
