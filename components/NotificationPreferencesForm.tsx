"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { PREF_LABELS, DEFAULT_PREFS, type PrefKey } from "@/lib/preferences";

type Prefs = Record<PrefKey, boolean>;

export default function NotificationPreferencesForm({
  userId,
  initial,
}: {
  userId: string;
  initial: Prefs;
}) {
  const [prefs, setPrefs] = useState<Prefs>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const keys = Object.keys(PREF_LABELS) as PrefKey[];

  const toggle = async (key: PrefKey) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("notification_preferences")
      .upsert(
        { user_id: userId, ...next, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    setSaving(false);
    if (err) {
      setError(err.message);
      setPrefs(prefs);
    } else {
      setSavedAt(new Date().toLocaleTimeString());
    }
  };

  const reset = async () => {
    setPrefs({ ...DEFAULT_PREFS });
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase
      .from("notification_preferences")
      .upsert(
        { user_id: userId, ...DEFAULT_PREFS, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    setSaving(false);
    if (err) setError(err.message);
    else setSavedAt(new Date().toLocaleTimeString());
  };

  return (
    <div className="space-y-1">
      {keys.map((key) => {
        const { label, hint } = PREF_LABELS[key];
        const on = prefs[key];
        return (
          <div
            key={key}
            className="flex items-center justify-between py-4 border-b border-gray-100"
          >
            <div className="pr-4">
              <p className="font-medium text-sm">{label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{hint}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(key)}
              disabled={saving}
              aria-pressed={on}
              className={
                "relative w-11 h-6 rounded-full transition-colors " +
                (on ? "bg-black" : "bg-gray-300") +
                (saving ? " opacity-60" : "")
              }
            >
              <span
                className={
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform " +
                  (on ? "translate-x-5" : "")
                }
              />
            </button>
          </div>
        );
      })}

      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={reset}
          disabled={saving}
          className="text-sm text-gray-500 hover:text-black"
        >
          Reset to defaults
        </button>
        <p className="text-xs text-gray-500">
          {error ? (
            <span className="text-red-600">{error}</span>
          ) : savedAt ? (
            "Saved " + savedAt
          ) : saving ? (
            "Saving…"
          ) : null}
        </p>
      </div>
    </div>
  );
}