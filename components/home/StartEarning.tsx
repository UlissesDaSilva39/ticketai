"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Sparkles, X } from "lucide-react";

type Step = { id: string; title: string; text: string; href: string; done: boolean };
const KEY = "grid:start-earning-hidden";

/** "Start earning" checklist on the home page. Hidden when complete or dismissed. */
export default function StartEarning() {
  const [steps, setSteps] = useState<Step[] | null>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(KEY) === "1";
    } catch {}
    if (dismissed) return;
    fetch("/api/earn/checklist", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.steps) return;
        setSteps(d.steps);
        setHidden(d.steps.every((s: Step) => s.done));
      })
      .catch(() => undefined);
  }, []);

  if (hidden || !steps) return null;
  const done = steps.filter((s) => s.done).length;
  const next = steps.find((s) => !s.done);

  return (
    <section aria-labelledby="start-earning-title" className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="start-earning-title" className="font-bold text-gray-900 dark:text-white inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" aria-hidden="true" /> Start earning on GRID
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{done} of {steps.length} done{next ? ` · next: ${next.title.toLowerCase()}` : ""}</p>
        </div>
        <button
          type="button"
          aria-label="Hide checklist"
          onClick={() => {
            try {
              localStorage.setItem(KEY, "1");
            } catch {}
            setHidden(true);
          }}
          className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-800 mt-3 overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={done} aria-label="Checklist progress">
        <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ol className="mt-3 divide-y divide-gray-100 dark:divide-zinc-800">
        {steps.map((s) => (
          <li key={s.id}>
            <Link href={s.href} className="flex items-center gap-3 py-2.5 group">
              <span className={`w-6 h-6 rounded-full grid place-items-center flex-none ${s.done ? "bg-emerald-600 text-white" : "border-2 border-gray-300 dark:border-zinc-600"}`} aria-hidden="true">
                {s.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-sm font-semibold ${s.done ? "text-gray-400 line-through" : "text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400"}`}>{s.title}</span>
                {!s.done && <span className="block text-xs text-gray-500">{s.text}</span>}
              </span>
              {!s.done && <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" aria-hidden="true" />}
              <span className="sr-only">{s.done ? "(done)" : "(to do)"}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
