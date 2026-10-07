import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: comments, error } = await supabase
    .from("post_comments")
    .select("id, post_id, author_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const authorIds = Array.from(new Set((comments || []).map((c) => c.author_id)));
  let profiles: Array<{ id: string; username: string | null; full_name: string | null }> = [];
  if (authorIds.length > 0) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, full_name")
      .in("id", authorIds);
    profiles = data || [];
  }

  const map = new Map(profiles.map((p) => [p.id, p]));
  return NextResponse.json({
    comments: (comments || []).map((c) => ({ ...c, author: map.get(c.author_id) ?? null })),
  });
}