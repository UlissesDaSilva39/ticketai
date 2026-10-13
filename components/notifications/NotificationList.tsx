"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { markAsRead, markAllAsRead } from "@/app/notifications/actions";

type Notif = {
  id: string;
  type: string | null;
  title: string | null;
  body: string | null;
  href: string | null;
  read_at: string | null;
  created_at: string;
};

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return sec + "s ago";
  const min = Math.floor(sec / 60);
  if (min < 60) return min + "m ago";
  const hr = Math.floor(min / 60);
  if (hr < 24) return hr + "h ago";
  const day = Math.floor(hr / 24);
  if (day === 1) return "yesterday";
  if (day < 7) return day + "d ago";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function NotificationList({ initial }: { initial: Notif[] }) {
  const [items, setItems] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const unread = items.filter((i) => !i.read_at).length;

  function onClickItem(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, read_at: new Date().toISOString() } : i))
    );
    startTransition(async () => {
      await markAsRead(id);
    });
  }

  function onMarkAll() {
    const now = new Date().toISOString();
    setItems((prev) => prev.map((i) => ({ ...i, read_at: i.read_at || now })));
    startTransition(async () => {
      await markAllAsRead();
    });
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-gray-600">You have no notifications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {unread > 0 ? unread + " unread" : "All caught up"}
        </p>
        {unread > 0 ? (
          <button
            type="button"
            onClick={onMarkAll}
            disabled={isPending}
            className="text-xs text-gray-600 hover:text-black underline disabled:opacity-50"
          >
            Mark all as read
          </button>
        ) : null}
      </div>

      <ul className="space-y-2">
        {items.map((n) => {
          const isUnread = !n.read_at;
          const Wrapper = n.href ? Link : "div";
          const wrapperProps = n.href ? { href: n.href } : {};
          return (
            <li key={n.id}>
              <Wrapper
                {...(wrapperProps as any)}
                onClick={() => onClickItem(n.id)}
                className={
                  "block rounded-2xl border p-4 transition " +
                  (isUnread
                    ? "bg-white border-gray-200 hover:border-gray-400"
                    : "bg-gray-50 border-gray-100")
                }
              >
                <div className="flex items-start gap-3">
                  <div
                    className={
                      "w-2 h-2 rounded-full mt-2 shrink-0 " +
                      (isUnread ? "bg-red-500" : "bg-transparent")
                    }
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title || "Notification"}</p>
                    {n.body ? (
                      <p className="text-sm text-gray-600 mt-0.5">{n.body}</p>
                    ) : null}
                    <p className="text-xs text-gray-400 mt-1">{relTime(n.created_at)}</p>
                  </div>
                </div>
              </Wrapper>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
