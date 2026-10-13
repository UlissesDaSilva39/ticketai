"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { Heart, MessageCircle, Share2, Send, Link as LinkIcon, Check } from "lucide-react";
import { toggleLike, addComment, incrementShare } from "@/app/home/actions";

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
  const [shares, setShares] = useState(initialShares);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [commentError, setCommentError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  function getUrl() {
    if (typeof window === "undefined") return "";
    return window.location.origin + "/post/" + postId;
  }

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

  function bumpShareCount() {
    setShares((n) => n + 1);
    startTransition(async () => {
      await incrementShare(postId);
    });
  }

  async function copyLink() {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setMenuOpen(false);
      bumpShareCount();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  function openShare(platform: "twitter" | "whatsapp" | "email") {
    const url = getUrl();
    const text = encodeURIComponent("Check this out on GRID");
    const encoded = encodeURIComponent(url);
    let target = "";
    if (platform === "twitter") {
      target = "https://twitter.com/intent/tweet?text=" + text + "&url=" + encoded;
    } else if (platform === "whatsapp") {
      target = "https://wa.me/?text=" + text + "%20" + encoded;
    } else {
      target = "mailto:?subject=" + text + "&body=" + encoded;
    }
    window.open(target, "_blank", "noopener,noreferrer");
    setMenuOpen(false);
    bumpShareCount();
  }

  async function nativeShare() {
    const url = getUrl();
    if (navigator.share) {
      try {
        await navigator.share({ url, title: "GRID" });
        bumpShareCount();
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }

  function onShareClick() {
    startTransition(async () => {
      const shared = await nativeShare();
      if (!shared) setMenuOpen((v) => !v);
    });
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

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={onShareClick}
            aria-label="Share"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
          >
            {copied ? (
              <Check size={16} aria-hidden="true" className="text-green-600" />
            ) : (
              <Share2 size={16} aria-hidden="true" />
            )}
            <span>{copied ? "Copied" : shares}</span>
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute z-20 bottom-full mb-2 left-0 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden text-sm"
            >
              <button
                role="menuitem"
                onClick={copyLink}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
              >
                <LinkIcon size={14} aria-hidden="true" />
                Copy link
              </button>
              <button
                role="menuitem"
                onClick={() => openShare("twitter")}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Share on X
              </button>
              <button
                role="menuitem"
                onClick={() => openShare("whatsapp")}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                WhatsApp
              </button>
              <button
                role="menuitem"
                onClick={() => openShare("email")}
                className="w-full text-left px-3 py-2 hover:bg-gray-50"
              >
                Email
              </button>
            </div>
          ) : null}
        </div>
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
