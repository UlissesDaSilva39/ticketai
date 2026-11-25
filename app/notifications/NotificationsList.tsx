"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { markAllAsRead, markAsRead } from "./actions";
import { refreshMe } from "@/lib/hooks/useMe";

export type NotificationRow = {
  id: string;
  type: string | null;
  title: string;
  body: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
};

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "messages", label: "Messages" },
  { id: "activity", label: "Activity" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const ICONS: Record<string, string> = { message: "💬", referral: "🎉", booking: "📅", follow: "➕", like: "♥", comment: "💭", event: "🎫", payment: "💷" };

function ago(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Only follow internal links from notifications.
const safeHref = (h: string | null) => (h && h.startsWith("/") && !h.startsWith("//") ? h : null);

export default function NotificationsList({ initial }: { initial: NotificationRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [tab, setTab] = useState<Tab>("all");
  const [busy, setBusy] = useState(false);

  const unreadCount = items.filter((n) => !n.read_at).length;
  const shown = useMemo(() => {
    if (tab === "unread") return items.filter((n) => !n.read_at);
    if (tab === "messages") return items.filter((n) => n.type === "message");
    if (tab === "activity") return items.filter((n) => n.type !== "message");
    return items;
  }, [items, tab]);

  async function open(n: NotificationRow) {
    if (!n.read_at) {
      setItems((cur) => cur.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x)));
      void markAsRead(n.id).then(() => refreshMe()).catch(() => undefined);
    }
    const href = safeHref(n.href);
    if (href) router.push(href);
  }

  async function readAll() {
    setBusy(true);
    const now = new Date().toISOString();
    setItems((cur) => cur.map((x) => (x.read_at ? x : { ...x, read_at: now })));
    try {
      await markAllAsRead();
      refreshMe();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-200 dark:border-zinc-800">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Notifications</h1>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button type="button" onClick={readAll} disabled={busy} className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline disabled:opacity-50">
                  Mark all as read
                </button>
              )}
              <Link href="/settings/notifications" className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
                Settings
              </Link>
            </div>
          </div>

          <div className="flex gap-2 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                  tab === t.id ? "bg-emerald-700 text-white" : "border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800"
                }`}
              >
                {t.label}
                {t.id === "unread" && unreadCount > 0 ? ` (${unreadCount})` : ""}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="p-10 text-center">
              <p className="font-semibold text-gray-900 dark:text-white">{tab === "unread" ? "You're all caught up" : "No notifications yet"}</p>
              <p className="mt-1 text-sm text-gray-500">Messages, applications and invites will show up here.</p>
            </div>
          ) : (
            <ul>
              {shown.map((n) => (
                <li key={n.id} className="border-b last:border-b-0 border-gray-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => open(n)}
                    className={`w-full text-left flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/60 ${n.read_at ? "" : "bg-emerald-50/60 dark:bg-emerald-900/10"}`}
                  >
                    <span aria-hidden="true" className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-gray-100 dark:bg-zinc-800 text-lg">
                      {ICONS[n.type ?? ""] ?? "🔔"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${n.read_at ? "text-gray-700 dark:text-gray-300" : "font-semibold text-gray-900 dark:text-white"}`}>{n.title}</span>
                      {n.body && <span className="mt-0.5 block text-sm text-gray-500 line-clamp-2">{n.body}</span>}
                      <span className="mt-1 block text-xs text-gray-400">{ago(n.created_at)}</span>
                    </span>
                    {!n.read_at && <span aria-label="Unread" className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-600" />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
