"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// A small standalone Save button for the Discover card.
// Handles its own auth check and saved-state read.
// Places itself absolutely in the top-right of its parent
// (parent must have position: relative).

export function CardSaveButton({ eventId }: { eventId: string }) {
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) { setReady(true); return; }
        const { data } = await supabase
          .from("saved_events")
          .select("id")
          .eq("user_id", user.id)
          .eq("event_id", eventId)
          .maybeSingle();
        if (!cancelled) {
          setSaved(Boolean(data));
          setReady(true);
        }
      } catch {
        if (!cancelled) setReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [eventId]);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
        return;
      }
      if (saved) {
        await supabase
          .from("saved_events")
          .delete()
          .eq("user_id", user.id)
          .eq("event_id", eventId);
        setSaved(false);
      } else {
        await supabase
          .from("saved_events")
          .insert({ user_id: user.id, event_id: eventId });
        setSaved(true);
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={saved ? "Remove from saved" : "Save event"}
      title={saved ? "Saved" : "Save"}
      className={
        "absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition " +
        (saved
          ? "bg-neutral-900 text-white"
          : "bg-white/90 text-neutral-900 hover:bg-white") +
        (error ? " ring-2 ring-red-500" : "")
      }
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M17 3H7a2 2 0 0 0-2 2v16l7-4 7 4V5a2 2 0 0 0-2-2z" />
      </svg>
    </button>
  );
}