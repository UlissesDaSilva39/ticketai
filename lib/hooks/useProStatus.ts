"use client";
import { useCallback, useEffect, useState } from "react";

const TRIAL_KEY = "grid:proTrial";
const TRIAL_DAYS = 30;
const FREE_APPLICATIONS_PER_WEEK = 3;
const APPLICATIONS_KEY = "grid:applications";

export interface ProStatus {
  isPro: boolean;
  isTrial: boolean;
  daysLeft: number;
  trialStartedAt: number | null;
  applicationsThisWeek: number;
  freeApplicationsLeft: number;
  hasHitLimit: boolean;
  hydrated: boolean;
}

interface TrialState {
  startedAt: number;
  expiresAt: number;
}

function readTrial(): TrialState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(TRIAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.startedAt || !parsed.expiresAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

function weekStart(): number {
  const now = Date.now();
  return now - (now % (7 * 24 * 60 * 60 * 1000));
}

function readApplicationsThisWeek(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return 0;
    const arr: number[] = JSON.parse(raw);
    const start = weekStart();
    return arr.filter((t) => t >= start).length;
  } catch {
    return 0;
  }
}

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [isTrial, setIsTrial] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [trialStartedAt, setTrialStartedAt] = useState<number | null>(null);
  const [applicationsThisWeek, setApplicationsThisWeek] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    const trial = readTrial();
    const now = Date.now();
    if (trial && trial.expiresAt > now) {
      setIsPro(true);
      setIsTrial(true);
      setDaysLeft(Math.ceil((trial.expiresAt - now) / (24 * 60 * 60 * 1000)));
      setTrialStartedAt(trial.startedAt);
    } else {
      setIsPro(false);
      setIsTrial(false);
      setDaysLeft(0);
      setTrialStartedAt(null);
    }
    setApplicationsThisWeek(readApplicationsThisWeek());
  }, []);

  useEffect(() => {
    refresh();
    setHydrated(true);
    const onChange = () => refresh();
    window.addEventListener("grid:proChanged", onChange);
    window.addEventListener("grid:applicationsChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:proChanged", onChange);
      window.removeEventListener("grid:applicationsChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const startTrial = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const now = Date.now();
      const trial: TrialState = {
        startedAt: now,
        expiresAt: now + TRIAL_DAYS * 24 * 60 * 60 * 1000,
      };
      window.localStorage.setItem(TRIAL_KEY, JSON.stringify(trial));
      window.dispatchEvent(new CustomEvent("grid:proChanged"));
      refresh();
    } catch {}
  }, [refresh]);

  const cancelTrial = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(TRIAL_KEY);
      window.dispatchEvent(new CustomEvent("grid:proChanged"));
      refresh();
    } catch {}
  }, [refresh]);

  const recordApplication = useCallback(() => {
    if (typeof window === "undefined") return false;
    const current = readApplicationsThisWeek();
    if (!isPro && current >= FREE_APPLICATIONS_PER_WEEK) {
      return false;
    }
    try {
      const raw = window.localStorage.getItem(APPLICATIONS_KEY);
      const arr: number[] = raw ? JSON.parse(raw) : [];
      arr.push(Date.now());
      window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("grid:applicationsChanged"));
      refresh();
      return true;
    } catch {
      return false;
    }
  }, [isPro, refresh]);

  const hasHitLimit = !isPro && applicationsThisWeek >= FREE_APPLICATIONS_PER_WEEK;
  const freeApplicationsLeft = isPro ? Infinity : Math.max(0, FREE_APPLICATIONS_PER_WEEK - applicationsThisWeek);

  return {
    isPro,
    isTrial,
    daysLeft,
    trialStartedAt,
    applicationsThisWeek,
    freeApplicationsLeft,
    hasHitLimit,
    hydrated,
    startTrial,
    cancelTrial,
    recordApplication,
  };
}

export const PRO_LIMITS = {
  freeApplicationsPerWeek: FREE_APPLICATIONS_PER_WEEK,
  trialDays: TRIAL_DAYS,
};