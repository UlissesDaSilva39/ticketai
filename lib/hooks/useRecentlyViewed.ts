"use client";

import { useCallback, useEffect, useState } from "react";

export type RecentlyViewedType = "artist" | "product" | "gig" | "person" | "label" | "service";

export interface RecentlyViewedItem {
  id: string;
  type: RecentlyViewedType;
  name: string;
  color: string;
  href: string;
  viewedAt: number;
}

const STORAGE_KEY = "grid:recentlyViewed";
const DISMISS_KEY = "grid:recentlyViewedDismissed";
const MAX_ITEMS = 10;

function readStorage(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) =>
        x &&
        typeof x.id === "string" &&
        typeof x.type === "string" &&
        typeof x.name === "string" &&
        typeof x.href === "string"
    );
  } catch {
    return [];
  }
}

function writeStorage(items: RecentlyViewedItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("grid:recentlyViewedChanged"));
  } catch {
    /* quota / private mode */
  }
}

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }
    setHydrated(true);

    const onChange = () => setItems(readStorage());
    window.addEventListener("grid:recentlyViewedChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:recentlyViewedChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((item: Omit<RecentlyViewedItem, "viewedAt">) => {
    const current = readStorage();
    const entry: RecentlyViewedItem = { ...item, viewedAt: Date.now() };
    const deduped = current.filter((x) => !(x.id === item.id && x.type === item.type));
    const next = [entry, ...deduped].slice(0, MAX_ITEMS);
    writeStorage(next);
    setItems(next);
    // A new view un-dismisses the rail
    try {
      window.localStorage.removeItem(DISMISS_KEY);
    } catch {
      /* noop */
    }
    setDismissed(false);
  }, []);

  const clear = useCallback(() => {
    writeStorage([]);
    setItems([]);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* noop */
    }
    setDismissed(true);
  }, []);

  const showRail = hydrated && !dismissed && items.length > 0;

  return { items, add, clear, showRail, hydrated };
}