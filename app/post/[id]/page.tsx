import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import PostCard from "@/components/feed/PostCard";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("posts")
    .select("body")
    .eq("id", id)
    .maybeSingle();
  return {
    title: data?.body ? data.body.slice(0, 60) : "Post",
    description: data?.body?.slice(0, 160) || "A post on GRID.",
    openGraph: {
      title: data?.body ? data.body.slice(0, 60) : "Post on GRID",
      description: data?.body?.slice(0, 160) || "",
      type: "article",
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("id, body, author_id, like_count, comment_count, share_count, created_at, image_url, audio_url")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  const { data: author } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url")
    .eq("id", post.author_id)
    .maybeSingle();

  const { data: liked } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: rawComments } = await supabase
    .from("post_comments")
    .select("id, author_id, body, created_at")
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  const commenterIds = [...new Set((rawComments || []).map((c) => c.author_id))];
  const { data: commenters } = commenterIds.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", commenterIds)
    : { data: [] };

  const commenterById: Record<string, { name: string; avatar: string | null }> = {};
  for (const c of commenters || []) {
    commenterById[c.id] = {
      name: c.full_name || c.username || "Someone",
      avatar: c.avatar_url,
    };
  }

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const postComments = (rawComments || []).map((c) => ({
    id: c.id,
    body: c.body,
    authorName: commenterById[c.author_id]?.name || "Someone",
    authorAvatar: commenterById[c.author_id]?.avatar || null,
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link
          href="/home"
          className="text-sm text-gray-500 hover:text-black mb-4 inline-block"
        >
          &larr; Back to feed
        </Link>
        <PostCard
          post={post}
          author={author ? {
            name: author.full_name || author.username || "Someone",
            username: author.username,
            avatar: author.avatar_url,
          } : null}
          liked={!!liked}
          comments={postComments}
          fmtTime={fmtTime}
        />
      </div>
    </div>
  );
}
