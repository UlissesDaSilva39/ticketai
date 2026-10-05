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

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      const data = await res.json();
      if (data.following !== undefined) {
        setFollowing(data.following);
        setCount((c) => c + (data.following ? 1 : -1));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
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