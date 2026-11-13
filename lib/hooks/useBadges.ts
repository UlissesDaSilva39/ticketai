"use client";
import { useCallback, useEffect, useState } from "react";

export type BadgeId =
  | "first_view"
  | "explorer"
  | "tastemaker"
  | "networker"
  | "gig_hunter"
  | "early_adopter"
  | "connector";

export interface BadgeStats {
  artistViews: number;
  similarClicks: number;
  follows: number;
  gigApplications: number;
  distinctPagesVisited: number;
  referralShared: number;
  firstVisitAt: number | null;
}

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  color: string;
  rule: (stats: BadgeStats) => boolean;
}

export const BADGE_DEFINITIONS: Badge[] = [
  { id: "first_view", name: "First Look", description: "Viewed your first artist profile.", icon: "eye", color: "bg-emerald-600", rule: (s) => s.artistViews >= 1 },
  { id: "explorer", name: "Explorer", description: "Viewed 10 artist profiles.", icon: "compass", color: "bg-blue-600", rule: (s) => s.artistViews >= 10 },
  { id: "tastemaker", name: "Tastemaker", description: "Clicked 5 similar-artist recommendations.", icon: "sparkles", color: "bg-purple-600", rule: (s) => s.similarClicks >= 5 },
  { id: "networker", name: "Networker", description: "Followed 3 artists.", icon: "users", color: "bg-pink-500", rule: (s) => s.follows >= 3 },
  { id: "gig_hunter", name: "Gig Hunter", description: "Applied to your first gig.", icon: "briefcase", color: "bg-amber-500", rule: (s) => s.gigApplications >= 1 },
  { id: "early_adopter", name: "Early Adopter", description: "Visited 5 pages on your first day.", icon: "zap", color: "bg-indigo-600", rule: (s) => s.distinctPagesVisited >= 5 && s.firstVisitAt !== null },
  { id: "connector", name: "Connector", description: "Shared your referral link 3 times.", icon: "share", color: "bg-emerald-600", rule: (s) => s.referralShared >= 3 },
];

const STATS_KEY = "grid:badgeStats";
const EARNED_KEY = "grid:badgesEarned";
const SEEN_KEY = "grid:badgesSeen";

function defaultStats(): BadgeStats {
  return { artistViews: 0, similarClicks: 0, follows: 0, gigApplications: 0, distinctPagesVisited: 0, referralShared: 0, firstVisitAt: null };
}

function readStats(): BadgeStats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch { return defaultStats(); }
}

function writeStats(stats: BadgeStats) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent("grid:badgeStatsChanged"));
  } catch {}
}

function readEarned(): BadgeId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EARNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeEarned(ids: BadgeId[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EARNED_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("grid:badgesChanged"));
  } catch {}
}

function readSeen(): BadgeId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeSeen(ids: BadgeId[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids)); } catch {}
}

function evaluate(stats: BadgeStats): BadgeId[] {
  const earned = new Set(readEarned());
  const newly: BadgeId[] = [];
  for (const badge of BADGE_DEFINITIONS) {
    if (earned.has(badge.id)) continue;
    if (badge.rule(stats)) { earned.add(badge.id); newly.push(badge.id); }
  }
  if (newly.length > 0) writeEarned(Array.from(earned));
  return newly;
}

export type BadgeStatKey = keyof Omit<BadgeStats, "firstVisitAt">;

export function useBadges() {
  const [stats, setStats] = useState<BadgeStats>(defaultStats());
  const [earned, setEarned] = useState<BadgeId[]>([]);
  const [newlyEarned, setNewlyEarned] = useState<Badge[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = readStats();
    if (s.firstVisitAt === null) { s.firstVisitAt = Date.now(); writeStats(s); }
    setStats(s);
    setEarned(readEarned());
    setHydrated(true);
    const onChange = () => { setStats(readStats()); setEarned(readEarned()); };
    window.addEventListener("grid:badgeStatsChanged", onChange);
    window.addEventListener("grid:badgesChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:badgeStatsChanged", onChange);
      window.removeEventListener("grid:badgesChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const increment = useCallback((key: BadgeStatKey, delta: number = 1) => {
    const s = readStats();
    if (s.firstVisitAt === null) s.firstVisitAt = Date.now();
    (s[key] as number) = ((s[key] as number) || 0) + delta;
    writeStats(s);
    setStats(s);
    const ids = evaluate(s);
    if (ids.length > 0) {
      const newBadges = ids.map((id) => BADGE_DEFINITIONS.find((b) => b.id === id)).filter((b): b is Badge => Boolean(b));
      setNewlyEarned(newBadges);
    }
  }, []);

  const dismissToast = useCallback(() => {
    if (newlyEarned.length > 0) {
      const seen = new Set(readSeen());
      for (const b of newlyEarned) seen.add(b.id);
      writeSeen(Array.from(seen));
    }
    setNewlyEarned([]);
  }, [newlyEarned]);

  const earnedBadges = BADGE_DEFINITIONS.filter((b) => earned.includes(b.id));
  const unearnedBadges = BADGE_DEFINITIONS.filter((b) => !earned.includes(b.id));

  return { stats, earned: earnedBadges, unearned: unearnedBadges, newlyEarned, dismissToast, increment, hydrated };
}

export function getBadgeById(id: BadgeId): Badge | undefined {
  return BADGE_DEFINITIONS.find((b) => b.id === id);
}