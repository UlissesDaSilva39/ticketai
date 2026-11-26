"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GUIDE_NAME, QUESTIONS, TOUR, WELCOME, type GuideAnswer } from "@/lib/guide/content";

// "Remi": GRID's in-app guide. Opens by itself on a member's first visit (and
// as a gentle reminder every 7 days) unless they tick "Never remind me again".
// The round button in the bottom-left corner reopens it any time.

const KEY_NEVER = "grid:guide:never";
const KEY_LAST = "grid:guide:lastShown";
const REMIND_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

const store = {
  get(k: string) {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* storage unavailable: the guide still works, it just won't remember */
    }
  },
  del(k: string) {
    try {
      window.localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  },
};

/** Original GRID mascot: headphones, green hoodie. */
function RemiAvatar({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <circle cx="40" cy="40" r="40" fill="#d1fae5" />
      <path d="M14 80c2-16 12-24 26-24s24 8 26 24z" fill="#059669" />
      <path d="M32 58l8 8 8-8" fill="none" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="36" r="17" fill="#f5c9a5" />
      <path d="M23 33c0-12 8-19 17-19s17 7 17 19c-3-6-9-9-17-9s-14 3-17 9z" fill="#1f2937" />
      <circle cx="33.5" cy="37" r="2.2" fill="#111827" />
      <circle cx="46.5" cy="37" r="2.2" fill="#111827" />
      <path d="M34 44c3 3 9 3 12 0" fill="none" stroke="#111827" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M20 38c0-14 9-22 20-22s20 8 20 22" fill="none" stroke="#111827" strokeWidth="3.5" />
      <rect x="15" y="34" width="8" height="13" rx="3" fill="#10b981" stroke="#111827" strokeWidth="2" />
      <rect x="57" y="34" width="8" height="13" rx="3" fill="#10b981" stroke="#111827" strokeWidth="2" />
    </svg>
  );
}

type View = { kind: "home" } | { kind: "answer"; item: GuideAnswer } | { kind: "tour"; step: number };

