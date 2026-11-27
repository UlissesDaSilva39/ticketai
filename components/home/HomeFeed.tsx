"use client";

import { useCallback, useEffect, useState } from "react";
import PromoteButton from "@/components/promote/PromoteButton";
import TipButton from "@/components/coins/TipButton";
import Link from "next/link";
import { HeartIcon, ReplyIcon, RocketIcon } from "@/components/MusicIcons";
import ShareMenu from "./ShareMenu";
import ProBadge from "@/components/ProBadge";
import { addComment, deleteComment, getComments, incrementShare, type FeedComment } from "@/app/home/actions";
import { eventDate, type SavedPost } from "@/components/grid/GridComposer";
import { initials, roleLabel } from "@/lib/hooks/useMe";

type Author = { name: string; username: string | null; avatar: string | null; role: string | null; genre: string | null; pro?: boolean; tier?: "pro" | "premium" };
type FeedPost = SavedPost & { author_type?: string | null; boosted?: boolean };

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

export type FeedMe = { id: string; name: string; username: string | null; avatar: string | null; role: string | null; genre: string | null; tier?: "free" | "pro" | "premium" };

/**
 * The home feed. `newPost` is a post the user just published; it's added to the top.
 */
export default function HomeFeed({ newPost, me }: { newPost: SavedPost | null; me: FeedMe | null }) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [authors, setAuthors] = useState<Record<string, Author>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [viewerId, setViewerId] = useState<string | null>(me?.id ?? null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (offset: number) => {
    const res = await fetch(`/api/feed?offset=${offset}&limit=${PAGE}`, { credentials: "include", cache: "no-store" });
    if (!res.ok) throw new Error("Could not load the feed.");
    return (await res.json()) as {
      posts: FeedPost[];
      authors: Record<string, Author>;
      liked: Record<string, boolean>;
      following?: Record<string, boolean>;
      viewerId?: string | null;
    };
  }, []);

  // Follow / unfollow a post's author (updates every post by that author).
  async function toggleFollow(authorId: string) {
    const next = !following[authorId];
    setFollowing((f) => ({ ...f, [authorId]: next }));
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetType: "user", targetId: authorId, following: next }),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setFollowing((f) => ({ ...f, [authorId]: !!d.following }));
    } catch {
      setFollowing((f) => ({ ...f, [authorId]: !next }));
    }
  }

  useEffect(() => {
    let alive = true;
    load(0)
      .then((d) => {
        if (!alive) return;
        setPosts(d.posts);
        setAuthors(d.authors);
        setLiked(d.liked);
        setFollowing(d.following ?? {});
        if (d.viewerId) setViewerId(d.viewerId);
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
      setFollowing((f) => ({ ...f, ...(d.following ?? {}) }));
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
          isMine={!!viewerId && post.author_id === viewerId}
          canBoost={!!viewerId && post.author_id === viewerId && me?.tier === "premium" && !post.boosted}
          onBoosted={() => setPosts((cur) => [{ ...post, boosted: true }, ...cur.filter((p) => p.id !== post.id)])}
          following={!!following[post.author_id]}
          onFollow={() => toggleFollow(post.author_id)}
          onShared={(count) => setPosts((cur) => cur.map((p) => (p.id === post.id ? { ...p, share_count: count } : p)))}
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
  isMine,
  following,
  onFollow,
  onShared,
  canBoost,
  onBoosted,
}: {
  canBoost: boolean;
  onBoosted: () => void;
  post: FeedPost;
  author?: Author;
  liked: boolean;
  onHype: () => void;
  onCommented: (count?: number) => void;
  isMine: boolean;
  following: boolean;
  onFollow: () => void;
  onShared: (count: number) => void;
}) {
  const [boostNote, setBoostNote] = useState<string | null>(null);
  const [confirmBoost, setConfirmBoost] = useState(false);
  const [boosting, setBoosting] = useState(false);
  async function boost() {
    setConfirmBoost(false);
    setBoosting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/boost`, { method: "POST", credentials: "include" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) return setBoostNote(d.error || "Could not boost.");
      setBoostNote("Boosted: pinned to the top of the feed for 24 hours.");
      onBoosted();
    } catch {
      setBoostNote("Couldn't reach the server. Try again.");
    } finally {
      setBoosting(false);
    }
  }

  // Count a share once the user copies the link or picks a destination.
  async function countShare() {
    try {
      const res = await incrementShare(post.id);
      if ("share_count" in res && typeof res.share_count === "number") onShared(res.share_count);
    } catch {
      /* count not saved: the link was still shared */
    }
  }
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [comments, setComments] = useState<FeedComment[] | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);

  const name = author?.name ?? "GRID member";
  const profileHref = author?.username ? `/u/${author.username}` : null;

  const FAILED = "Couldn't reach the server. Refresh the page and try again.";

  async function loadComments() {
    setLoadingComments(true);
    try {
      const res = await getComments(post.id);
      if ("comments" in res) setComments(res.comments);
      else setReplyError(res.error);
    } catch {
      setReplyError(FAILED);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  }

  // Reply button: open the box and show the existing replies.
  function toggleReplies() {
    const open = !replyOpen;
    setReplyOpen(open);
    if (open && comments === null) void loadComments();
  }

  async function sendReply() {
    if (!reply.trim()) return;
    setSending(true);
    setReplyError(null);
    let res: Awaited<ReturnType<typeof addComment>>;
    try {
      res = await addComment(post.id, reply);
    } catch {
      setSending(false);
      return setReplyError(FAILED);
    }
    setSending(false);
    if ("error" in res && res.error) return setReplyError(res.error);
    setReply("");
    if ("comment" in res && res.comment) {
      const c = res.comment;
      setComments((cur) => [...(cur ?? []), c]);
    }
    onCommented("comment_count" in res ? res.comment_count : undefined);
  }

  async function removeComment(id: string) {
    if (!window.confirm("Delete this reply?")) return;
    let res: Awaited<ReturnType<typeof deleteComment>>;
    try {
      res = await deleteComment(id);
    } catch {
      return setReplyError(FAILED);
    }
    if ("error" in res && res.error) return setReplyError(res.error);
    setComments((cur) => (cur ?? []).filter((c) => c.id !== id));
    onCommented("comment_count" in res ? res.comment_count : undefined);
  }

  const avatar = author?.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={author.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
  ) : (
    <div className="w-12 h-12 rounded-full bg-emerald-700 text-white grid place-items-center font-bold flex-shrink-0 text-lg">{initials(name)}</div>
  );

  return (
    <article className={`bg-white dark:bg-zinc-900 rounded-xl border p-5 shadow-sm ${post.boosted ? "border-violet-300 dark:border-violet-800" : "border-gray-200 dark:border-zinc-800"}`}>
      {post.boosted && <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-700 dark:text-violet-400"><RocketIcon className="w-3.5 h-3.5" /> Boosted</p>}
      <div className="flex items-start gap-3">
        {profileHref ? <Link href={profileHref}>{avatar}</Link> : avatar}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base truncate">
              {profileHref ? <Link href={profileHref} className="hover:underline">{name}</Link> : name}
            </p>
            {author?.pro && <ProBadge tier={author.tier} />}
            {!isMine && (
              <button
                type="button"
                onClick={onFollow}
                aria-pressed={following}
                className={`flex-shrink-0 text-xs font-bold px-3 py-0.5 rounded-full transition-colors ${
                  following
                    ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                    : "border border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400"
                }`}
              >
                {following ? "Following" : "+ Follow"}
              </button>
            )}
          </div>
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

          {post.event && (
            <Link
              href={`/events/${post.event.id}`}
              className="mt-3 flex overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-emerald-400 transition-colors"
            >
              {post.event.hero_image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.event.hero_image} alt="" className="w-28 object-cover bg-gray-100 dark:bg-zinc-800" />
              ) : (
                <span className="w-28 grid place-items-center bg-emerald-100 text-emerald-800 text-2xl">&#128197;</span>
              )}
              <span className="flex-1 min-w-0 p-3">
                <span className="block text-[11px] font-bold uppercase tracking-wide text-emerald-700">{eventDate(post.event.start_date)}</span>
                <span className="block font-semibold text-gray-900 dark:text-white truncate">{post.event.title}</span>
                <span className="block text-xs text-gray-500 truncate">
                  {[post.event.venue_name, post.event.venue_city].filter(Boolean).join(", ")}
                </span>
                <span className="mt-1 inline-block text-xs font-semibold text-emerald-700">View event &rarr;</span>
              </span>
            </Link>
          )}

          <div className="flex gap-8 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onHype}
              aria-pressed={liked}
              aria-label={liked ? "Unlike" : "Like"}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${liked ? "text-rose-600" : "text-gray-600 dark:text-gray-400 hover:text-rose-600"}`}
            >
              <HeartIcon filled={liked} /> Like{post.like_count ? ` (${post.like_count})` : ""}
            </button>
            <button
              type="button"
              onClick={toggleReplies}
              aria-expanded={replyOpen}
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${replyOpen ? "text-emerald-600" : "text-gray-600 dark:text-gray-400 hover:text-emerald-600"}`}
            >
              <ReplyIcon className="w-5 h-5" /> Reply{post.comment_count ? ` (${post.comment_count})` : ""}
            </button>
            <ShareMenu
              url={typeof window !== "undefined" ? `${window.location.origin}/post/${post.id}` : `/post/${post.id}`}
              text={post.body ?? `${name} on GRID`}
              label={`Share${post.share_count ? ` (${post.share_count})` : ""}`}
              onShared={countShare}
            />
            {!isMine && <TipButton targetType="post" targetId={post.id} creatorName={name} />}
            {canBoost && (
              <div className="ml-auto flex items-center gap-2">
                {confirmBoost ? (
                  <>
                    <span className="hidden sm:inline text-xs text-gray-500">Pin for 24h? Uses your 1 monthly boost.</span>
                    <button type="button" onClick={() => setConfirmBoost(false)} className="px-4 py-2 rounded-md text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                      Cancel
                    </button>
                    <button type="button" onClick={boost} className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-md transition-colors">
                      <RocketIcon className="w-3.5 h-3.5" /> Confirm boost
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmBoost(true)}
                    disabled={boosting}
                    title="Pin this post to the top of everyone's feed for 24 hours (Premium: 1 per month)"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-md transition-colors"
                  >
                    <RocketIcon className="w-3.5 h-3.5" /> {boosting ? "Boosting…" : "Boost post"}
                  </button>
                )}
              </div>
            )}
            {isMine && !post.boosted && (!canBoost || !!boostNote) && (
              <div className="ml-auto">
                <PromoteButton kind="post" refId={post.id} label="Promote" />
              </div>
            )}
          </div>
          {boostNote && <p role="status" className="mt-2 text-xs font-semibold text-violet-700 dark:text-violet-400">{boostNote}</p>}

          {replyOpen && (
            <ul className="mt-3 space-y-3" aria-label="Replies">
              {loadingComments && <li className="text-xs text-gray-500">Loading replies…</li>}
              {comments?.map((c) => (
                <li key={c.id} className="flex items-start gap-2">
                  {c.author.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.author.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-emerald-700 text-white grid place-items-center text-[11px] font-bold flex-shrink-0">
                      {initials(c.author.name)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1 rounded-xl bg-gray-50 dark:bg-zinc-800 px-3 py-2">
                    <p className="text-xs">
                      {c.author.username ? (
                        <Link href={`/u/${c.author.username}`} className="font-semibold text-gray-900 dark:text-white hover:underline">{c.author.name}</Link>
                      ) : (
                        <span className="font-semibold text-gray-900 dark:text-white">{c.author.name}</span>
                      )}
                      <span className="text-gray-500"> · {timeAgo(c.created_at)}</span>
                      {c.mine && (
                        <button type="button" onClick={() => removeComment(c.id)} className="ml-2 text-gray-400 hover:text-red-600">
                          Delete
                        </button>
                      )}
                    </p>
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{c.body}</p>
                  </div>
                </li>
              ))}
              {comments?.length === 0 && !loadingComments && <li className="text-xs text-gray-500">No replies yet. Be the first.</li>}
            </ul>
          )}

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
                  Hide replies
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
