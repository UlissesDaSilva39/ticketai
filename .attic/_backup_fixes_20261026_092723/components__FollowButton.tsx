"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserCheck } from "lucide-react";

type TargetType = "artist" | "promoter" | "venue" | "user";

type Props = {
  targetType: TargetType;
  targetId: string;
  initialFollowing: boolean;
  initialCount: number;
  signedIn: boolean;
  label?: string;
  variant?: "pill" | "compact" | "light" | "dark";
};

export default function FollowButton({
  targetType,
  targetId,
  initialFollowing,
  initialCount,
  signedIn,
  label,
  variant = "pill",
}: Props) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);

  const showLabel = label ?? (variant === "compact" ? "" : "Follow");

  async function toggle() {
    if (!signedIn) {
      const next = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push("/login?next=" + encodeURIComponent(next));
      return;
    }

    setBusy(true);
    const next = !following;
    setFollowing(next);
    setCount((n) => Math.max(n + (next ? 1 : -1), 0));

    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, following: next }),
      });

      if (!res.ok) {
        setFollowing(!next);
        setCount((n) => Math.max(n + (next ? -1 : 1), 0));
        return;
      }

      const data = await res.json();
      setFollowing(!!data.following);
      setCount(Number(data.count ?? 0));
    } catch {
      setFollowing(!next);
      setCount((n) => Math.max(n + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={following}
        aria-label={following ? "Unfollow" : "Follow"}
        className={
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full transition disabled:opacity-50 " +
          (following
            ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
            : "bg-black text-white hover:bg-gray-800")
        }
      >
        {following ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
        {following ? "Following" : "Follow"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={following}
      aria-label={
        following
          ? "Unfollow, " + count + " followers"
          : "Follow, " + count + " followers"
      }
      className={
        "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-full transition disabled:opacity-50 " +
        (following
          ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
          : "bg-black text-white hover:bg-gray-800")
      }
    >
      {following ? (
        <>
          <UserCheck className="h-4 w-4" />
          Following · {count}
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          {showLabel} · {count}
        </>
      )}
    </button>
  );
}