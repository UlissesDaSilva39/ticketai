"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TrustStrip from "./TrustStrip";
import { track } from "../../lib/cta-track";

export type Match = {
  id: string;
  title: string;
  org: string;
  category: string | null;
  location: string | null;
  remote: boolean | null;
  compensation: string | null;
  deadline: string | null;
  score: number;
  reasons: string[];
  canApply: boolean;
  summary: string | null;
};

type Profile = { role: string | null; city: string | null; genre: string | null };

const ICONS: Record<string, string> = { collab: "⇄", gig: "♫", booking: "★", session: "\u{1F3A4}", remix: "\u{1F39B}", job: "\u{1F4BC}" };

// Per-browser memory of hidden/applied matches (no database table for these yet).
function useStoredList(key: string) {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem(key) || "[]"));
    } catch {
      /* storage unavailable */
    }
  }, [key]);
  const save = (next: string[]) => {
    setList(next);
    try {
      localStorage.setItem(key, JSON.stringify(next.slice(-200)));
    } catch {
      /* storage unavailable */
    }
  };
  return [list, save] as const;
}

function subtitle(p: Profile | null) {
  const bits = [p?.genre && `your genre (${p.genre})`, p?.city && `city (${p.city})`, p?.role && `role (${p.role})`].filter(Boolean);
  return bits.length ? `Based on ${bits.join(", ")}.` : "Add your genre and city on your profile for better matches.";
}

type Props = { isPro?: boolean; freeLimit?: number };

export default function MatchedForYou({ isPro = false, freeLimit = 3 }: Props) {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [hidden, setHidden] = useStoredList("grid:matches:hidden");
  const [applied, setApplied] = useStoredList("grid:matches:applied");
  const [applying, setApplying] = useState<Match | null>(null);

  useEffect(() => {
    fetch("/api/matches?limit=6", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { matches: [] }))
      .then((d) => {
        setMatches(d.matches ?? []);
        setProfile(d.profile ?? null);
      })
      .catch(() => setMatches([]));
  }, []);

  const visible = (matches ?? []).filter((m) => !hidden.includes(m.id));
  const unlocked = isPro ? visible : visible.slice(0, freeLimit);
  const locked = isPro ? [] : visible.slice(freeLimit);

  function hide(m: Match) {
    setHidden([...hidden, m.id]);
    track("match_hide", { match: m.id });
  }

  return (
    <section aria-label="Matched for you" className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4 text-neutral-900">
      <TrustStrip />

      <div className="mt-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden="true" className="text-emerald-700">&#10022;</span> Matched For You
        </h2>
        <Link href="/opportunities" data-cta="matches-see-all" className="text-sm font-semibold text-emerald-800 hover:underline">
          See all &rarr;
        </Link>
      </div>
      <p className="mt-1 text-sm text-neutral-600">{subtitle(profile)}</p>

      {matches === null ? (
        <ul className="mt-3 space-y-3" aria-label="Loading matches">
          {[0, 1].map((i) => (
            <li key={i} className="h-[72px] rounded-xl border border-neutral-200 bg-white animate-pulse" />
          ))}
        </ul>
      ) : matches.length === 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-neutral-300 bg-white p-4 text-center text-sm text-neutral-600">
          No open opportunities right now. Be the first: use <span className="font-semibold">+ Post a collab</span> on the right.
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {unlocked.map((m) => {
            const done = applied.includes(m.id);
            return (
              <li key={m.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
                <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-lg text-emerald-800">
                  {ICONS[m.category ?? ""] ?? "✦"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{m.title}</p>
                  <p className="text-sm text-neutral-600 truncate">
                    by {m.org}
                    {m.location ? ` · ${m.location}` : ""}
                    {m.compensation ? ` · ${m.compensation}` : ""}
                  </p>
                  <p className="text-xs text-emerald-800 truncate">{m.reasons.join(" + ")}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">{m.score}% match</span>
                  <div className="flex items-center gap-2">
                    {m.canApply ? (
                      <button
                        type="button"
                        onClick={() => setApplying(m)}
                        disabled={done}
                        className={"rounded-full px-3 py-1 text-xs font-semibold " + (done ? "bg-neutral-200 text-neutral-600" : "bg-emerald-700 text-white hover:bg-emerald-800")}
                      >
                        {done ? "Applied ✓" : "Apply"}
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-500" title="This older listing has no poster to contact">No contact</span>
                    )}
                    <button type="button" onClick={() => hide(m)} className="text-xs text-neutral-500 hover:underline">
                      Hide
                    </button>
                  </div>
                </div>
              </li>
            );
          })}

          {locked.map((m) => (
            <li key={m.id} className="relative overflow-hidden rounded-xl border border-amber-200 bg-amber-50 p-3">
              <div aria-hidden="true" className="flex select-none items-center gap-3 blur-[3px]">
                <span className="h-10 w-10 rounded-lg bg-amber-200" />
                <div className="flex-1">
                  <p className="font-semibold">Another strong match</p>
                  <p className="text-sm">Unlock to see who</p>
                </div>
                <span className="text-xs font-semibold">{m.score}% match</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Link href="/pro" data-cta="matches-locked-row" className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-700">
                  &#128274; Unlock with Pro
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      {matches !== null && matches.length > 0 && visible.length === 0 && (
        <div className="mt-3 rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-600">
          You have hidden all matches.{" "}
          <button type="button" onClick={() => setHidden([])} className="font-semibold text-emerald-800 underline">
            Show them again
          </button>
        </div>
      )}

      {!isPro && visible.length > 0 && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
          <span>Get priority in every match with GRID Pro.</span>
          <Link href="/pro" data-cta="matches-footer-pro" className="shrink-0 font-semibold underline">
            Start free trial
          </Link>
        </div>
      )}

      {applying && (
        <ApplyDialog
          match={applying}
          onClose={() => setApplying(null)}
          onSent={() => {
            setApplied([...applied, applying.id]);
            track("match_apply", { match: applying.id, score: applying.score });
            setApplying(null);
          }}
        />
      )}
    </section>
  );
}

function ApplyDialog({ match, onClose, onSent }: { match: Match; onClose: () => void; onSent: () => void }) {
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function send() {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/matches/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ opportunityId: match.id, note }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not send your application.");
      onSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send your application.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="apply-title">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl text-neutral-900 dark:text-white">
        <h2 id="apply-title" className="text-lg font-bold">Apply: {match.title}</h2>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
          Your note goes to {match.org} as a message. They&apos;ll see your profile and can reply in Messaging.
        </p>
        {match.summary && <p className="mt-3 text-xs text-neutral-500 line-clamp-3">{match.summary}</p>}
        <textarea
          rows={4}
          maxLength={1000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Say why you're a good fit, and add links to your work…"
          aria-label="Your note"
          className="mt-4 w-full resize-none rounded-lg border border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-neutral-300 dark:border-zinc-700 py-2 text-sm font-semibold">
            Cancel
          </button>
          <button
            type="button"
            onClick={send}
            disabled={sending}
            className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {sending ? "Sending…" : "Send application"}
          </button>
        </div>
      </div>
    </div>
  );
}
