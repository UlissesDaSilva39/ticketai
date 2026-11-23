"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function toggleLike(postId: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in", liked: false };

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
    await supabase.from("posts").select("like_count").eq("id", postId).maybeSingle();
    revalidatePath("/home");
    return { liked: false };
  }

  const { error } = await supabase.from("post_likes").insert({
    post_id: postId,
    user_id: user.id,
  });
  if (error) return { error: error.message, liked: false };

  revalidatePath("/home");
  return { liked: true };
}

export async function addComment(postId: string, body: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Empty comment" };
  if (trimmed.length > 500) return { error: "Too long (max 500 characters)" };

  if (!rateLimit(`comment:${user.id}`, 20, 10 * 60 * 1000).ok) {
    return { error: "You're replying too fast. Try again in a few minutes." };
  }

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    author_id: user.id,
    body: trimmed,
  });
  if (error) return { error: error.message };

  // Keep posts.comment_count in step with the real number of comments.
  const { count } = await supabase
    .from("post_comments")
    .select("id", { count: "exact", head: true })
    .eq("post_id", postId);
  if (typeof count === "number") {
    await supabase.from("posts").update({ comment_count: count }).eq("id", postId);
  }

  revalidatePath("/home");
  return { ok: true, comment_count: count ?? undefined };
}

export async function hasLiked(postId: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  return !!data;
}

export async function incrementShare(postId: string) {
  const supabase = await createServerSupabase();
  const { data: post } = await supabase
    .from("posts")
    .select("share_count")
    .eq("id", postId)
    .maybeSingle();
  if (!post) return { error: "Post not found" };
  const next = (post.share_count || 0) + 1;
  const { error } = await supabase
    .from("posts")
    .update({ share_count: next })
    .eq("id", postId);
  if (error) return { error: error.message };
  return { ok: true, share_count: next };
}