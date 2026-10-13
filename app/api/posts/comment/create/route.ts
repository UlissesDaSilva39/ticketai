import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { postId?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const postId = (body.postId ?? "").trim();
  const text = (body.body ?? "").trim();
  if (!postId || !text) {
    return NextResponse.json({ error: "postId and body required" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  const { data: inserted, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: user.id, body: text })
    .select("id, post_id, author_id, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    comment: {
      ...inserted,
      author_name: profile?.full_name || profile?.username || "User",
      author_avatar: profile?.avatar_url ?? null,
    },
  });
}
