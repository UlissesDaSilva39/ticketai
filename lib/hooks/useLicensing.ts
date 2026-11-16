"use client";
import { useCallback, useEffect, useState } from "react";
import { LICENSED_TRACKS, LicensedTrack, LicenceStatus } from "@/lib/data/licensedTracks";

const PLAYS_KEY = "grid:trackPlays";
const APPLICATIONS_KEY = "grid:licensingApplications";

export interface LicensingApplication {
  id: string;
  artistName: string;
  email: string;
  trackTitle: string;
  isrc?: string;
  masterOwner: string;
  composer: string;
  publisher?: string;
  message?: string;
  submittedAt: number;
  status: "pending" | "reviewing" | "approved" | "rejected";
}

function readPlays(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PLAYS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writePlays(plays: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLAYS_KEY, JSON.stringify(plays));
    window.dispatchEvent(new CustomEvent("grid:playsChanged"));
  } catch {}
}

function readApplications(): LicensingApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(APPLICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeApplications(apps: LicensingApplication[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
    window.dispatchEvent(new CustomEvent("grid:licensingChanged"));
  } catch {}
}

export function useLicensing() {
  const [plays, setPlays] = useState<Record<string, number>>({});
  const [applications, setApplications] = useState<LicensingApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPlays(readPlays());
    setApplications(readApplications());
    setHydrated(true);
    const onChange = () => {
      setPlays(readPlays());
      setApplications(readApplications());
    };
    window.addEventListener("grid:playsChanged", onChange);
    window.addEventListener("grid:licensingChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:playsChanged", onChange);
      window.removeEventListener("grid:licensingChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const recordPlay = useCallback((trackId: string) => {
    const current = readPlays();
    current[trackId] = (current[trackId] || 0) + 1;
    writePlays(current);
    setPlays(current);
  }, []);

  const getPlayCount = useCallback((trackId: string, seedCount: number = 0): number => {
    return seedCount + (plays[trackId] || 0);
  }, [plays]);

  const submitApplication = useCallback((input: Omit<LicensingApplication, "id" | "submittedAt" | "status">) => {
    const app: LicensingApplication = {
      ...input,
      id: "app-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      submittedAt: Date.now(),
      status: "pending",
    };
    const next = [app, ...readApplications()];
    writeApplications(next);
    setApplications(next);
    return app;
  }, []);

  const getRankedTracks = useCallback((): LicensedTrack[] => {
    const currentPlays = readPlays();
    return [...LICENSED_TRACKS].map((t) => ({
      ...t,
      plays: t.plays + (currentPlays[t.id] || 0),
    })).sort((a, b) => {
      if (b.plays !== a.plays) return b.plays - a.plays;
      return a.seedRank - b.seedRank;
    });
  }, []);

  const getBadge = useCallback((status: LicenceStatus): { label: string; tone: "green" | "amber" | "red" | "gray" } => {
    switch (status) {
      case "licensed": return { label: "Licensed · UK", tone: "green" };
      case "preview-only": return { label: "30s preview", tone: "amber" };
      case "pending": return { label: "Pending approval", tone: "gray" };
      case "unlicensed": return { label: "Not licensed", tone: "red" };
    }
  }, []);

  return {
    plays,
    applications,
    hydrated,
    recordPlay,
    getPlayCount,
    submitApplication,
    getRankedTracks,
    getBadge,
  };
}