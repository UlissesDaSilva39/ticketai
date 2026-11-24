"use client";
import { useCallback, useEffect, useState } from "react";
import { useMe, refreshMe } from "@/lib/hooks/useMe";

// GRID Pro status now comes from the server (subscriptions / pro_grants via
// /api/me/summary). Previously it was a trial stored in the browser only.

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

/** Sends the browser to Stripe Checkout for Pro or Premium. Returns an error message on failure. */
export async function goToProCheckout(plan: "pro" | "premium" = "pro"): Promise<string | null> {
  try {
    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plan }),
    });
    const d = await res.json().catch(() => ({}));
    if (res.status === 401) {
      window.location.href = "/login?redirect=/pro";
      return null;
    }
    if (!res.ok || !d.url) return d.error || "Could not start checkout. Try again.";
    window.location.href = d.url;
    return null;
  } catch {
    return "Could not reach the server. Try again.";
  }
}

/** Switch an existing subscription between Pro and Premium. Returns an error message on failure. */
export async function changePlan(plan: "pro" | "premium"): Promise<string | null> {
  try {
    const res = await fetch("/api/billing/change-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ plan }),
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) return d.error || "Could not switch plan.";
    refreshMe();
    return null;
  } catch {
    return "Could not reach the server. Try again.";
  }
}

/** Opens Stripe's page to cancel or update the subscription. Returns an error message on failure. */
export async function openBillingPortal(): Promise<string | null> {
  try {
    const res = await fetch("/api/billing/portal", { method: "POST", credentials: "include" });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || !d.url) return d.error || "Could not open subscription settings.";
    window.location.href = d.url;
    return null;
  } catch {
    return "Could not reach the server. Try again.";
  }
}

export function useProStatus() {
  const { me, loading } = useMe();
  const [applicationsThisWeek, setApplicationsThisWeek] = useState(0);

  const pro = me?.pro ?? null;
  const isPro = !!pro?.active;
  const isTrial = isPro && (pro?.trialing || pro?.source === "grant");
  const daysLeft = pro?.until ? Math.max(0, Math.ceil((new Date(pro.until).getTime() - Date.now()) / 86_400_000)) : 0;

  useEffect(() => {
    const refresh = () => setApplicationsThisWeek(readApplicationsThisWeek());
    refresh();
    window.addEventListener("grid:applicationsChanged", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("grid:applicationsChanged", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  // Kept for existing callers: "start trial" = go to Stripe Checkout.
  const startTrial = useCallback(() => {
    void goToProCheckout();
  }, []);

  // Kept for existing callers: "cancel" = Stripe's manage-subscription page.
  const cancelTrial = useCallback(() => {
    void openBillingPortal();
  }, []);

  const recordApplication = useCallback(() => {
    if (typeof window === "undefined") return false;
    const current = readApplicationsThisWeek();
    if (!isPro && current >= FREE_APPLICATIONS_PER_WEEK) return false;
    try {
      const raw = window.localStorage.getItem(APPLICATIONS_KEY);
      const arr: number[] = raw ? JSON.parse(raw) : [];
      arr.push(Date.now());
      window.localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(arr));
      window.dispatchEvent(new CustomEvent("grid:applicationsChanged"));
      return true;
    } catch {
      return false;
    }
  }, [isPro]);

  const hasHitLimit = !isPro && applicationsThisWeek >= FREE_APPLICATIONS_PER_WEEK;
  const freeApplicationsLeft = isPro ? Infinity : Math.max(0, FREE_APPLICATIONS_PER_WEEK - applicationsThisWeek);

  return {
    isPro,
    isTrial,
    daysLeft,
    trialStartedAt: null as number | null,
    applicationsThisWeek,
    freeApplicationsLeft,
    hasHitLimit,
    hydrated: !loading,
    pro,
    startTrial,
    cancelTrial,
    recordApplication,
    refresh: refreshMe,
  };
}

export const PRO_LIMITS = {
  freeApplicationsPerWeek: FREE_APPLICATIONS_PER_WEEK,
  trialDays: TRIAL_DAYS,
};
