"use client";

import { useState } from "react";

export default function MiniFollowButton({
  targetType,
  targetId,
  initialCount,
}: {
  targetType: "promoter" | "venue";
  targetId: string;
  initialCount: number;
}) {
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    setError(null);

    // Optimistic update
    const nextFollowing = !following;
    setFollowing(nextFollowing);
    setCount((c) => Math.max(0, c + (nextFollowing ? 1 : -1)));

    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      const data = await res.json();
      if (data.following !== undefined) {
        setFollowing(data.following);
        setCount(data.count !== undefined ? data.count : count);
      } else if (data.error) {
        // Roll back optimistic update
        setFollowing(following);
        setCount(count);
        setError(data.error);
        console.error("Follow toggle error:", data.error);
      }
    } catch (err) {
      setFollowing(following);
      setCount(count);
      const msg = err instanceof Error ? err.message : "Failed";
      setError(msg);
      console.error("Follow toggle exception:", err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      title={error || undefined}
      className={
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors " +
        (following
          ? "bg-gray-100 text-gray-700 border border-gray-300"
          : "border border-gray-300 text-gray-700 hover:border-black hover:text-black")
      }
    >
      {following ? "Following" : "Follow organizer"} · {count}
    </button>
  );
}