export default function GuideAssistant() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>({ kind: "home" });
  const [never, setNever] = useState(false);
  const [typed, setTyped] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Decide once whether to open by itself.
  useEffect(() => {
    const isNever = store.get(KEY_NEVER) === "1";
    setNever(isNever);
    if (isNever) return;
    const last = Number(store.get(KEY_LAST) || 0);
    if (!last || Date.now() - last > REMIND_AFTER_MS) {
      const t = setTimeout(() => {
        setOpen(true);
        store.set(KEY_LAST, String(Date.now()));
      }, 1200);
      return () => clearTimeout(t);
    }
  }, []);

  // Typewriter welcome (skipped for people who prefer reduced motion).
  useEffect(() => {
    if (!open || view.kind !== "home") return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(WELCOME);
      return;
    }
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setTyped(WELCOME.slice(0, i));
      if (i >= WELCOME.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [open, view.kind]);

  const close = useCallback(() => {
    setOpen(false);
    setView({ kind: "home" });
    launcherRef.current?.focus();
  }, []);

  // Esc closes; focus the panel when it opens.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const toggleNever = (v: boolean) => {
    setNever(v);
    if (v) store.set(KEY_NEVER, "1");
    else store.del(KEY_NEVER);
  };

  const goStep = (n: number) => {
    const step = TOUR[n];
    setView({ kind: "tour", step: n });
    if (step && pathname !== step.href) router.push(step.href);
  };

  const follow = (href: string) => {
    if (href === "#tour") return goStep(0);
    router.push(href);
    close();
  };

  return (
    <>
      {/* Launcher */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-expanded={open}
        aria-controls="grid-guide"
        aria-label={open ? `Close ${GUIDE_NAME}, the GRID guide` : `Open ${GUIDE_NAME}, the GRID guide`}
        className="fixed left-4 bottom-24 z-40 rounded-full shadow-lg ring-2 ring-white dark:ring-zinc-900 hover:scale-105 transition-transform focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500"
      >
        <RemiAvatar size={52} />
        {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center" aria-hidden="true">
            ?
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          id="grid-guide"
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="false"
          aria-labelledby="grid-guide-title"
          className="fixed z-50 left-4 right-4 bottom-40 sm:right-auto sm:w-[420px] max-h-[70vh] flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 focus:outline-none"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
            <RemiAvatar size={40} />
            <div className="flex-1 min-w-0">
              <p id="grid-guide-title" className="font-bold text-gray-900 dark:text-white leading-tight">
                {GUIDE_NAME} <span className="font-normal text-gray-500">· GRID guide</span>
              </p>
              <p className="text-xs text-emerald-600">● Here to help</p>
            </div>
            <button type="button" onClick={close} aria-label="Close guide" className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 text-xl leading-none">
              ×
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
            {view.kind === "home" && (
              <>
                <div className="rounded-2xl rounded-tl-sm bg-emerald-50 dark:bg-emerald-900/20 text-gray-800 dark:text-gray-200 text-sm p-3 min-h-[5.5rem]">
                  <span className="sr-only">{WELCOME}</span>
                  <span aria-hidden="true">{typed}</span>
                </div>
                <div className="mt-4 grid gap-2">
                  {QUESTIONS.map((q) => (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setView({ kind: "answer", item: q })}
                      className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                    >
                      {q.question}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => goStep(0)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    ▶ Show me around GRID ({TOUR.length} stops)
                  </button>
                </div>
              </>
            )}

            {view.kind === "answer" && (
              <>
                <p className="ml-auto max-w-[85%] w-fit rounded-2xl rounded-tr-sm bg-gray-100 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white px-3 py-2">
                  {view.item.question}
                </p>
                <div className="mt-3 rounded-2xl rounded-tl-sm bg-emerald-50 dark:bg-emerald-900/20 text-gray-800 dark:text-gray-200 text-sm p-3">
                  {view.item.answer}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {view.item.links.map((l) => (
                    <button key={l.href} type="button" onClick={() => follow(l.href)} className="px-3.5 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                      {l.label} →
                    </button>
                  ))}
                </div>
                <p className="mt-5 text-xs font-bold text-gray-500 uppercase tracking-wide">More questions</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {QUESTIONS.filter((q) => q.id !== view.item.id).map((q) => (
                    <button key={q.id} type="button" onClick={() => setView({ kind: "answer", item: q })} className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500">
                      {q.question}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => setView({ kind: "home" })} className="mt-4 text-xs font-semibold text-gray-500 hover:text-emerald-600">
                  ← Back
                </button>
              </>
            )}

            {view.kind === "tour" && TOUR[view.step] && (
              <>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    Stop {view.step + 1} of {TOUR.length}
                  </span>
                  <button type="button" onClick={() => setView({ kind: "home" })} className="font-semibold hover:text-emerald-600">
                    Exit tour
                  </button>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-emerald-600 transition-all" style={{ width: `${((view.step + 1) / TOUR.length) * 100}%` }} />
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">{TOUR[view.step].title}</h3>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{TOUR[view.step].body}</p>
                {TOUR[view.step].tip && (
                  <p className="mt-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-200 text-xs p-2.5">💡 {TOUR[view.step].tip}</p>
                )}
                {pathname !== TOUR[view.step].href.split("?")[0] && (
                  <Link href={TOUR[view.step].href} className="mt-3 inline-block text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline">
                    Open {TOUR[view.step].title} →
                  </Link>
                )}
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => goStep(view.step - 1)}
                    disabled={view.step === 0}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 disabled:opacity-40"
                  >
                    ← Back
                  </button>
                  {view.step < TOUR.length - 1 ? (
                    <button type="button" onClick={() => goStep(view.step + 1)} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                      Next →
                    </button>
                  ) : (
                    <button type="button" onClick={close} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                      Finish ✓
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <label className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-500 cursor-pointer">
            <input type="checkbox" checked={never} onChange={(e) => toggleNever(e.target.checked)} className="w-4 h-4 accent-emerald-600" />
            Never remind me again
          </label>
        </div>
      )}
    </>
  );
}
