"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PostCollabButton from "./PostCollabButton";

type Collab = { id: string; title: string; org: string; location: string | null; remote: boolean | null; created_at: string };

function ago(iso: string) {
  const h = Math.round((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

/** Newest open "collab" opportunities, with the post form underneath. */
export default function OpenCollabs() {
  const [items, setItems] = useState<Collab[] | null>(null);

  const load = useCallback(() => {
    fetch("/api/matches?category=collab&limit=3", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { matches: [] }))
      .then((d) => setItems(d.matches ?? []))
      .catch(() => setItems([]));
  }, []);

  useEffect(load, [load]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">Open Collabs</h3>
      {items === null ? (
        <div className="space-y-3" aria-label="Loading collabs">
          {[0, 1].map((i) => (
            <div key={i} className="h-10 rounded bg-gray-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-500">No open collabs yet. Post one and it&apos;ll show up in people&apos;s matches.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((c) => (
            <li key={c.id}>
              <Link href="/opportunities" className="group block">
                <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{c.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {c.org}
                  {c.remote ? " · Remote" : c.location ? ` · ${c.location}` : ""} · {ago(c.created_at)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <PostCollabButton onPosted={load} />
    </div>
  );
}
