"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import MessageButton from "@/components/MessageButton";
import ProBadge from "@/components/ProBadge";
import PersonActions, { type Connection } from "@/components/network/PersonActions";
import PersonAvatar from "@/components/network/PersonAvatar";
import { roleLabel } from "@/lib/display";
import { openToLabels } from "@/lib/open-to";

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
  headline: string | null;
  openTo: string[];
  mutualCount: number;
  mutualFirst: string | null;
  mutualAvatars?: { name: string; avatar: string | null }[];
  connection: Connection;
  following: boolean;
  requestedAt?: string | null;
};
type NetworkData = {
  counts: { connections: number; following: number; followers: number; invitations: number; sent: number; events: number; pages: number };
  invitations: Suggested[];
  groups: { id: string; title: string; people: Suggested[] }[];
  newNearby: Suggested[];
  hasProfileBasics: boolean;
  viewers?: {
    premium: boolean;
    count: number;
    total: number;
    items: { id: string | null; name: string | null; username: string | null; avatar: string | null; headline: string; viewedAt?: string }[];
  };
};

type View = "grow" | "catchup" | "discover" | "connections" | "following" | "followers";

// Outline icons in the style of the rest of GRID's UI.
const Icon = ({ d }: { d: string }) => (
  <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);
const ICONS = {
  connections: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  follow: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  groups: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198v.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  events: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  pages: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
};

type SidebarItem = { label: string; icon: string; count?: (c: NetworkData["counts"]) => number; view?: View; href?: string; soon?: boolean };
const SIDEBAR: SidebarItem[] = [
  { label: "Connections", icon: ICONS.connections, count: (c) => c.connections, view: "connections" },
  { label: "Following & followers", icon: ICONS.follow, count: (c) => c.following + c.followers, view: "following" },
  { label: "Groups", icon: ICONS.groups, soon: true },
  { label: "Events", icon: ICONS.events, count: (c) => c.events, href: "/events" },
  { label: "Artists & venues", icon: ICONS.pages, count: (c) => c.pages, href: "/discover" },
  { label: "Find people", icon: ICONS.search, view: "discover" },
];

function Avatar({ p, size = 56 }: { p: { name: string; avatar: string | null; openTo?: string[] }; size?: number }) {
  return <PersonAvatar name={p.name} src={p.avatar} openTo={p.openTo} size={size} />;
}

/** "Hassan and 2 other mutual connections", with tiny photos when available. */
function Mutuals({ count, first, avatars }: { count: number; first: string | null; avatars?: { name: string; avatar: string | null }[] }) {
  if (!count || !first) return null;
  const rest = count - 1;
  return (
    <span className="mt-1 flex items-center justify-center gap-1 text-[11px] text-gray-500">
      {avatars && avatars.length > 0 ? (
        <span className="mr-1 flex -space-x-1.5">
          {avatars.map((m, i) => (
            <PersonAvatar key={i} name={m.name} src={m.avatar} size={18} />
          ))}
        </span>
      ) : (
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.connections} />
        </svg>
      )}
      {first}
      {rest > 0 ? ` and ${rest} other mutual connection${rest === 1 ? "" : "s"}` : " is a mutual connection"}
    </span>
  );
}

