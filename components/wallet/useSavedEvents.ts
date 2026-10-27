"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Fetches all of the current user's saved event IDs once and caches them.
// Multiple components on the page can call useSavedEvents() and share
// the same fetch (deduped by React's useState + module-level cache).

let cache: Set<string> | null = null;
let pending: Promise<Set<string>> | null = null;

async function load(): Promise<Set<string>> {
  if (cache) return cache;
  if (pending) return pending;
  pending = (async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      cache = new Set();
      pending = null;
      return cache;
    }
    const { data } = await supabase
      .from("saved_events")
      .select("event_id")
      .eq("user_id", user.id);
    cache = new Set((data ?? []).map((r: { event_id: string }) => r.event_id));
    pending = null;
    return cache;
  })();
  return pending;
}

export function useSavedEvents() {
  const [saved, setSaved] = useState<Set<string>>(cache ?? new Set());
  const [ready, setReady] = useState(cache !== null);

  useEffect(() => {
    if (ready) return;
    let cancelled = false;
    load().then((set) => {
      if (!cancelled) {
        setSaved(new Set(set));
        setReady(true);
      }
    });
    return () => { cancelled = true; };
  }, [ready]);

  return { saved, ready };
}

// Force refresh (called after a Save click elsewhere)
export function invalidateSavedCache() {
  cache = null;
  pending = null;
}