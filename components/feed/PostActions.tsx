"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle, Share2, Send } from "lucide-react";
import { toggleLike, addComment } from "@/app/home/actions";

type Props = {
  postId: string;
  initialLiked: boolean;
  initialLikes: number;
  initialComments: number;
  initialShares: number;
};

export default function PostActions({
  postId,
  initialLiked,
  initialLikes,
  initialComments,
  initialShares,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState(initialComments);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [commentError, setCommentError] = useState("");
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

  function onSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = commentBody.trim();
    if (!trimmed) return;
    setCommentError("");

    startTransition(async () => {
      const res = await addComment(postId, trimmed);
      if (res.error) {
        setCommentError(res.error);
        return;
      }
      setCommentBody("");
      setComments((n) => n + 1);
      setShowCommentBox(false);
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
    <div className="mt-3 pt-3 border-t border-gray-100">
      <div className="flex items-center gap-6 text-xs text-gray-500">
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
          onClick={() => setShowCommentBox((v) => !v)}
          aria-label={showCommentBox ? "Close comment box" : "Write a comment"}
          aria-expanded={showCommentBox}
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
          <span>{initialShares > 0 ? initialShares : shareLabel}</span>
        </button>
      </div>

      {showCommentBox ? (
        <form onSubmit={onSubmitComment} className="mt-3 flex items-start gap-2">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Write a comment..."
            aria-label="Write a comment"
            rows={2}
            maxLength={500}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-black focus:outline-none resize-none text-black placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={isPending || !commentBody.trim()}
            aria-label="Post comment"
            className="px-3 py-2 bg-black text-white rounded-xl text-sm disabled:opacity-50 hover:bg-gray-800 transition flex items-center gap-1"
          >
            <Send size={14} aria-hidden="true" />
            <span>Post</span>
          </button>
        </form>
      ) : null}

      {commentError ? (
        <p className="text-xs text-red-600 mt-2">{commentError}</p>
      ) : null}
    </div>
  );
}
