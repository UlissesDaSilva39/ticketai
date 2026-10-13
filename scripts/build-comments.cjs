const fs = require("fs");
const path = require("path");

function W(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("  ✅ " + rel + " (" + content.split("\n").length + " lines)");
}

// ---------- /api/posts/comment/list/route.ts ----------
W("app/api/posts/comment/list/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const url = new URL(req.url);
  const postId = url.searchParams.get("postId");

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const { data: comments, error } = await supabase
    .from("comments")
    .select("id, post_id, author_id, body, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const authorIds = Array.from(new Set((comments ?? []).map((c) => c.author_id).filter(Boolean)));
  let profiles: Record<string, { name: string; avatar_url: string | null }> = {};

  if (authorIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .in("id", authorIds);
    for (const p of profs ?? []) {
      profiles[p.id] = {
        name: p.full_name || p.username || "User",
        avatar_url: p.avatar_url ?? null,
      };
    }
  }

  const enriched = (comments ?? []).map((c) => ({
    id: c.id,
    post_id: c.post_id,
    author_id: c.author_id,
    body: c.body,
    created_at: c.created_at,
    author_name: profiles[c.author_id]?.name ?? "User",
    author_avatar: profiles[c.author_id]?.avatar_url ?? null,
  }));

  return NextResponse.json({ comments: enriched, count: enriched.length });
}
`);

// ---------- /api/posts/comment/create/route.ts ----------
W("app/api/posts/comment/create/route.ts", `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { postId?: string; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const postId = (body.postId ?? "").trim();
  const text = (body.body ?? "").trim();
  if (!postId || !text) {
    return NextResponse.json({ error: "postId and body required" }, { status: 400 });
  }
  if (text.length > 2000) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  const { data: inserted, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: user.id, body: text })
    .select("id, post_id, author_id, body, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  return NextResponse.json({
    comment: {
      ...inserted,
      author_name: profile?.full_name || profile?.username || "User",
      author_avatar: profile?.avatar_url ?? null,
    },
  });
}
`);

// ---------- components/feed/CommentSection.tsx ----------
W("components/feed/CommentSection.tsx", `"use client";

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
`);

// ---------- 5. Patch FeedPost.tsx ----------
const feedPath = "components/feed/FeedPost.tsx";
if (!fs.existsSync(feedPath)) {
  console.log("  ⚠️  " + feedPath + " not found — skipping patch");
} else {
  let src = fs.readFileSync(feedPath, "utf8");

  // Add import if missing
  if (!src.includes("CommentSection")) {
    // Insert after the last import line
    const importRe = /^import [^\n]+\n/mg;
    let lastMatch = null;
    let m;
    while ((m = importRe.exec(src)) !== null) lastMatch = m;
    if (lastMatch) {
      const insertAt = lastMatch.index + lastMatch[0].length;
      src = src.slice(0, insertAt) + 'import CommentSection from "@/components/feed/CommentSection";\n' + src.slice(insertAt);
      console.log("  ✅ Added CommentSection import to FeedPost.tsx");
    }
  } else {
    console.log("  ℹ️  FeedPost.tsx already imports CommentSection");
  }

  // Add <CommentSection> at the end of the component (before the final closing tag)
  // Look for the outermost closing </article> or </div>
  if (!src.includes("<CommentSection")) {
    const articleClose = src.lastIndexOf("</article>");
    const divClose = src.lastIndexOf("</div>");
    const targetIdx = articleClose !== -1 ? articleClose : divClose;

    if (targetIdx !== -1) {
      // Try to detect post id variable name (post.id, p.id, item.id, etc.)
      let postIdVar = "post.id";
      const idMatch = src.match(/\b(\w+)\.id\b/);
      if (idMatch) postIdVar = idMatch[1] + ".id";

      const insertion =
        "      <CommentSection postId={" + postIdVar + "} />\n";

      src = src.slice(0, targetIdx) + insertion + src.slice(targetIdx);
      console.log("  ✅ Inserted <CommentSection postId={" + postIdVar + "}> into FeedPost.tsx");
    } else {
      console.log("  ⚠️  Could not find closing </article> or </div> — patch manually");
    }
  } else {
    console.log("  ℹ️  FeedPost.tsx already renders <CommentSection>");
  }

  fs.writeFileSync(feedPath, src, "utf8");
}

console.log("");
console.log("All files written.");
