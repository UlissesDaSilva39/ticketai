"use client";

import { useState, useRef } from "react";

export default function EventCardActions({
  eventId,
  organizerId,
  audioUrl,
  initialLiked,
  initialLikeCount,
  initialFollowing,
  initialFollowerCount,
}: {
  eventId: string;
  organizerId: string;
  audioUrl: string | null;
  initialLiked: boolean;
  initialLikeCount: number;
  initialFollowing: boolean;
  initialFollowerCount: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [following, setFollowing] = useState(initialFollowing);
  const [followerCount, setFollowerCount] = useState(initialFollowerCount);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const togglePlay = (e: React.MouseEvent) => {
    stop(e);
    if (!audioUrl) {
      alert("No preview available for this event yet.");
      return;
    }
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleLike = async (e: React.MouseEvent) => {
    stop(e);
    if (busy) return;
    setBusy(true);
    const next = !liked;
    setLiked(next);
    setLikeCount((c) => Math.max(c + (next ? 1 : -1), 0));
    try {
      const res = await fetch("/api/events/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { window.location.href = "/login"; return; }
        throw new Error(data.error);
      }
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch {
      setLiked(!next);
      setLikeCount((c) => Math.max(c + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  };

  const toggleFollow = async (e: React.MouseEvent) => {
    stop(e);
    if (busy) return;
    setBusy(true);
    const next = !following;
    setFollowing(next);
    setFollowerCount((c) => Math.max(c + (next ? 1 : -1), 0));
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizerId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { window.location.href = "/login"; return; }
        throw new Error(data.error);
      }
      setFollowing(data.following);
      setFollowerCount(data.count);
    } catch {
      setFollowing(!next);
      setFollowerCount((c) => Math.max(c + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <button
        onClick={togglePlay}
        className={"inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors " +
          (playing
            ? "bg-[#00FF87] border-[#00FF87] text-black"
            : audioUrl
              ? "bg-white border-gray-300 text-gray-700 hover:border-black"
              : "bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300")}
      >
        {playing ? (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {playing ? "Playing" : "Preview"}
      </button>

      <button
        onClick={toggleLike}
        className={"inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors " + (liked ? "bg-[#00FF87] border-[#00FF87] text-black" : "bg-white border-gray-300 text-gray-700 hover:border-black")}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        {likeCount > 0 ? likeCount : "Like"}
      </button>

      <button
        onClick={toggleFollow}
        className={"inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors " + (following ? "bg-black border-black text-white" : "bg-white border-gray-300 text-gray-700 hover:border-black")}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {following ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </>
          )}
        </svg>
        {following ? "Following" : "Follow"}
        {followerCount > 0 && <span className="opacity-70">· {followerCount}</span>}
      </button>
    </div>
  );
}
