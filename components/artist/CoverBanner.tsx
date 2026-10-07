"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  artist: {
    id: string;
    full_name: string | null;
    username: string | null;
    genre: string | null;
    city: string | null;
    avatar_url: string | null;
    cover_image: string | null;
  };
  followerCount: number;
  isFollowing: boolean;
  isOwner: boolean;
};

export default function CoverBanner({ artist, followerCount, isFollowing, isOwner }: Props) {
  const [following, setFollowing] = useState(isFollowing);
  const [count, setCount] = useState(followerCount);
  const [busy, setBusy] = useState(false);

  const name = artist.full_name || artist.username || "Artist";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const subtitle = [artist.genre, artist.city].filter(Boolean).join(" · ");

  const toggleFollow = async () => {
    if (busy) return;
    setBusy(true);
    const prev = following;
    setFollowing(!prev);
    setCount((n) => (prev ? Math.max(n - 1, 0) : n + 1));
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "promoter", targetId: artist.id }),
      });
      const data = await res.json();
      if (typeof data.following === "boolean") setFollowing(data.following);
      if (typeof data.count === "number") setCount(data.count);
    } catch {
      setFollowing(prev);
      setCount(followerCount);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative">
      <div className="h-[360px] w-full bg-gradient-to-br from-black via-gray-800 to-gray-900 overflow-hidden">
        {artist.cover_image ? (
          <img
            src={artist.cover_image}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative">
        <div className="flex items-end gap-6 flex-wrap">
          <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl shrink-0 overflow-hidden">
            {artist.avatar_url ? (
              <img
                src={artist.avatar_url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          <div className="flex-1 min-w-0 pb-2">
            <h1
              className="text-4xl md:text-5xl font-bold tracking-tight uppercase"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              {name}
            </h1>
            {subtitle ? (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            ) : null}
            <p className="text-sm text-gray-500 mt-1">
              {count.toLocaleString()} follower{count === 1 ? "" : "s"}
            </p>
          </div>

          <div className="flex items-center gap-2 pb-2">
            {isOwner ? (
              <Link
                href="/profile/edit"
                className="px-5 py-2.5 text-sm font-medium rounded-full border-2 border-black hover:bg-gray-50"
              >
                Edit profile
              </Link>
            ) : (
              <button
                onClick={toggleFollow}
                disabled={busy}
                className={
                  "px-6 py-2.5 text-sm font-medium rounded-full transition-colors disabled:opacity-50 " +
                  (following
                    ? "bg-white border-2 border-black text-black hover:bg-gray-50"
                    : "bg-black text-white hover:bg-gray-800")
                }
              >
                {following ? "Following" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}