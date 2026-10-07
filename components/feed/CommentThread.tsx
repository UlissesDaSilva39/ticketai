"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/posts";

type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: { id: string; username: string | null; full_name: string | null } | null;
};

export default function CommentThread({
  postId,
  currentUserId,
  currentUserInitials,
}: {
  postId: string;
  currentUserId: string | null;
  currentUserInitials: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/posts/comment/list?postId=" + postId);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const submit = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    const text = body.trim();
    setBody("");
    try {
      await fetch("/api/posts/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body: text }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-t border-gray-100 bg-gray-50">
      <div className="max-h-80 overflow-y-auto px-4 py-3 space-y-3">
        {loading ? (
          <p className="text-xs text-gray-500 text-center py-4">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No comments yet. Be the first.
          </p>
        ) : (
          comments.map((c) => {
            const name = c.author?.full_name || c.author?.username || "Someone";
            const initials = name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();
            return (
              <div key={c.id} className="flex gap-2">
                <Link
                  href={c.author?.username ? "/u/" + c.author.username : "#"}
                  className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0"
                >
                  {initials}
                </Link>
                <div className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2">
                  <div className="flex items-baseline gap-2">
                    <Link
                      href={c.author?.username ? "/u/" + c.author.username : "#"}
                      className="text-xs font-semibold hover:underline"
                    >
                      {name}
                    </Link>
                    <span className="text-[10px] text-gray-500">
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5 whitespace-pre-wrap break-words">
                    {c.body}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {currentUserId ? (
        <div className="border-t border-gray-200 bg-white px-4 py-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0">
            {currentUserInitials}
          </div>
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Add a comment..."
            className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-full outline-none focus:border-black"
            disabled={busy}
          />
          <button
            type="button"
            onClick={submit}
            disabled={busy || !body.trim()}
            className="text-xs font-medium px-3 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50"
          >
            {busy ? "..." : "Send"}
          </button>
        </div>
      ) : (
        <div className="border-t border-gray-200 bg-white px-4 py-3 text-center">
          <Link href="/login" className="text-xs text-gray-600 hover:text-black underline">
            Sign in to comment
          </Link>
        </div>
      )}
    </div>
  );
}