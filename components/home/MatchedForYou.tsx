"use client";

import { useState } from "react";
import Link from "next/link";
import TrustStrip from "./TrustStrip";
import { track } from "../../lib/cta-track";

export type Match = {
  id: string;
  title: string;
  by: string;
  reason: string;
  score: number;
  icon: string;
};

// PLACEHOLDER DATA: replace with your real matches by passing the matches prop.
const DEFAULT_MATCHES: Match[] = [
  { id: "m1", title: "House Vocalist needed", by: "Sarah J.", reason: "Same genre (House) + 3 mutual collabs", score: 98, icon: "\u266B" },
  { id: "m2", title: "Opening slot at Ministry of Sound", by: "The O2 Academy", reason: "Your genre + London based", score: 95, icon: "\u2605" },
  { id: "m3", title: "Techno remix swap", by: "Alex Rivera", reason: "Same BPM range + techno focus", score: 89, icon: "\u21C4" },
];

type Props = { matches?: Match[]; isPro?: boolean; freeLimit?: number };

export default function MatchedForYou({ matches = DEFAULT_MATCHES, isPro = false, freeLimit = 3 }: Props) {
  const [hidden, setHidden] = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);

  const visible = matches.filter((m) => !hidden.includes(m.id));
  const unlocked = isPro ? visible : visible.slice(0, freeLimit);
  const locked = isPro ? [] : visible.slice(freeLimit);

  function apply(m: Match) {
    if (applied.includes(m.id)) return;
    setApplied((a) => [...a, m.id]);
    track("match_apply", { match: m.id, score: m.score });
    // TODO: call your real API here, e.g. fetch("/api/matches/apply", { method: "POST", body: ... })
  }

  function hide(m: Match) {
    setHidden((h) => [...h, m.id]);
    track("match_hide", { match: m.id });
  }

  return (
    <section aria-label="Matched for you" className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-4 text-neutral-900">
      <TrustStrip />

      <div className="mt-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <span aria-hidden="true" className="text-emerald-700">&#10022;</span> Matched For You
        </h2>
        <Link href="/network" data-cta="matches-see-all" className="text-sm font-semibold text-emerald-800 hover:underline">
          See all matches &rarr;
        </Link>
      </div>
      <p className="mt-1 text-sm text-neutral-600">Based on your genre (Tech House), role (Producer), and mutual collaborators.</p>

      <ul className="mt-3 space-y-3">
        {unlocked.map((m) => {
          const done = applied.includes(m.id);
          return (
            <li key={m.id} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-lg text-emerald-800">
                {m.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.title}</p>
                <p className="text-sm text-neutral-600">by {m.by}</p>
                <p className="text-xs text-emerald-800">{m.reason}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">{m.score}% match</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => apply(m)}
                    disabled={done}
                    className={"rounded-full px-3 py-1 text-xs font-semibold " + (done ? "bg-neutral-200 text-neutral-600" : "bg-emerald-700 text-white hover:bg-emerald-800")}
                  >
                    {done ? "Applied \u2713" : "Apply"}
                  </button>
                  <Link href="/network" className="text-xs font-semibold text-emerald-800 hover:underline">
                    View
                  </Link>
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

      {visible.length === 0 && (
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
    </section>
  );
}