"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  initialOffset: number;
  pageSize?: number;
  renderPost: (post: any, author: any, liked: boolean, comments: any[]) => React.ReactNode;
};

export default function LoadMore({
  initialOffset,
  pageSize = 20,
  renderPost,
}: Props) {
  const [posts, setPosts] = useState<any[]>([]);
  const [authors, setAuthors] = useState<Record<string, any>>({});
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [offset, setOffset] = useState(initialOffset);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  async function load() {
    if (loading || done) return;
    setLoading(true);
    try {
      const res = await fetch("/api/feed?offset=" + offset + "&limit=" + pageSize);
      const data = await res.json();
      if (!data.posts || data.posts.length === 0) {
        setDone(true);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
        setAuthors((prev) => ({ ...prev, ...(data.authors || {}) }));
        setLiked((prev) => ({ ...prev, ...(data.liked || {}) }));
        setOffset((o) => o + data.posts.length);
      }
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) load();
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [offset, done, loading]);

  return (
    <>
      {posts.map((p) => renderPost(p, authors[p.author_id], liked[p.id] || false, []))}
      <div ref={sentinelRef} className="py-6 text-center text-xs text-gray-400">
        {done ? "— End of feed —" : loading ? "Loading…" : ""}
      </div>
    </>
  );
}
