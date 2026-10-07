import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { postId, body } = await req.json();
  if (!postId || !body || !body.trim()) {
    return NextResponse.json({ error: "postId and body required" }, { status: 400 });
  }
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: user.id, body: body.trim() })
    .select("id, post_id, author_id, body, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: current } = await supabase
    .from("posts").select("comment_count").eq("id", postId).single();
  const next = (current?.comment_count ?? 0) + 1;
  await supabase.from("posts").update({ comment_count: next }).eq("id", postId);

  return NextResponse.json({ comment: data });
}