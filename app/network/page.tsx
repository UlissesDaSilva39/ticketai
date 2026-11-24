"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import MessageButton from "@/components/MessageButton";
import ProBadge from "@/components/ProBadge";
import { initials, roleLabel } from "@/lib/hooks/useMe";

// Real people directory (profiles + follows). Replaces a hard-coded mock-up.

type Person = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  role: string | null;
  genre: string | null;
  city: string | null;
  bio: string | null;
  following: boolean;
  tier: "pro" | "premium" | null;
};

const TABS = [
  { id: "discover", label: "Discover" },
  { id: "following", label: "Following" },
  { id: "followers", label: "Followers" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const ROLES = [
  { value: "", label: "All roles" },
  { value: "artist", label: "Artists / Producers" },
  { value: "venue", label: "Venues" },
  { value: "promoter", label: "Promoters" },
  { value: "a_and_r", label: "A&R" },
  { value: "record_company", label: "Labels" },
  { value: "attendee", label: "Fans" },
];

export default function NetworkPage() {
  const [tab, setTab] = useState<Tab>("discover");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [city, setCity] = useState("");
  const [people, setPeople] = useState<Person[] | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (offset: number) => {
      const params = new URLSearchParams({ tab, q, role, city, offset: String(offset) });
      const res = await fetch(`/api/people?${params}`, { credentials: "include", cache: "no-store" });
      if (!res.ok) throw new Error("Could not load people.");
      return (await res.json()) as { people: Person[]; hasMore: boolean };
    },
    [tab, q, role, city]
  );

  // Reload when the tab or filters change (debounced for typing).
  useEffect(() => {
    let alive = true;
    setPeople(null);
    setError(null);
    const t = setTimeout(() => {
      fetchPage(0)
        .then((d) => alive && (setPeople(d.people), setHasMore(d.hasMore)))
        .catch((e) => alive && (setError(e.message), setPeople([])));
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [fetchPage]);

  async function more() {
    setLoadingMore(true);
    try {
      const d = await fetchPage(people?.length ?? 0);
      setPeople((cur) => [...(cur ?? []), ...d.people.filter((p) => !cur?.some((c) => c.id === p.id))]);
      setHasMore(d.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load more.");
    } finally {
      setLoadingMore(false);
    }
  }

  async function toggleFollow(p: Person) {
    const next = !p.following;
    setPeople((cur) => (cur ?? []).map((x) => (x.id === p.id ? { ...x, following: next } : x)));
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetType: "user", targetId: p.id, following: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setPeople((cur) => (cur ?? []).map((x) => (x.id === p.id ? { ...x, following: !next } : x)));
    }
  }

  const input =
    "w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-[1128px] px-4 py-6 space-y-4">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your network</h1>
          <p className="text-sm text-gray-500 mt-1">Find artists, producers, venues and A&amp;R — follow them or start a conversation.</p>

          <div className="mt-4 flex gap-2" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                  tab === t.id ? "bg-emerald-700 text-white" : "border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or @username" aria-label="Search people" className={input} />
            <select value={role} onChange={(e) => setRole(e.target.value)} aria-label="Filter by role" className={input}>
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" aria-label="Filter by city" className={input} />
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        {people === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-44 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : people.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-10 text-center">
            <p className="font-semibold text-gray-900 dark:text-white">
              {tab === "following" ? "You're not following anyone yet" : tab === "followers" ? "No followers yet" : "No one matches those filters"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {tab === "discover" ? "Try a different name, role or city." : "Discover people and follow them to grow your network."}
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {people.map((p) => (
                <li key={p.id} className="flex flex-col rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                  <Link href={`/u/${p.username}`} className="flex items-center gap-3 group">
                    {p.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.avatar} alt="" className="h-14 w-14 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <span className="grid h-14 w-14 flex-shrink-0 place-items-center rounded-full bg-emerald-700 text-lg font-bold text-white">{initials(p.name)}</span>
                    )}
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate font-bold text-gray-900 dark:text-white group-hover:underline">{p.name}</span>
                        {p.tier && <ProBadge tier={p.tier} />}
                      </span>
                      <span className="block truncate text-xs text-gray-500">@{p.username}</span>
                      <span className="block truncate text-xs text-gray-600 dark:text-gray-400">
                        {roleLabel(p.role, p.genre)}
                        {p.city ? ` · ${p.city}` : ""}
                      </span>
                    </span>
                  </Link>
                  {p.bio && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{p.bio}</p>}
                  <div className="mt-auto pt-4 flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFollow(p)}
                      aria-pressed={p.following}
                      className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${
                        p.following ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700"
                      }`}
                    >
                      {p.following ? "Following" : "Follow"}
                    </button>
                    <MessageButton otherUserId={p.id} />
                  </div>
                </li>
              ))}
            </ul>
            {hasMore && (
              <button
                type="button"
                onClick={more}
                disabled={loadingMore}
                className="w-full py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-emerald-50 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Show more people"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
