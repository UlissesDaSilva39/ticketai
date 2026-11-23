"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

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

  const { data: created, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: user.id, body: trimmed })
    .select("id, post_id, author_id, body, created_at")
    .single();
  if (error || !created) return { error: error?.message ?? "Could not save your reply" };

  const count = await syncCommentCount(postId);

  const { data: me } = await supabase.from("profiles").select("full_name, username, avatar_url").eq("id", user.id).maybeSingle();

  revalidatePath("/home");
  return {
    ok: true,
    comment_count: count ?? undefined,
    comment: { ...created, author: toAuthor(me), mine: true } as FeedComment,
  };
}

export type FeedComment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: { name: string; username: string | null; avatar: string | null };
  mine: boolean;
};

function toAuthor(p: { full_name: string | null; username: string | null; avatar_url: string | null } | null) {
  const name = p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username;
  return { name: name || "GRID member", username: p?.username ?? null, avatar: p?.avatar_url ?? null };
}

// posts.comment_count is only writable by the post's author under RLS, so the
// server updates it with the service key after counting the real comments.
async function syncCommentCount(postId: string) {
  const admin = createAdminClient();
  const { count } = await admin.from("post_comments").select("id", { count: "exact", head: true }).eq("post_id", postId);
  if (typeof count === "number") await admin.from("posts").update({ comment_count: count }).eq("id", postId);
  return count;
}

/** Replies for one post, oldest first, with each author's name and photo. */
export async function getComments(postId: string): Promise<{ comments: FeedComment[] } | { error: string }> {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("post_comments")
    .select("id, post_id, author_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) return { error: "Could not load replies" };

  const ids = [...new Set((data ?? []).map((c) => c.author_id))];
  const { data: people } = ids.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", ids)
    : { data: [] };
  const byId = Object.fromEntries((people ?? []).map((p) => [p.id, p]));

  return {
    comments: (data ?? []).map((c) => ({ ...c, author: toAuthor(byId[c.author_id] ?? null), mine: !!user && c.author_id === user.id })),
  };
}

/** Delete your own reply. */
export async function deleteComment(commentId: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: c } = await supabase.from("post_comments").select("id, post_id, author_id").eq("id", commentId).maybeSingle();
  if (!c || c.author_id !== user.id) return { error: "Reply not found" };

  const { error } = await supabase.from("post_comments").delete().eq("id", commentId).eq("author_id", user.id);
  if (error) return { error: "Could not delete reply" };

  const count = await syncCommentCount(c.post_id);
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

/** Count a share. Logged-in only; each user counts once per post per hour. */
export async function incrementShare(postId: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const admin = createAdminClient();
  const { data: post } = await admin.from("posts").select("share_count").eq("id", postId).maybeSingle();
  if (!post) return { error: "Post not found" };

  // Re-sharing the same post doesn't inflate the count.
  if (!rateLimit(`share:${user.id}:${postId}`, 1, 60 * 60 * 1000).ok) {
    return { ok: true, share_count: post.share_count || 0 };
  }

  // posts is only writable by its author under RLS, so the server saves the count.
  const next = (post.share_count || 0) + 1;
  const { error } = await admin.from("posts").update({ share_count: next }).eq("id", postId);
  if (error) return { error: "Could not save" };
  return { ok: true, share_count: next };
}