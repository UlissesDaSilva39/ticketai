"use client";
import { useCallback, useEffect, useState } from "react";

const KEY = "grid:recentSearches";
const MAX = 5;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(searches: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(searches));
    window.dispatchEvent(new CustomEvent("grid:searchesChanged"));
  } catch {}
}

export function useRecentSearches() {
  const [searches, setSearches] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSearches(read());
    setHydrated(true);
    const onChange = () => setSearches(read());
    window.addEventListener("grid:searchesChanged", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("grid:searchesChanged", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const current = read().filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
    const next = [trimmed, ...current].slice(0, MAX);
    write(next);
    setSearches(next);
  }, []);

  const clear = useCallback(() => {
    write([]);
    setSearches([]);
  }, []);

  const remove = useCallback((query: string) => {
    const next = read().filter((s) => s !== query);
    write(next);
    setSearches(next);
  }, []);

  return { searches, hydrated, add, clear, remove };
}