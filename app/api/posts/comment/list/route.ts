import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const { data: comments, error } = await supabase
    .from("comments")
    .select("id, post_id, author_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const authorIds = Array.from(new Set((comments ?? []).map((c) => c.author_id).filter(Boolean)));
  let profiles: Record<string, { name: string; avatar_url: string | null }> = {};

  if (authorIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .in("id", authorIds);
    for (const p of profs ?? []) {
      profiles[p.id] = {
        name: p.full_name || p.username || "User",
        avatar_url: p.avatar_url ?? null,
      };
    }
  }

  const enriched = (comments ?? []).map((c) => ({
    id: c.id,
    post_id: c.post_id,
    author_id: c.author_id,
    body: c.body,
    created_at: c.created_at,
    author_name: profiles[c.author_id]?.name ?? "User",
    author_avatar: profiles[c.author_id]?.avatar_url ?? null,
  }));

  return NextResponse.json({ comments: enriched, count: enriched.length });
}
