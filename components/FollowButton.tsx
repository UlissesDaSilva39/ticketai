"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FollowButton({
  targetType,
  targetId,
  initialCount,
  label = "Follow",
  variant = "dark",
}: {
  targetType: "promoter" | "venue";
  targetId: string;
  initialCount: number;
  label?: string;
  variant?: "dark" | "light";
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    fetch(
      "/api/follows/status?targetType=" +
        targetType +
        "&targetId=" +
        targetId,
      { cache: "no-store" }
    )
      .then((r) => r.json())
      .then((d) => {
        setFollowing(Boolean(d.following));
        setCount(Number(d.count ?? initialCount));
        setSignedIn(Boolean(d.signedIn));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [targetType, targetId, initialCount]);

  async function toggle() {
    if (!signedIn) {
      router.push(
        "/login?next=" + encodeURIComponent(window.location.pathname)
      );
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setFollowing(Boolean(data.following));
      setCount(Number(data.count ?? count));
      router.refresh();
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }

  const base =
    "rounded-full px-5 py-2 text-sm font-medium transition disabled:opacity-50 ";

  const style =
    variant === "light"
      ? following
        ? base + "bg-white text-black hover:bg-gray-100"
        : base +
          "border-2 border-white text-white hover:bg-white hover:text-black"
      : following
      ? base + "bg-black text-white hover:bg-gray-800"
      : base +
        "border-2 border-black text-black hover:bg-black hover:text-white";

  return (
    <button type="button" onClick={toggle} disabled={loading} className={style}>
      {following ? "Following" : label} · {count}
    </button>
  );
}