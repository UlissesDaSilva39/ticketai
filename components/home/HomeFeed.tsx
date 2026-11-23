"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { HypeIcon, ReplyIcon } from "@/components/MusicIcons";
import { addComment } from "@/app/home/actions";
import type { SavedPost } from "@/components/grid/GridComposer";
import { initials, roleLabel } from "@/lib/hooks/useMe";

type Author = { name: string; username: string | null; avatar: string | null; role: string | null; genre: string | null };
type FeedPost = SavedPost & { author_type?: string | null };

const PAGE = 10;

function timeAgo(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export type FeedMe = { id: string; name: string; username: string | null; avatar: string | null; role: string | null; genre: string | null };

/**
 * The home feed. `newPost` is a post the user just published; it's added to the top.
 */
export default function HomeFeed({ newPost, me }: { newPost: SavedPost | null; me: FeedMe | null }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [authors, setAuthors] = useState<Record<string, Author>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (offset: number) => {
    const res = await fetch(`/api/feed?offset=${offset}&limit=${PAGE}`, { credentials: "include", cache: "no-store" });
    if (!res.ok) throw new Error("Could not load the feed.");
    return (await res.json()) as { posts: FeedPost[]; authors: Record<string, Author>; liked: Record<string, boolean> };
  }, []);

  useEffect(() => {
    let alive = true;
    load(0)
      .then((d) => {
        if (!alive) return;
        setPosts(d.posts);
        setAuthors(d.authors);
        setLiked(d.liked);
        setHasMore(d.posts.length === PAGE);
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [load]);

  // Put a freshly published post on top (once).
  useEffect(() => {
    if (!newPost) return;
    setPosts((cur) => (cur.some((p) => p.id === newPost.id) ? cur : [newPost, ...cur]));
    if (me) setAuthors((a) => ({ ...a, [me.id]: { name: me.name, username: me.username, avatar: me.avatar, role: me.role, genre: me.genre } }));
  }, [newPost, me]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const d = await load(posts.length);
      setPosts((cur) => [...cur, ...d.posts.filter((p) => !cur.some((c) => c.id === p.id))]);
      setAuthors((a) => ({ ...a, ...d.authors }));
      setLiked((l) => ({ ...l, ...d.liked }));
      setHasMore(d.posts.length === PAGE);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function toggleHype(post: FeedPost) {
    const was = !!liked[post.id];
    // Optimistic update, then confirm with the server's real count.
    setLiked((l) => ({ ...l, [post.id]: !was }));
    setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, like_count: Math.max(0, (p.like_count ?? 0) + (was ? -1 : 1)) } : p)));
    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postId: post.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setLiked((l) => ({ ...l, [post.id]: data.liked }));
      setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, like_count: data.likeCount } : p)));
    } catch {
      setLiked((l) => ({ ...l, [post.id]: was }));
      setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, like_count: post.like_count } : p)));
    }
  }

  if (loading) {
    return (
      <div className="space-y-4" aria-label="Loading posts">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm animate-pulse">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-3 w-24 rounded bg-gray-100 dark:bg-zinc-800" />
                <div className="h-16 w-full rounded bg-gray-100 dark:bg-zinc-800 mt-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 text-center">
        <p className="font-bold text-gray-900 dark:text-white">No posts yet</p>
        <p className="text-sm text-gray-500 mt-1">Share your first update above, or follow some artists to fill your feed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          author={authors[post.author_id]}
          liked={!!liked[post.id]}
          onHype={() => toggleHype(post)}
          onCommented={(count) =>
            setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, comment_count: count ?? (p.comment_count ?? 0) + 1 } : p)))
          }
        />
      ))}

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-emerald-50 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          {loadingMore ? "Loading…" : "Show more posts"}
        </button>
      )}
    </div>
  );
}

function PostCard({
  post,
  author,
  liked,
  onHype,
  onCommented,
}: {
  post: FeedPost;
  author?: Author;
  liked: boolean;
  onHype: () => void;
  onCommented: (count?: number) => void;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const name = author?.name ?? "GRID member";
  const profileHref = author?.username ? `/u/${author.username}` : null;

  async function sendReply() {
    if (!reply.trim()) return;
    setSending(true);
    setReplyError(null);
    const res = await addComment(post.id, reply);
    setSending(false);
    if ("error" in res && res.error) return setReplyError(res.error);
    setReply("");
    setReplyOpen(false);
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    onCommented("comment_count" in res ? res.comment_count : undefined);
  }

  const avatar = author?.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-emerald-700 text-white grid place-items-center font-bold flex-shrink-0 text-lg">{initials(name)}</div>
  );

  return (
    <article className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
      <div className="flex items-start gap-3">
        {profileHref ? <Link href={profileHref}>{avatar}</Link> : avatar}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-base truncate">
            {profileHref ? <Link href={profileHref} className="hover:underline">{name}</Link> : name}
          </p>
          <p className="text-xs text-gray-500">
            {roleLabel(author?.role, author?.genre)} · <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
          </p>

          {post.body && <p className="text-[15px] text-gray-800 dark:text-gray-200 mt-3 whitespace-pre-wrap break-words">{post.body}</p>}

          {post.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image_url} alt="" loading="lazy" className="mt-3 w-full max-h-[480px] object-cover rounded-xl bg-gray-100 dark:bg-zinc-800" />
          )}
          {post.video_url && (
            <video src={post.video_url} controls playsInline preload="metadata" className="mt-3 w-full max-h-[480px] rounded-xl bg-black" />
          )}
          {post.audio_url && (
            <div className="mt-3 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 p-3">
              {(post.audio_title || post.audio_artist) && (
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {post.audio_title}
                  {post.audio_artist ? <span className="font-normal text-gray-500"> — {post.audio_artist}</span> : null}
                </p>
              )}
              <audio src={post.audio_url} controls preload="none" className="w-full" />
            </div>
          )}

          <div className="flex gap-8 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onHype}
              aria-pressed={liked}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${liked ? "text-emerald-600" : "text-gray-600 dark:text-gray-400 hover:text-emerald-600"}`}
            >
              <HypeIcon className="w-5 h-5" /> Hype{post.like_count ? ` (${post.like_count})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setReplyOpen((o) => !o)}
              aria-expanded={replyOpen}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <ReplyIcon className="w-5 h-5" /> Reply{post.comment_count ? ` (${post.comment_count})` : ""}
            </button>
            {sent && <span className="text-xs font-semibold text-emerald-600 self-center">Reply sent ✓</span>}
          </div>

          {replyOpen && (
            <div className="mt-3">
              <textarea
                rows={2}
                maxLength={500}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={`Reply to ${name}…`}
                aria-label={`Reply to ${name}`}
                className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
              {replyError && <p role="alert" className="text-xs text-red-600 mt-1">{replyError}</p>}
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setReplyOpen(false)} className="text-sm font-semibold text-gray-600 dark:text-gray-400 px-3 py-1.5">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-md"
                >
                  {sending ? "Sending…" : "Send reply"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
