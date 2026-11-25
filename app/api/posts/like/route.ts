import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Toggle a Hype (like). The like row is written as the user (RLS: own likes only);
// posts.like_count is recounted and saved with the service key, because RLS only
// lets a post's author update the post row.
export async function POST(req: NextRequest) {
  const { postId } = await req.json().catch(() => ({}));
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!rateLimit(`like:${user.id}`, 120, 10 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Slow down a little." }, { status: 429 });
  }

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
  } else {
    const { error } = await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    if (error && error.code !== "23505") return NextResponse.json({ error: "Could not save" }, { status: 500 });
  }

  const admin = createAdminClient();
  const { count } = await admin.from("post_likes").select("post_id", { count: "exact", head: true }).eq("post_id", postId);
  const likeCount = count ?? 0;
  await admin.from("posts").update({ like_count: likeCount }).eq("id", postId);

  return NextResponse.json({ liked: !existing, likeCount });
}
