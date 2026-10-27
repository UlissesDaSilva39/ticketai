"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SaveButtonProps = {
  eventId: string;
  initialSaved?: boolean;
};

export function SaveButton({ eventId, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || cancelled) return;
        const { data } = await supabase
          .from("saved_events")
          .select("id")
          .eq("user_id", user.id)
          .eq("event_id", eventId)
          .maybeSingle();
        if (!cancelled) setSaved(Boolean(data));
      } catch {
        // not signed in, or table missing — leave default
      }
    })();
    return () => { cancelled = true; };
  }, [eventId, supabase]);

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Sign in to save events");
        setBusy(false);
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
      setError("Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={
          "rounded-full px-4 py-1.5 text-sm font-semibold transition " +
          (saved
            ? "bg-neutral-900 text-white"
            : "border border-neutral-300 text-neutral-900 hover:bg-neutral-100")
        }
      >
        {busy ? "…" : saved ? "Saved" : "Save"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}