"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { initials, roleLabel } from "@/lib/hooks/useMe";

type Person = { id: string; name: string; username: string; avatar: string | null; role: string | null; genre: string | null; promoted?: boolean };

export default function SuggestedPeople() {
  const [people, setPeople] = useState<Person[] | null>(null);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/suggestions/people", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { people: [] }))
      .then((d) => setPeople(d.people ?? []))
      .catch(() => setPeople([]));
  }, []);

  async function toggle(p: Person) {
    const next = !following[p.id];
    setBusy(p.id);
    setFollowing((f) => ({ ...f, [p.id]: next }));
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetType: "user", targetId: p.id, following: next }),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setFollowing((f) => ({ ...f, [p.id]: !!d.following }));
    } catch {
      setFollowing((f) => ({ ...f, [p.id]: !next }));
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white text-base mb-4">People to Follow</h3>

      {people === null ? (
        <div className="space-y-4" aria-label="Loading suggestions">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-800" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-gray-200 dark:bg-zinc-800" />
                <div className="h-3 w-20 rounded bg-gray-100 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : people.length === 0 ? (
        <p className="text-sm text-gray-500">
          You&apos;re following everyone we&apos;d suggest. <Link href="/network" className="text-emerald-700 font-semibold hover:underline">Browse the network</Link>
        </p>
      ) : (
        <div className="space-y-4">
          {people.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-2">
              <Link href={`/u/${p.username}`} className="flex items-center gap-3 min-w-0 group">
                {p.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white grid place-items-center font-bold text-sm flex-shrink-0">{initials(p.name)}</div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:underline">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.promoted ? "Promoted · " : ""}{roleLabel(p.role, p.genre)}</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => toggle(p)}
                disabled={busy === p.id}
                aria-pressed={!!following[p.id]}
                className={`text-xs font-bold px-4 py-1.5 rounded-full transition-colors flex-shrink-0 disabled:opacity-60 ${
                  following[p.id]
                    ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-300"
                    : "border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {following[p.id] ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
