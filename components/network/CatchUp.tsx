"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PersonAvatar from "@/components/network/PersonAvatar";
import PersonActions, { type Connection } from "@/components/network/PersonActions";
import { roleLabel } from "@/lib/display";

// Network → Catch up: what's new with the people you're connected to or follow.
// Everything comes from /api/network/catchup (real data only). Message buttons
// open the chat with a pre-typed draft; nothing is sent until you press Send.

type CatchupType = "release" | "show" | "open" | "connection" | "joined" | "anniversary";
type Item = {
  key: string;
  type: CatchupType;
  date: string;
  person: {
    id: string;
    name: string;
    username: string;
    avatar: string | null;
    role: string | null;
    genre: string | null;
    city: string | null;
    headline: string | null;
    openTo: string[];
    connection: Connection;
    following: boolean;
  };
  text: string;
  detail: string | null;
  href: string | null;
  audio: { url: string; title: string } | null;
  draft: string | null;
  action: string | null;
};
type Data = { items: Item[]; counts: Record<CatchupType, number>; circleSize: number };

const FILTERS: { id: "all" | CatchupType; label: string; empty: string }[] = [
  { id: "all", label: "All", empty: "No updates from your network yet." },
  { id: "release", label: "New releases", empty: "No new tracks from your network in the last 60 days." },
  { id: "show", label: "Upcoming shows", empty: "Nobody in your network has an upcoming show yet." },
  { id: "open", label: "Open to work", empty: "Nobody in your network is open to collabs or bookings right now." },
  { id: "connection", label: "New connections", empty: "No new connections in the last 60 days." },
  { id: "joined", label: "New members", empty: "Nobody new near you this month. Add your city to your profile to see local members." },
  { id: "anniversary", label: "GRID anniversaries", empty: "No GRID anniversaries this fortnight." },
];

