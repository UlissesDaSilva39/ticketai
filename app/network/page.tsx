"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import MessageButton from "@/components/MessageButton";
import ProBadge from "@/components/ProBadge";
import PersonActions, { type Connection } from "@/components/network/PersonActions";
import { initials, roleLabel } from "@/lib/display";

// My Network: connection requests, music-focused suggestions, and the people
// directory (Discover / Connections / Following / Followers). Real data only.

type Suggested = {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  role: string | null;
  genre: string | null;
  city: string | null;
  connection: Connection;
  following: boolean;
  requestedAt?: string | null;
};
type NetworkData = {
  counts: { connections: number; following: number; followers: number; invitations: number; sent: number };
  invitations: Suggested[];
  groups: { id: string; title: string; people: Suggested[] }[];
  newNearby: Suggested[];
  hasProfileBasics: boolean;
};

type View = "grow" | "catchup" | "discover" | "connections" | "following" | "followers";

const SIDEBAR: { id: View; label: string; icon: string; count?: keyof NetworkData["counts"] }[] = [
  { id: "connections", label: "Connections", icon: "🤝", count: "connections" },
  { id: "following", label: "Following", icon: "➕", count: "following" },
  { id: "followers", label: "Followers", icon: "👥", count: "followers" },
  { id: "discover", label: "Find people", icon: "🔎" },
];

function Avatar({ p, size = "h-14 w-14" }: { p: { name: string; avatar: string | null }; size?: string }) {
  return p.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.avatar} alt="" className={`${size} rounded-full object-cover flex-shrink-0`} />
  ) : (
    <span className={`${size} grid flex-shrink-0 place-items-center rounded-full bg-emerald-700 font-bold text-white`}>{initials(p.name)}</span>
  );
}

