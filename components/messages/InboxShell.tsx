"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { InboxRow } from "@/lib/inbox";
import { initials } from "@/lib/display";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "applications", label: "Applications" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

function when(iso: string) {
  const d = new Date(iso);
  const diffH = (Date.now() - d.getTime()) / 3_600_000;
  if (diffH < 24) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (diffH < 24 * 7) return d.toLocaleDateString("en-GB", { weekday: "short" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function Avatar({ name, src, size = "h-12 w-12" }: { name: string; src: string | null; size?: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={`${size} rounded-full object-cover flex-shrink-0`} />
  ) : (
    <span className={`${size} grid flex-shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white`}>{initials(name)}</span>
  );
}

/** Two-panel inbox: list on the left, the open conversation (children) on the right. */
export default function InboxShell({ rows, children }: { rows: InboxRow[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const activeId = pathname.startsWith("/messages/") ? pathname.split("/")[2] : null;
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [composing, setComposing] = useState(false);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "unread" && !r.unread) return false;
      if (filter === "applications" && !r.isApplication) return false;
      if (needle && !`${r.name} ${r.username ?? ""} ${r.lastBody}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [rows, q, filter]);

  const unreadCount = rows.filter((r) => r.unread).length;

  return (
    <div className="bg-[#f4f2ee] dark:bg-black">
      <div className="mx-auto max-w-[1128px] px-0 sm:px-4 py-0 sm:py-6">
        <div className="grid h-[calc(100vh-56px)] sm:h-[calc(100vh-56px-3rem)] grid-cols-1 md:grid-cols-[340px_1fr] overflow-hidden bg-white dark:bg-zinc-900 sm:rounded-xl border-gray-200 dark:border-zinc-800 sm:border shadow-sm">
          {/* LEFT: conversation list (hidden on phones while a chat is open) */}
          <aside className={`${activeId ? "hidden md:flex" : "flex"} min-h-0 flex-col border-r border-gray-200 dark:border-zinc-800`}>
            <div className="flex items-center justify-between gap-2 px-4 pt-4 pb-3">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Messaging{unreadCount > 0 && <span className="ml-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span>}
              </h1>
              <button
                type="button"
                onClick={() => setComposing(true)}
                aria-label="New message"
                title="New message"
                className="grid h-9 w-9 place-items-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div className="px-4">
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search messages"
                  aria-label="Search messages"
                  className="w-full rounded-md bg-[#eef3f8] dark:bg-zinc-800 py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-3 border-b border-gray-200 dark:border-zinc-800" role="tablist">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                      filter === f.id ? "bg-emerald-700 text-white" : "border border-gray-400 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {f.label}
                    {f.id === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
                  </button>
                ))}
              </div>
            </div>

            <ul className="min-h-0 flex-1 overflow-y-auto">
              {shown.length === 0 ? (
                <li className="p-6 text-center text-sm text-gray-500">
                  {rows.length === 0 ? (
                    <>
                      No messages yet.{" "}
                      <button type="button" onClick={() => setComposing(true)} className="font-semibold text-emerald-700 hover:underline">
                        Start a conversation
                      </button>
                    </>
                  ) : (
                    "No conversations match."
                  )}
                </li>
              ) : (
                shown.map((r) => {
                  const active = r.id === activeId;
                  return (
                    <li key={r.id}>
                      <Link
                        href={`/messages/${r.id}`}
                        className={`flex items-start gap-3 border-b border-gray-100 dark:border-zinc-800 px-4 py-3 ${
                          active ? "bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-l-emerald-600 pl-3" : "hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                        }`}
                      >
                        <Avatar name={r.name} src={r.avatar} />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className={`truncate text-sm ${r.unread ? "font-bold text-gray-900 dark:text-white" : "text-gray-900 dark:text-gray-100"}`}>{r.name}</span>
                            <span className="flex-shrink-0 text-xs text-gray-500">{when(r.lastAt)}</span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className={`truncate text-xs ${r.unread ? "font-semibold text-gray-900 dark:text-white" : "text-gray-500"}`}>
                              {r.isApplication && <span className="mr-1 rounded bg-amber-100 px-1 text-[10px] font-bold uppercase text-amber-800">Application</span>}
                              {r.lastFromMe ? "You: " : ""}
                              {r.lastBody.replace(/^📩 Application:\s*/, "")}
                            </span>
                            {r.unread && <span aria-label="Unread" className="ml-auto h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-600" />}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })
              )}
            </ul>
          </aside>

          {/* RIGHT: the open conversation (hidden on phones when none is open) */}
          <section className={`${activeId ? "flex" : "hidden md:flex"} min-h-0 flex-col`}>{children}</section>
        </div>
      </div>

      {composing && <NewMessageDialog onClose={() => setComposing(false)} />}
    </div>
  );
}

/** Pick someone to message (searches the people directory). */
function NewMessageDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [people, setPeople] = useState<{ id: string; name: string; username: string; avatar: string | null }[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      // Default to people you follow; search everyone when typing.
      const params = new URLSearchParams(q.trim() ? { tab: "discover", q } : { tab: "following" });
      fetch(`/api/people?${params}`, { credentials: "include", cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { people: [] }))
        .then((d) => setPeople(d.people ?? []))
        .catch(() => setPeople([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  async function start(id: string) {
    setBusy(id);
    setError(null);
    try {
      const res = await fetch("/api/messages/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otherUserId: id }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.conversationId) throw new Error(d.error || "Could not start the conversation.");
      onClose();
      router.push(`/messages/${d.conversationId}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start the conversation.");
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-24" role="dialog" aria-modal="true" aria-labelledby="new-msg-title">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="new-msg-title" className="text-lg font-bold text-gray-900 dark:text-white">New message</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-2xl leading-none text-gray-500">
            &times;
          </button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a name or @username"
          aria-label="Find a person"
          className="mt-3 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        {error && (
          <p role="alert" className="mt-2 text-xs text-red-600">
            {error}{" "}
            <Link href="/pro" className="font-semibold underline">
              See plans
            </Link>
          </p>
        )}
        <ul className="mt-3 max-h-80 overflow-y-auto">
          {people === null ? (
            <li className="p-3 text-sm text-gray-500">Loading…</li>
          ) : people.length === 0 ? (
            <li className="p-3 text-sm text-gray-500">{q ? "No one found." : "You're not following anyone yet — type a name to search."}</li>
          ) : (
            people.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => start(p.id)}
                  disabled={!!busy}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-emerald-50 dark:hover:bg-zinc-800 disabled:opacity-60"
                >
                  <Avatar name={p.name} src={p.avatar} size="h-10 w-10" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">{p.name}</span>
                    <span className="block truncate text-xs text-gray-500">@{p.username}</span>
                  </span>
                  {busy === p.id && <span className="ml-auto text-xs text-gray-500">Opening…</span>}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
