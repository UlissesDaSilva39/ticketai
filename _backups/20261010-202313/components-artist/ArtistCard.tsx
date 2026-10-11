"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  artist: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    city: string | null;
    genre: string | null;
    role: string | null;
  };
};

export default function ArtistCard({ artist }: Props) {
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  const name = artist.full_name || artist.username || "Artist";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel =
    artist.role === "promoter"
      ? "Promoter"
      : artist.role === "venue"
      ? "Venue"
      : artist.role === "artist"
      ? "Artist"
      : "Profile";

  const toggleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const prev = following;
    setFollowing(!prev);
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "promoter", targetId: artist.id }),
      });
      const data = await res.json();
      if (typeof data.following === "boolean") setFollowing(data.following);
    } catch {
      setFollowing(prev);
    } finally {
      setBusy(false);
    }
  };

  const share = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      window.location.origin +
      (artist.username ? "/artists/" + artist.username : "");
    try {
      if (navigator.share) {
        await navigator.share({ title: name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShowToast("Link copied");
        setTimeout(() => setShowToast(null), 1800);
      }
    } catch {
      /* cancelled */
    }
  };

  const play = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = artist.username
      ? "/artists/" + artist.username
      : "/";
  };

  return (
    <li className="w-44 shrink-0 relative">
      <Link
        href={artist.username ? "/artists/" + artist.username : "#"}
        className="group block p-3 rounded-2xl hover:bg-gray-100 transition-colors"
      >
        <div className="aspect-square w-full rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 mb-3 flex items-center justify-center overflow-hidden relative shadow-md">
          {artist.avatar_url ? (
            <img
              src={artist.avatar_url}
              alt=""
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-5xl font-bold text-gray-500 group-hover:scale-105 transition-transform duration-300">
              {initials}
            </span>
          )}

          <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-black text-white px-2 py-1 rounded-full">
            {roleLabel}
          </span>

          <button
            type="button"
            onClick={play}
            aria-label={"Open " + name}
            className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-black text-white shadow-lg flex items-center justify-center text-base opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
          >
            ▶
          </button>
        </div>

        <p className="font-bold text-sm truncate">{name}</p>
        {artist.username ? (
          <p className="text-xs text-gray-500 truncate mt-0.5">
            @{artist.username}
          </p>
        ) : null}
        {artist.genre || artist.city ? (
          <p className="text-xs text-gray-400 truncate mt-1">
            {[artist.genre, artist.city].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={toggleFollow}
            disabled={busy}
            className={
              "flex-1 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 " +
              (following
                ? "bg-white border border-black text-black hover:bg-gray-50"
                : "bg-black text-white hover:bg-gray-800")
            }
          >
            {following ? "Following" : "+ Follow"}
          </button>
          <button
            type="button"
            onClick={share}
            aria-label="Share"
            className="w-7 h-7 rounded-full bg-white border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-xs"
          >
            ↗
          </button>
        </div>
      </Link>

      {showToast ? (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg pointer-events-none whitespace-nowrap">
          {showToast}
        </div>
      ) : null}
    </li>
  );
}