export default function NetworkPage() {
  const [view, setView] = useState<View>("grow");
  const [data, setData] = useState<NetworkData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAllInvites, setShowAllInvites] = useState(false);

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
            <ul className="py-1">
              {SIDEBAR.map((s) => {
                const active = !!s.view && view === s.view;
                const cls = `flex w-full items-center gap-3 px-4 py-3 text-[15px] ${
                  active ? "bg-emerald-50 dark:bg-emerald-900/20 font-semibold text-emerald-800 dark:text-emerald-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                } ${s.soon ? "cursor-default opacity-70" : ""}`;
                const inner = (
                  <>
                    <Icon d={s.icon} />
                    <span className="flex-1 text-left">{s.label}</span>
                    {s.soon ? (
                      <span className="rounded bg-gray-100 dark:bg-zinc-800 px-1.5 text-[10px] font-bold uppercase text-gray-500">Soon</span>
                    ) : s.count && data ? (
                      <span className="text-sm text-gray-500">{s.count(data.counts).toLocaleString("en-GB")}</span>
                    ) : null}
                  </>
                );
                return (
                  <li key={s.label}>
                    {s.href ? (
                      <Link href={s.href} className={cls}>
                        {inner}
                      </Link>
                    ) : (
                      <button type="button" onClick={() => s.view && setView(s.view)} aria-current={active} disabled={s.soon} className={cls}>
                        {inner}
                      </button>
                    )}
                  </li>
                );
              })}
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
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Invitations {data ? `(${data.invitations.length})` : ""}</h2>
                  {data && data.invitations.length > 3 && (
                    <button type="button" onClick={() => setShowAllInvites((s) => !s)} className="text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-700">
                      {showAllInvites ? "Show less" : "Show all"}
                    </button>
                  )}
                </div>
                {!data ? (
                  <div className="h-20 animate-pulse" />
                ) : data.invitations.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-gray-500">No pending invitations.</p>
                ) : (
                  <ul>
                    {(showAllInvites ? data.invitations : data.invitations.slice(0, 3)).map((p) => (
                      <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3 border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
                        <Link href={`/u/${p.username}`}>
                          <Avatar p={p} size={64} />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900 dark:text-white">
                            <Link href={`/u/${p.username}`} className="font-semibold hover:underline">{p.name}</Link> wants to connect
                          </p>
                          <p className="line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{p.headline || roleLabel(p.role, p.genre)}</p>
                          <div className="[&>span]:justify-start">
                            <Mutuals count={p.mutualCount} first={p.mutualFirst} avatars={p.mutualAvatars} />
                          </div>
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

              {/* Who viewed your profile (Premium shows who; others see blurred hints) */}
              {data?.viewers && data.viewers.count > 0 && <ProfileViewers v={data.viewers} />}

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
                          <li key={p.id} className="relative flex flex-col items-center overflow-hidden rounded-xl border border-gray-200 dark:border-zinc-800 text-center transition-shadow hover:shadow-md">
                            {/* banner strip, green when the person is "Open to…" */}
                            <div className={`h-14 w-full ${p.openTo.length ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700"}`} />
                            <Link href={`/u/${p.username}`} className="-mt-9 flex flex-col items-center px-3">
                              <span className="rounded-full bg-white dark:bg-zinc-900 p-1">
                                <Avatar p={p} size={72} />
                              </span>
                              <span className="mt-2 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white hover:underline">{p.name}</span>
                            </Link>
                            <span className="line-clamp-2 min-h-[2rem] px-3 text-xs text-gray-600 dark:text-gray-400">{p.headline || roleLabel(p.role, p.genre)}</span>
                            {p.city && <span className="text-[11px] text-gray-400">{p.city}</span>}
                            {openToLabels(p.openTo)[0] && (
                              <span className="mt-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                                {openToLabels(p.openTo)[0].label}
                              </span>
                            )}
                            <Mutuals count={p.mutualCount} first={p.mutualFirst} />
                            <div className="mt-auto w-full px-3 pb-3 pt-3">
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
                        <Avatar p={p} size={52} />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <Link href={`/u/${p.username}`} className="font-semibold hover:underline">{p.name}</Link> joined GRID
                        </p>
                        <p className="line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{p.headline || roleLabel(p.role, p.genre)}</p>
                        {p.city && <p className="text-[11px] text-gray-400">{p.city}</p>}
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

// ---------------- Who viewed your profile ----------------

function viewedAgo(iso?: string) {
  if (!iso) return "";
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return d <= 0 ? "today" : d === 1 ? "yesterday" : `${d}d ago`;
}

function ProfileViewers({ v }: { v: NonNullable<NetworkData["viewers"]> }) {
  const scroller = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => scroller.current?.scrollBy({ left: dir * 240, behavior: "smooth" });

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400">
            <span aria-hidden="true" className="inline-block h-3 w-3 rounded-sm bg-gradient-to-br from-violet-500 to-amber-400" /> Premium
          </p>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {v.count} {v.count === 1 ? "person" : "people"} viewed your profile <span className="font-normal text-gray-500">· last 90 days</span>
          </h2>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={() => scroll(-1)} aria-label="Scroll left" className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 dark:border-zinc-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800">
            &lsaquo;
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Scroll right" className="grid h-8 w-8 place-items-center rounded-full border border-gray-300 dark:border-zinc-700 text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800">
            &rsaquo;
          </button>
        </div>
      </div>

      <ul ref={scroller} className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {v.items.map((p, i) => (
          <li key={p.id ?? i} className="flex w-60 flex-shrink-0 items-center gap-3 rounded-xl border border-gray-200 dark:border-zinc-800 p-3">
            {v.premium && p.username ? (
              <>
                <Link href={`/u/${p.username}`}>
                  <PersonAvatar name={p.name ?? ""} src={p.avatar} size={44} />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/u/${p.username}`} className="block truncate text-sm font-semibold text-gray-900 dark:text-white hover:underline">{p.name}</Link>
                  <p className="line-clamp-1 text-xs text-gray-500">{p.headline}</p>
                  <p className="text-[11px] text-gray-400">Viewed {viewedAgo(p.viewedAt)}</p>
                </div>
              </>
            ) : (
              <>
                {/* Anonymised for non-Premium members */}
                <span aria-hidden="true" className="h-11 w-11 flex-shrink-0 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-zinc-600 dark:to-zinc-700 blur-[2px]" />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{p.headline}</p>
                  <p className="text-[11px] text-gray-400">Viewed {viewedAgo(p.viewedAt)}</p>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {!v.premium && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 px-3 py-2">
          <p className="text-sm text-violet-900 dark:text-violet-200">See exactly who viewed you — and reach out first.</p>
          <Link href="/pro" className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-violet-700">
            Upgrade to see who
          </Link>
        </div>
      )}
    </section>
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
  headline: string | null;
  openTo: string[];
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
                  <Avatar p={p} size={60} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate font-bold text-gray-900 dark:text-white group-hover:underline">{p.name}</span>
                      {p.tier && <ProBadge tier={p.tier} />}
                    </span>
                    <span className="block line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{p.headline || roleLabel(p.role, p.genre)}</span>
                    <span className="block truncate text-[11px] text-gray-400">
                      @{p.username}
                      {p.city ? ` · ${p.city}` : ""}
                    </span>
                  </span>
                </Link>
                {openToLabels(p.openTo).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {openToLabels(p.openTo).map((o) => (
                      <span key={o.value} className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                        {o.label}
                      </span>
                    ))}
                  </div>
                )}
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