export default function NetworkPage() {
  const [view, setView] = useState<View>("grow");
  const [data, setData] = useState<NetworkData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/network", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError("Could not load your network."));
  }, []);
  useEffect(load, [load]);

  async function respond(senderId: string, action: "accept" | "ignore") {
    setData((d) => (d ? { ...d, invitations: d.invitations.filter((i) => i.id !== senderId), counts: { ...d.counts, invitations: d.counts.invitations - 1, connections: d.counts.connections + (action === "accept" ? 1 : 0) } } : d));
    await fetch("/api/connections/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ senderId, action }),
    }).catch(() => undefined);
  }

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-[1128px] px-4 py-6 grid grid-cols-12 gap-6">
        {/* LEFT: Manage my network */}
        <aside className="col-span-12 md:col-span-4 lg:col-span-3 space-y-3">
          <nav aria-label="Manage my network" className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <p className="px-4 py-3 font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800">Manage my network</p>
            <ul>
              {SIDEBAR.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setView(s.id)}
                    aria-current={view === s.id}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm ${view === s.id ? "bg-emerald-50 dark:bg-emerald-900/20 font-semibold text-emerald-800 dark:text-emerald-300" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"}`}
                  >
                    <span aria-hidden="true" className="w-5 text-center">{s.icon}</span>
                    <span className="flex-1 text-left">{s.label}</span>
                    {s.count && data && <span className="text-xs text-gray-500">{data.counts[s.count]}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {data && !data.hasProfileBasics && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 p-4 text-sm">
              <p className="font-semibold text-amber-900 dark:text-amber-300">Get better suggestions</p>
              <p className="mt-1 text-amber-800 dark:text-amber-400">Add your genre and city so we can introduce you to the right people.</p>
              <Link href="/profile/edit" className="mt-2 inline-block font-semibold text-amber-900 dark:text-amber-300 underline">
                Update profile →
              </Link>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="col-span-12 md:col-span-8 lg:col-span-9 space-y-4">
          {(view === "grow" || view === "catchup") && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm px-4" role="tablist">
              {(["grow", "catchup"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={view === t}
                  onClick={() => setView(t)}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 ${view === t ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900"}`}
                >
                  {t === "grow" ? "Grow" : "Catch up"}
                </button>
              ))}
            </div>
          )}

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          {view === "grow" && (
            <>
              {/* Invitations */}
              <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <h2 className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800">
                  Invitations {data ? `(${data.invitations.length})` : ""}
                </h2>
                {!data ? (
                  <div className="h-20 animate-pulse" />
                ) : data.invitations.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-gray-500">No pending invitations.</p>
                ) : (
                  <ul>
                    {data.invitations.map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
                        <Link href={`/u/${p.username}`}>
                          <Avatar p={p} />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <Link href={`/u/${p.username}`} className="font-semibold hover:underline">{p.name}</Link> wants to connect
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {roleLabel(p.role, p.genre)}
                            {p.city ? ` · ${p.city}` : ""}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => respond(p.id, "ignore")} className="rounded-full px-4 py-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800">
                            Ignore
                          </button>
                          <button type="button" onClick={() => respond(p.id, "accept")} className="rounded-full border border-emerald-600 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-800">
                            Accept
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              {/* Suggestion groups */}
              {!data
                ? [0, 1].map((i) => <div key={i} className="h-56 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse" />)
                : data.groups.map((g) => (
                    <section key={g.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{g.title}</h2>
                        <button type="button" onClick={() => setView("discover")} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-700">
                          See all
                        </button>
                      </div>
                      <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {g.people.map((p) => (
                          <li key={p.id} className="flex flex-col items-center rounded-xl border border-gray-200 dark:border-zinc-800 p-3 text-center">
                            <Link href={`/u/${p.username}`} className="flex flex-col items-center">
                              <Avatar p={p} size="h-16 w-16" />
                              <span className="mt-2 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white hover:underline">{p.name}</span>
                            </Link>
                            <span className="line-clamp-2 min-h-[2rem] text-xs text-gray-500">
                              {roleLabel(p.role, p.genre)}
                              {p.city ? ` · ${p.city}` : ""}
                            </span>
                            <div className="mt-2">
                              <PersonActions personId={p.id} connection={p.connection} following={p.following} compact />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
              {data && data.groups.length === 0 && (
                <p className="text-center text-sm text-gray-500">No new suggestions right now — try “Find people”.</p>
              )}
            </>
          )}

          {view === "catchup" && (
            <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
              <h2 className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800">New on GRID near you</h2>
              {!data ? (
                <div className="h-24 animate-pulse" />
              ) : data.newNearby.length === 0 ? (
                <p className="px-4 py-4 text-sm text-gray-500">Nobody new nearby this month. Check back soon.</p>
              ) : (
                <ul>
                  {data.newNearby.map((p) => (
                    <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
                      <Link href={`/u/${p.username}`}>
                        <Avatar p={p} size="h-12 w-12" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <Link href={`/u/${p.username}`} className="font-semibold hover:underline">{p.name}</Link> joined GRID
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {roleLabel(p.role, p.genre)}
                          {p.city ? ` · ${p.city}` : ""}
                        </p>
                      </div>
                      <PersonActions personId={p.id} connection={p.connection} following={p.following} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {(view === "discover" || view === "connections" || view === "following" || view === "followers") && (
            <PeopleDirectory tab={view} onBack={() => setView("grow")} />
          )}
        </main>
      </div>
    </div>
  );
}

// ---------------- People directory (search + filters) ----------------

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

const ROLES = [
  { value: "", label: "All roles" },
  { value: "artist", label: "Artists / Producers" },
  { value: "venue", label: "Venues" },
  { value: "promoter", label: "Promoters" },
  { value: "a_and_r", label: "A&R" },
  { value: "record_company", label: "Labels" },
  { value: "attendee", label: "Fans" },
];

const TITLES: Record<string, string> = {
  discover: "Find people",
  connections: "Your connections",
  following: "People you follow",
  followers: "Your followers",
};

function PeopleDirectory({ tab, onBack }: { tab: "discover" | "connections" | "following" | "followers"; onBack: () => void }) {
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

  const input = "w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onBack} aria-label="Back to My Network" className="grid h-8 w-8 place-items-center rounded-full text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800">
            &larr;
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{TITLES[tab]}</h1>
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
            {tab === "connections" ? "No connections yet" : tab === "following" ? "You're not following anyone yet" : tab === "followers" ? "No followers yet" : "No one matches those filters"}
          </p>
          <p className="mt-1 text-sm text-gray-500">{tab === "discover" ? "Try a different name, role or city." : "Go to Grow to find people to connect with."}</p>
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {people.map((p) => (
              <li key={p.id} className="flex flex-col rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm">
                <Link href={`/u/${p.username}`} className="flex items-center gap-3 group">
                  <Avatar p={p} />
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
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold ${p.following ? "bg-gray-200 text-gray-700 dark:bg-zinc-700 dark:text-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
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
    </>
  );
}
