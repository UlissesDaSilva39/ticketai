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
        body: JSON.stringify({ targetType: artist.role || "user", targetId: artist.id }),
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
    <Link href={`/artists/${artist.username || artist.id}`} className="group block">
      <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
        <header className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {artist.avatar_url ? (
              <img src={artist.avatar_url} alt={name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold group-hover:underline">{name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{artist.city || "Unknown"}</p>
            </div>
          </div>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">{roleLabel}</span>
        </header>
        {artist.genre && (
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
            <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{artist.genre}</span>
          </div>
        )}
        <div className="mt-4 flex items-center justify-between gap-2 text-xs">
          <button onClick={toggleFollow} disabled={busy} className={`rounded-full px-4 py-1.5 font-semibold transition ${following ? "bg-neutral-100 text-neutral-700" : "bg-black text-white hover:bg-neutral-800"}`}>
            {following ? "Following" : "+ Follow"}
          </button>
          <button onClick={share} className="rounded-full border border-neutral-300 px-4 py-1.5 font-semibold text-neutral-700 hover:border-neutral-900">Share</button>
        </div>
      </article>
      {showToast && <div className="fixed bottom-4 right-4 rounded-lg bg-black px-4 py-2 text-sm text-white shadow-lg">{showToast}</div>}
    </Link>
  );
}