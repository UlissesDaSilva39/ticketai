"use client";

import { useState } from "react";

export default function FollowButton({
  organizerId,
  initialFollowing,
  initialCount,
}: {
  organizerId: string;
  initialFollowing: boolean;
  initialCount: number;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);

    const next = !following;
    setFollowing(next);
    setCount((c) => Math.max(c + (next ? 1 : -1), 0));

    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error(data.error);
      }
      setFollowing(data.following);
      setCount(data.count);
    } catch {
      setFollowing(!next);
      setCount((c) => Math.max(c + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={"inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition-colors " +
        (following
          ? "bg-white border-2 border-black text-black hover:bg-gray-50"
          : "bg-black text-white hover:bg-gray-800")}
    >
      {following ? (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Following
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Follow
        </>
      )}
      {count > 0 && (
        <span className={"ml-1 px-2 py-0.5 text-xs rounded-full " + (following ? "bg-gray-200" : "bg-white/20")}>
          {count}
        </span>
      )}
    </button>
  );
}
