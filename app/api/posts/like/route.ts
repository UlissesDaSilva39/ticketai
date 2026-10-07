import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { postId } = await req.json();
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    const { data: post } = await supabase.from("posts").select("like_count").eq("id", postId).single();
    const next = Math.max((post?.like_count ?? 1) - 1, 0);
    await supabase.from("posts").update({ like_count: next }).eq("id", postId);
    return NextResponse.json({ liked: false, likeCount: next });
  }

  await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  const { data: post } = await supabase.from("posts").select("like_count").eq("id", postId).single();
  const next = (post?.like_count ?? 0) + 1;
  await supabase.from("posts").update({ like_count: next }).eq("id", postId);
  return NextResponse.json({ liked: true, likeCount: next });
}