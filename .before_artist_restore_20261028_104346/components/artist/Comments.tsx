"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { timeAgo } from "@/lib/posts";

type Comment = {
  id: string;
  profile_id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: { id: string; username: string | null; full_name: string | null } | null;
};

export default function Comments({
  profileId,
  currentUserId,
  currentUserInitials,
}: {
  profileId: string;
  currentUserId: string | null;
  currentUserInitials: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/profile-comments?profileId=" + profileId);
      const data = await res.json();
      setComments(data.comments || []);
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const submit = async () => {
    if (!body.trim() || busy) return;
    setBusy(true);
    const text = body.trim();
    setBody("");
    try {
      await fetch("/api/profile-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, body: text }),
      });
      await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold">Comments</h2>
      </div>

      <div className="px-6 py-4 space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No comments yet. Say something nice.
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
              <div key={c.id} className="flex gap-3">
                <Link
                  href={c.author?.username ? "/u/" + c.author.username : "#"}
                  className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shrink-0"
                >
                  {initials}
                </Link>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <Link
                      href={c.author?.username ? "/u/" + c.author.username : "#"}
                      className="text-sm font-bold hover:underline"
                    >
                      {name}
                    </Link>
                    <span className="text-[10px] text-gray-500">
                      {timeAgo(c.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap break-words">
                    {c.body}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {currentUserId ? (
        <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3 bg-gray-50">
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold shrink-0">
            {currentUserInitials}
          </div>
          <input
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="Write a comment..."
            className="flex-1 text-sm px-4 py-2.5 bg-white border border-gray-300 rounded-full outline-none focus:border-black"
            disabled={busy}
          />
          <button
            onClick={submit}
            disabled={busy || !body.trim()}
            className="text-xs font-medium px-5 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      ) : (
        <div className="border-t border-gray-100 px-6 py-4 text-center bg-gray-50">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-black underline"
          >
            Sign in to comment
          </Link>
        </div>
      )}
    </div>
  );
}