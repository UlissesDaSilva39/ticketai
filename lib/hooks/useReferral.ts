"use client";
import { useCallback, useEffect, useState } from "react";
import { useBadges } from "@/lib/hooks/useBadges";

const CODE_KEY = "grid:referralCode";
const STATS_KEY = "grid:referralStats";
const WAITLIST_KEY = "grid:waitlist";

export interface ReferralStats {
  shared: number;
  opened: number;
  joined: number;
  earnedPence: number;
}

export interface WaitlistEntry {
  email: string;
  ref: string | null;
  at: number;
}

function defaultStats(): ReferralStats {
  return { shared: 0, opened: 0, joined: 0, earnedPence: 0 };
}

function readStats(): ReferralStats {
  if (typeof window === "undefined") return defaultStats();
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats();
    return { ...defaultStats(), ...JSON.parse(raw) };
  } catch {
    return defaultStats();
  }
}

function writeStats(stats: ReferralStats) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new CustomEvent("grid:referralChanged"));
  } catch {}
}

function randomCode(seed: string): string {
  // Deterministic-ish but varied: 4 chars from base36, uppercased
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${seed}-${out}`;
}

function readOrCreateCode(seed: string): string {
  if (typeof window === "undefined") return `${seed}-XXXX`;
  try {
    const existing = window.localStorage.getItem(CODE_KEY);
    if (existing && existing.length >= 5) return existing;
    const fresh = randomCode(seed);
    window.localStorage.setItem(CODE_KEY, fresh);
    return fresh;
  } catch {
    return `${seed}-XXXX`;
  }
}

function readWaitlist(): WaitlistEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WAITLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useReferral(seed: string = "GRID") {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState<ReferralStats>(defaultStats());
  const [hydrated, setHydrated] = useState(false);
  const { increment } = useBadges();

  useEffect(() => {
    const c = readOrCreateCode(seed);
    setCode(c);
    setStats(readStats());
    setHydrated(true);
    const onChange = () => setStats(readStats());
    window.addEventListener("grid:referralChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:referralChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [seed]);

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "http://localhost:3000";

  const referralUrl = code ? `${baseUrl}/join?ref=${code}` : baseUrl + "/join";

  const copyLink = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;
    try {
      await navigator.clipboard.writeText(referralUrl);
      return true;
    } catch {
      // Fallback
      try {
        const ta = document.createElement("textarea");
        ta.value = referralUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        return true;
      } catch {
        return false;
      }
    }
  }, [referralUrl]);

  const share = useCallback(async (channel: "native" | "whatsapp" | "twitter" | "email" | "copy" = "copy"): Promise<void> => {
    const s = readStats();
    s.shared = (s.shared || 0) + 1;
    writeStats(s);
    setStats(s);
    increment("referralShared" as any);

    // Awards "connector" at 3 shares via badges hook - increment a dedicated stat
    // We piggyback on the shared count here.

    if (channel === "copy") {
      await copyLink();
      return;
    }

    const message = `Join me on GRID — the music network for artists, producers and DJs. Both of us get a month of Pro free: ${referralUrl}`;
    const encoded = encodeURIComponent(message);
    const encUrl = encodeURIComponent(referralUrl);

    if (channel === "whatsapp") {
      window.open(`https://wa.me/?text=${encoded}`, "_blank");
    } else if (channel === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encoded}`, "_blank");
    } else if (channel === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent("Join me on GRID")}&body=${encoded}`;
    } else if (channel === "native") {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        try {
          await (navigator as any).share({ title: "Join me on GRID", text: message, url: referralUrl });
        } catch {
          await copyLink();
        }
      } else {
        await copyLink();
      }
    }
  }, [referralUrl, copyLink, increment]);

  const recordOpen = useCallback(() => {
    const s = readStats();
    s.opened = (s.opened || 0) + 1;
    writeStats(s);
    setStats(s);
  }, []);

  const recordJoin = useCallback(() => {
    const s = readStats();
    s.joined = (s.joined || 0) + 1;
    s.earnedPence = (s.earnedPence || 0) + 500; // 1 month Pro ~ £5
    writeStats(s);
    setStats(s);
  }, []);

  const addToWaitlist = useCallback((email: string, ref: string | null) => {
    if (typeof window === "undefined" || !email) return;
    try {
      const current = readWaitlist();
      const filtered = current.filter((e) => e.email !== email);
      const next = [...filtered, { email, ref, at: Date.now() }];
      window.localStorage.setItem(WAITLIST_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  return {
    code,
    referralUrl,
    stats,
    hydrated,
    copyLink,
    share,
    recordOpen,
    recordJoin,
    addToWaitlist,
  };
}