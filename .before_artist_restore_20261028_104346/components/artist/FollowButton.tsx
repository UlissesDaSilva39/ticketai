"use client";

import { useState, useTransition } from "react";

type Props = {
  targetId: string;
  targetType: string;
  initialFollowing: boolean;
};

export default function FollowButton({ targetId, targetType, initialFollowing }: Props) {
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onClick() {
    const next = !following;
    setFollowing(next);
    setError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/follows/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetType, targetId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data?.error || "Failed to update");
          setFollowing(!next);
        }
      } catch (e) {
        setError("Network error");
        setFollowing(!next);
      }
    });
  }

  return (
    <div className="shrink-0 flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={isPending}
        aria-pressed={following}
        aria-label={following ? "Unfollow" : "Follow"}
        className={
          "px-4 py-2 rounded-full text-sm font-medium transition disabled:opacity-60 " +
          (following
            ? "bg-white border border-black text-black hover:bg-gray-50"
            : "bg-black text-white hover:bg-gray-800")
        }
      >
        {following ? "Following" : "+ Follow"}
      </button>
      {error ? <p className="text-[10px] text-red-600">{error}</p> : null}
    </div>
  );
}
