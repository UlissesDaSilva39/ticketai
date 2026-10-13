"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author_name: string;
  author_avatar: string | null;
};

function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.floor((now - then) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m";
  if (s < 86400) return Math.floor(s / 3600) + "h";
  if (s < 604800) return Math.floor(s / 86400) + "d";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/London" });
}

export default function CommentSection({
  postId,
  initialCount = 0,
}: {
  postId: string;
  initialCount?: number;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/posts/comment/list?postId=" + encodeURIComponent(postId), { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setComments(d.comments ?? []);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [postId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;

    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/posts/comment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, body }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=" + encodeURIComponent(window.location.pathname);
        return;
      }
      if (!res.ok) {
        setError(data.error || "Failed to post comment");
        return;
      }
      setComments((c) => [...c, data.comment]);
      setText("");
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 border-t border-gray-100 pt-3" data-testid="comment-section">
      <div className="text-xs font-medium text-gray-500 mb-2">
        Comments ({comments.length + (loading && initialCount === 0 ? 0 : 0)})
      </div>

      {loading ? (
        <div className="text-xs text-gray-400 py-2">Loading…</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-gray-400 py-2">No comments yet. Be the first.</div>
      ) : (
        <ul className="space-y-3 mb-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2" data-testid="comment-item">
              {c.author_avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.author_avatar}
                  alt={c.author_name}
                  className="h-6 w-6 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 flex-shrink-0">
                  {c.author_name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs font-medium">{c.author_name}</span>
                  <span className="text-[10px] text-gray-400">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-line break-words">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="flex gap-2 mt-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          maxLength={2000}
          disabled={busy}
          className="flex-1 rounded-full border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50"
          data-testid="comment-input"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="rounded-full bg-black text-white px-4 py-1.5 text-xs font-medium hover:bg-gray-800 disabled:opacity-40 transition"
          data-testid="comment-submit"
        >
          {busy ? "Posting…" : "Post"}
        </button>
      </form>

      {error && (
        <div className="mt-2 rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700">{error}</div>
      )}
    </div>
  );
}
