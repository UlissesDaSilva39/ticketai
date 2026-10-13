"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { toggleLike } from "@/app/home/actions";

type Props = {
  postId: string;
  initialLiked: boolean;
  initialLikes: number;
  comments: number;
  shares: number;
};

export default function PostActions({
  postId,
  initialLiked,
  initialLikes,
  comments,
  shares,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();
  const [shareLabel, setShareLabel] = useState("Share");

  function onLike() {
    const next = !liked;
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));
    startTransition(async () => {
      const res = await toggleLike(postId);
      if (res.error) {
        setLiked(!next);
        setLikes((n) => n + (next ? -1 : 1));
      }
    });
  }

  async function onShare() {
    const url = window.location.origin + "/post/" + postId;
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareLabel("Copied!");
        setTimeout(() => setShareLabel("Share"), 1500);
      }
    } catch {}
  }

  return (
    <div className="flex items-center gap-6 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
      <button
        type="button"
        onClick={onLike}
        disabled={isPending}
        aria-label={liked ? "Unlike" : "Like"}
        aria-pressed={liked}
        className="flex items-center gap-1.5 hover:text-red-600 transition-colors disabled:opacity-60"
      >
        <Heart
          size={16}
          aria-hidden="true"
          className={liked ? "fill-red-500 text-red-500" : ""}
        />
        <span>{likes}</span>
      </button>

      <button
        type="button"
        aria-label="Comments"
        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
      >
        <MessageCircle size={16} aria-hidden="true" />
        <span>{comments}</span>
      </button>

      <button
        type="button"
        onClick={onShare}
        aria-label="Share"
        className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
      >
        <Share2 size={16} aria-hidden="true" />
        <span>{shares}</span>
      </button>
    </div>
  );
}
