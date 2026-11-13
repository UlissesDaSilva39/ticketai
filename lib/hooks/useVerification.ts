"use client";
import { useCallback, useEffect, useState } from "react";

const VERIFIED_KEY = "grid:verified";
const BOOSTS_KEY = "grid:boosts";

export interface BoostEntry {
  id: string;
  pricePence: number;
  at: number;
}

function readVerified(): boolean {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(VERIFIED_KEY) === "1"; }
  catch { return false; }
}

function writeVerified(value: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VERIFIED_KEY, value ? "1" : "0");
    window.dispatchEvent(new CustomEvent("grid:verifiedChanged"));
  } catch {}
}

function readBoosts(): BoostEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeBoosts(boosts: BoostEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOSTS_KEY, JSON.stringify(boosts));
    window.dispatchEvent(new CustomEvent("grid:boostChanged"));
  } catch {}
}

export function useVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIsVerified(readVerified());
    setHydrated(true);
    const onChange = () => setIsVerified(readVerified());
    window.addEventListener("grid:verifiedChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:verifiedChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const requestVerification = useCallback(() => {
    writeVerified(true);
    setIsVerified(true);
  }, []);

  return { isVerified, hydrated, requestVerification };
}

export function useBoosts() {
  const [boosts, setBoosts] = useState<BoostEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBoosts(readBoosts());
    setHydrated(true);
    const onChange = () => setBoosts(readBoosts());
    window.addEventListener("grid:boostChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:boostChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const recordBoost = useCallback((pricePence: number) => {
    const entry: BoostEntry = { id: `boost-${Date.now()}`, pricePence, at: Date.now() };
    const next = [entry, ...readBoosts()];
    writeBoosts(next);
    setBoosts(next);
    return entry;
  }, []);

  const totalSpentPence = boosts.reduce((s, b) => s + b.pricePence, 0);
  return { boosts, totalSpentPence, hydrated, recordBoost };
}