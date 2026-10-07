"use client";

import Link from "next/link";
import { useState } from "react";
import type { FeedPost as FeedPostType, FeedEventSummary } from "@/lib/posts";
import { timeAgo, priceFrom } from "@/lib/posts";

export default function FeedPost({
  post,
  event,
}: {
  post: FeedPostType;
  event: FeedEventSummary | null;
}) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likes, setLikes] = useState(post.like_count);
  const [busy, setBusy] = useState(false);

  const author = post.author;
  const name = author?.full_name || author?.username || "Someone";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const like = async () => {
    if (busy) return;
    setBusy(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((n) => (wasLiked ? Math.max(n - 1, 0) : n + 1));
    try {
      const res = await fetch("/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      const data = await res.json();
      if (typeof data.likeCount === "number") setLikes(data.likeCount);
      if (typeof data.liked === "boolean") setLiked(data.liked);
    } catch {
      setLiked(wasLiked);
      setLikes(post.like_count);
    } finally {
      setBusy(false);
    }
  };

  const fromPrice = event ? priceFrom(event.ticket_types) : null;

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <header className="flex items-center gap-3 p-4">
        <Link
          href={author?.username ? "/u/" + author.username : "#"}
          className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0"
        >
          {initials}
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            href={author?.username ? "/u/" + author.username : "#"}
            className="font-semibold text-sm hover:underline"
          >
            {name}
          </Link>
          <p className="text-xs text-gray-500">
            {post.author_type !== "user" ? "@" + (author?.username || "user") + " · " : ""}
            {timeAgo(post.created_at)}
          </p>
        </div>
      </header>

      {post.body ? (
        <p className="px-4 pb-3 text-sm whitespace-pre-wrap break-words">{post.body}</p>
      ) : null}

      {post.image_url ? (
        <div className="px-4 pb-3">
          <img src={post.image_url} alt="" className="w-full rounded-xl" />
        </div>
      ) : null}

      {post.audio_url ? (
        <div className="px-4 pb-3">
          <audio controls src={post.audio_url} className="w-full" />
        </div>
      ) : null}

      {event ? (
        <Link href={"/event/" + event.id} className="block mx-4 mb-3 border border-gray-200 rounded-xl overflow-hidden hover:bg-gray-50">
          {event.hero_image ? (
            <img src={event.hero_image} alt="" className="w-full aspect-[16/9] object-cover" />
          ) : null}
          <div className="p-3">
            <p className="font-semibold text-sm">{event.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {event.start_date
                ? new Date(event.start_date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })
                : "Date TBC"}
              {fromPrice !== null ? " · From £" + fromPrice.toFixed(2) : ""}
            </p>
          </div>
        </Link>
      ) : null}

      <footer className="flex items-center justify-around border-t border-gray-100 py-2 text-sm text-gray-600">
        <button
          onClick={like}
          disabled={busy}
          className={"flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 " + (liked ? "text-red-500" : "")}
        >
          <span>{liked ? "♥" : "♡"}</span>
          <span>{likes}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100">
          <span>💬</span>
          <span>{post.comment_count}</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100">
          <span>↗</span>
          <span>{post.share_count}</span>
        </button>
      </footer>
    </article>
  );
}