// Outline icons (same stroke style as the My Network sidebar).
const PATHS: Record<CatchupType | "all", string> = {
  all: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5",
  release: "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z",
  show: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z",
  open: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0",
  connection: "M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z",
  joined: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z",
  anniversary: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
};
const LineIcon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg className={`${className} flex-shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);
// Small badge on the photo: white ring, tinted circle, outline icon.
const BADGE: Record<CatchupType, string> = {
  release: "bg-emerald-600 text-white",
  show: "bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900",
  open: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  connection: "bg-white text-gray-700 dark:bg-zinc-800 dark:text-gray-200",
  joined: "bg-white text-gray-700 dark:bg-zinc-800 dark:text-gray-200",
  anniversary: "bg-white text-gray-700 dark:bg-zinc-800 dark:text-gray-200",
};

const HIDDEN_KEY = "grid:catchup:hidden";
function readHidden(): string[] {
  try {
    return JSON.parse(localStorage.getItem(HIDDEN_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function CatchUp({ onFindPeople }: { onFindPeople: () => void }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | CatchupType>("all");
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    setHidden(readHidden());
    fetch("/api/network/catchup", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError("Could not load updates from your network."));
  }, []);

  function hide(key: string) {
    const next = [...new Set([...hidden, key])].slice(-300);
    setHidden(next);
    try {
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(next));
    } catch {
      /* private mode: hide for this visit only */
    }
  }

  const visible = (data?.items ?? []).filter((i) => !hidden.includes(i.key));
  const shown = filter === "all" ? visible : visible.filter((i) => i.type === filter);
  const countFor = (id: "all" | CatchupType) => (id === "all" ? visible.length : visible.filter((i) => i.type === id).length);

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-gray-100 dark:border-zinc-800" role="tablist" aria-label="Filter updates">
        {FILTERS.map((f) => {
          const active = filter === f.id;
          const n = data ? countFor(f.id) : 0;
          return (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.id)}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                active
                  ? "bg-emerald-700 text-white"
                  : "border border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-300"
              }`}
            >
              <LineIcon d={PATHS[f.id]} />
              {f.label}
              {data && n > 0 && <span className={`ml-1.5 text-xs ${active ? "text-emerald-100" : "text-gray-400"}`}>{n}</span>}
            </button>
          );
        })}
      </div>

      {error && <p role="alert" className="px-4 py-4 text-sm text-red-600">{error}</p>}

      {!data && !error ? (
        <ul>
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex items-center gap-3 px-4 py-4 border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
              <div className="h-14 w-14 rounded-full bg-gray-100 dark:bg-zinc-800 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-zinc-800 animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      ) : data && data.circleSize === 0 && shown.length === 0 ? (
        <div className="px-6 py-10 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            <LineIcon d={PATHS.release} className="h-7 w-7" />
          </span>
          <p className="mt-2 text-base font-bold text-gray-900 dark:text-white">Catch up with your music network</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-600 dark:text-gray-400">
            Connect with or follow artists, producers, venues and promoters to see their new releases, upcoming shows and who&apos;s open to collabs.
          </p>
          <button type="button" onClick={onFindPeople} className="mt-4 rounded-full bg-emerald-700 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-800">
            Find people
          </button>
        </div>
      ) : data && shown.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">{FILTERS.find((f) => f.id === filter)?.empty}</p>
      ) : (
        <ul>
          {shown.map((item) => (
            <CatchupRow key={item.key} item={item} onHide={() => hide(item.key)} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CatchupRow({ item, onHide }: { item: Item; onHide: () => void }) {
  const p = item.person;
  const [playing, setPlaying] = useState(false);
  const badge = BADGE[item.type];

  return (
    <li className="px-4 py-4 border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
      <div className="flex items-start gap-3">
        <Link href={`/u/${p.username}`} className="relative flex-shrink-0">
          <PersonAvatar name={p.name} src={p.avatar} openTo={p.openTo} size={56} />
          <span
            aria-hidden="true"
            className={`absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full shadow-sm ring-2 ring-white dark:ring-zinc-900 ${badge}`}
          >
            <LineIcon d={PATHS[item.type]} className="h-3.5 w-3.5" />
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-900 dark:text-white">
            <Link href={`/u/${p.username}`} className="font-bold hover:underline">
              {p.name}
            </Link>{" "}
            {item.text}
          </p>
          {item.detail && <p className="mt-0.5 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">{item.detail}</p>}
          <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-400">{p.headline || roleLabel(p.role, p.genre)}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {item.audio && (
              <button
                type="button"
                onClick={() => setPlaying((v) => !v)}
                aria-pressed={playing}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-zinc-700 px-4 py-1.5 text-xs font-bold text-gray-900 dark:text-white hover:border-gray-900"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
                {playing ? "Close player" : "Listen"}
              </button>
            )}
            {item.type === "show" && item.href && (
              <Link
                href={item.href}
                className="rounded-full border border-gray-300 dark:border-zinc-700 px-4 py-1.5 text-xs font-bold text-gray-900 dark:text-white hover:border-gray-900"
              >
                View event
              </Link>
            )}
            {item.type === "joined" && p.connection !== "connected" && (
              <PersonActions personId={p.id} connection={p.connection} following={p.following} />
            )}
            {item.draft && item.action && <DraftMessageButton personId={p.id} draft={item.draft} label={item.action} />}
          </div>

          {playing && item.audio && (
            <div className="mt-3 rounded-lg bg-gray-50 dark:bg-zinc-800 p-2">
              <p className="mb-1 px-1 text-xs font-semibold text-gray-700 dark:text-gray-300">{item.audio.title}</p>
              <audio src={item.audio.url} controls autoPlay preload="none" className="w-full" />
            </div>
          )}
        </div>

        <RowMenu username={p.username} onHide={onHide} />
      </div>
    </li>
  );
}

/** Opens (or starts) the chat with a pre-typed message the member can edit. */
function DraftMessageButton({ personId, draft, label }: { personId: string; draft: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);

  async function open() {
    setBusy(true);
    setError(null);
    setUpgrade(false);
    try {
      const res = await fetch("/api/messages/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otherUserId: personId }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.status === 401) return router.push("/login");
      if (!res.ok || !d.conversationId) {
        setUpgrade(res.status === 402);
        throw new Error(d.error || "Could not open the chat.");
      }
      router.push(`/messages/${d.conversationId}?draft=${encodeURIComponent(draft)}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the chat.");
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={open}
        disabled={busy}
        title={draft}
        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-zinc-800 disabled:opacity-60"
      >
        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m-9 6l2.6-2.6A2 2 0 018 17h10a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14z" />
        </svg>
        {busy ? "Opening…" : label}
      </button>
      {error && (
        <span role="alert" className="max-w-xs text-xs text-red-600">
          {error}{" "}
          {upgrade && (
            <Link href="/pro" className="font-semibold underline">
              See plans
            </Link>
          )}
        </span>
      )}
    </span>
  );
}

/** The "…" menu: view profile or hide this update. */
function RowMenu({ username, onHide }: { username: string; onHide: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        aria-label="More options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.8" />
          <circle cx="12" cy="12" r="1.8" />
          <circle cx="19" cy="12" r="1.8" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-1 shadow-lg">
          <Link role="menuitem" href={`/u/${username}`} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800">
            View profile
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              setOpen(false);
              onHide();
            }}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800"
          >
            Hide this update
          </button>
        </div>
      )}
    </div>
  );
}
