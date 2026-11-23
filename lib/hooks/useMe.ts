"use client";
import { useEffect, useState } from "react";

export type MeProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  role: string | null;
  avatar_url?: string | null;
  cover_image?: string | null;
  bio?: string | null;
  city?: string | null;
  genre?: string | null;
  label?: string | null;
  website?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  spotify?: string | null;
  youtube?: string | null;
  soundcloud?: string | null;
};

export type Me = {
  user: { id: string; email: string | null };
  profile: MeProfile;
  counts: { followers: number; following: number; unreadNotifications: number; unreadMessages: number };
};

// One shared request per page load for the navbar, home page, etc.
let cache: { at: number; promise: Promise<Me | null> } | null = null;
const MAX_AGE_MS = 30_000;

function load(force = false): Promise<Me | null> {
  if (!force && cache && Date.now() - cache.at < MAX_AGE_MS) return cache.promise;
  const promise = fetch("/api/me/summary", { credentials: "include", cache: "no-store" })
    .then((r) => (r.ok ? (r.json() as Promise<Me | { user: null }>) : null))
    .then((data) => (data && data.user ? (data as Me) : null))
    .catch(() => null)
    .then((data) => {
      // Don't remember "logged out", so the page updates straight after logging in.
      if (!data) cache = null;
      return data;
    });
  cache = { at: Date.now(), promise };
  return promise;
}

/** Clears the cached user, e.g. after sign-out or a profile edit. */
export function invalidateMe() {
  cache = null;
}

/** The logged-in user's profile and counts. `me` is null while loading or when logged out. */
export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    load().then((data) => {
      if (!alive) return;
      setMe(data);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  return { me, loading };
}

// ---- display helpers ----

export function displayName(p?: MeProfile | null, email?: string | null) {
  // Old accounts may have their email saved as the name; don't show that.
  const name = p?.full_name && !p.full_name.includes("@") ? p.full_name : null;
  return name || p?.username || email?.split("@")[0] || "You";
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "U";
}

const ROLE_LABELS: Record<string, string> = {
  artist: "Artist / Producer",
  industry: "Venue / A&R",
  fan: "Music fan",
  admin: "Admin",
  promoter: "Promoter",
  venue: "Venue",
};

export function roleLabel(role?: string | null, genre?: string | null) {
  const base = role ? ROLE_LABELS[role] ?? role[0].toUpperCase() + role.slice(1) : "Member";
  return genre ? `${base} · ${genre}` : base;
}

export function compactNumber(n: number) {
  return new Intl.NumberFormat("en-GB", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
