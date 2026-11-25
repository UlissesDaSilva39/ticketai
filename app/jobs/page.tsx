"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ApplyGate from "@/components/ApplyGate";
import PostCollabButton from "@/components/home/PostCollabButton";
import { ApplyDialog, type Match } from "@/components/home/MatchedForYou";
import { useProStatus } from "@/lib/hooks/useProStatus";

// Real opportunities board (table: opportunities). Replaces a hard-coded mock-up.

const FILTERS = [
  { value: "", label: "All" },
  { value: "collab", label: "Collabs" },
  { value: "gig", label: "Gigs" },
  { value: "booking", label: "Bookings" },
  { value: "session", label: "Session work" },
  { value: "remix", label: "Remixes" },
  { value: "job", label: "Jobs" },
];

const APPLIED_KEY = "grid:matches:applied"; // shared with Matched For You

function readApplied(): string[] {
  try {
    return JSON.parse(localStorage.getItem(APPLIED_KEY) || "[]");
  } catch {
    return [];
  }
}

function deadlineText(iso: string | null) {
  if (!iso) return null;
  const days = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return "Closes today";
  if (days === 1) return "Closes tomorrow";
  if (days <= 7) return `Closes in ${days} days`;
  return `Closes ${new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

export default function JobsPage() {
  const { recordApplication, hasHitLimit, isPro, freeApplicationsLeft } = useProStatus();
  const [filter, setFilter] = useState("");
  const [items, setItems] = useState<Match[] | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [applying, setApplying] = useState<Match | null>(null);
  const [showGate, setShowGate] = useState(false);

  const load = useCallback(() => {
    setItems(null);
    const url = filter ? `/api/matches?category=${filter}&limit=20` : "/api/matches?limit=20";
    fetch(url, { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { matches: [] }))
      .then((d) => setItems(d.matches ?? []))
      .catch(() => setItems([]));
  }, [filter]);

  useEffect(load, [load]);
  useEffect(() => setApplied(readApplied()), []);

  function startApply(m: Match) {
    if (hasHitLimit) return setShowGate(true);
    setApplying(m);
  }

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        {/* LEFT */}
        <aside className="col-span-12 lg:col-span-3 space-y-3">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">Looking for someone?</h3>
            <p className="text-xs text-gray-500 mt-1">Post a gig or collab. Applications arrive in your Messages.</p>
            <PostCollabButton onPosted={load} />
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-3">Filter by type</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  aria-pressed={filter === f.value}
                  className={`text-left text-sm font-semibold px-3 py-2 rounded-lg transition-colors ${
                    filter === f.value
                      ? "bg-emerald-600 text-white"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-emerald-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {!isPro && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm">
              <p className="font-bold text-amber-900 dark:text-amber-300">
                {Number.isFinite(freeApplicationsLeft) ? `${freeApplicationsLeft} free applications left this week` : ""}
              </p>
              <Link href="/pro" className="mt-1 inline-block text-xs font-bold text-amber-800 dark:text-amber-400 underline">
                Unlimited with GRID Pro →
              </Link>
            </div>
          )}
        </aside>

        {/* LIST */}
        <main className="col-span-12 lg:col-span-9 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm">
            <h1 className="font-bold text-gray-900 dark:text-white text-lg">Gigs &amp; opportunities</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filter ? "Newest first." : "Ranked for you by genre, city, role and pay. Add your genre and city on your profile for better matches."}
            </p>
          </div>

          {items === null ? (
            [0, 1, 2].map((i) => <div key={i} className="h-36 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse" />)
          ) : items.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-12 text-center shadow-sm">
              <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">No open opportunities{filter ? " of this type" : ""} right now</h2>
              <p className="text-gray-500 text-sm">Be the first: post a gig or collab with the button on the left.</p>
            </div>
          ) : (
            items.map((m) => {
              const done = applied.includes(m.id);
              const closes = deadlineText(m.deadline);
              return (
                <article key={m.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-6 shadow-sm hover:border-emerald-400 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {m.category && (
                        <span className="inline-block text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded mb-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          {m.category}
                        </span>
                      )}
                      <h2 className="font-bold text-gray-900 dark:text-white text-base">{m.title}</h2>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-0.5">{m.org}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {[m.remote ? "Remote" : m.location, m.compensation].filter(Boolean).join(" · ")}
                      </p>
                      {m.summary && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{m.summary}</p>}
                      {!filter && (
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-3 font-medium bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md">
                          {m.score}% match · {m.reasons.join(" + ")}
                        </p>
                      )}
                    </div>
                    {closes && <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">{closes}</span>}
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                    {m.canApply ? (
                      <button
                        type="button"
                        onClick={() => startApply(m)}
                        disabled={done}
                        className={`text-sm font-semibold px-5 py-1.5 rounded-full transition-colors ${
                          done ? "bg-gray-200 text-gray-600 dark:bg-zinc-700 dark:text-gray-300" : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {done ? "Applied ✓" : "Apply"}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 self-center">This older listing can&apos;t take applications.</span>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </main>
      </div>

      {applying && (
        <ApplyDialog
          match={applying}
          onClose={() => setApplying(null)}
          onSent={() => {
            recordApplication();
            const next = [...readApplied(), applying.id];
            try {
              localStorage.setItem(APPLIED_KEY, JSON.stringify(next.slice(-200)));
            } catch {
              /* storage unavailable */
            }
            setApplied(next);
            setApplying(null);
          }}
        />
      )}
      <ApplyGate open={showGate} onClose={() => setShowGate(false)} />
    </div>
  );
}
