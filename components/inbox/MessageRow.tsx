"use client";

import { useState } from "react";

export type InboxMessage = {
  id: string;
  source: "artist" | "promoter" | "direct";
  sender_name: string;
  sender_email: string;
  message: string;
  read_at: string | null;
  created_at: string;
  context: string | null;
};

const SOURCE_LABEL: Record<string, string> = {
  artist: "Artist",
  promoter: "Promoter",
  direct: "Direct",
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return Math.floor(s / 60) + "m";
  if (s < 86400) return Math.floor(s / 3600) + "h";
  if (s < 604800) return Math.floor(s / 86400) + "d";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
}

export default function MessageRow({ message }: { message: InboxMessage }) {
  const [read, setRead] = useState(Boolean(message.read_at));
  const [busy, setBusy] = useState(false);

  async function markRead() {
    if (read || busy) return;
    setBusy(true);
    setRead(true);
    try {
      const res = await fetch("/api/inbox/mark-read", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: message.id, source: message.source }),
      });
      if (!res.ok) setRead(false);
    } catch {
      setRead(false);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article
      className={
        "bg-white border border-gray-200 rounded-2xl p-4 transition " +
        (read ? "opacity-80" : "")
      }
      onClick={markRead}
    >
      <div className="flex items-start gap-3">
        {!read && (
          <span className="mt-2 h-2 w-2 rounded-full bg-black flex-shrink-0 text-white" aria-label="unread" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {message.sender_name}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
              {SOURCE_LABEL[message.source] ?? message.source}
              {message.context ? " · " + message.context : ""}
            </span>
            <span className="text-xs text-gray-400">{timeAgo(message.created_at)}</span>
          </div>

          <div className="text-xs text-gray-500 mt-0.5 truncate">
            {message.sender_email}
          </div>

          <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
            {message.message}
          </p>

          <div className="mt-3 flex gap-3 text-xs">
            <a
              href={"mailto:" + message.sender_email}
              className="text-gray-500 hover:text-black"
              onClick={(e) => e.stopPropagation()}
            >
              Reply by email →
            </a>
            {!read && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); markRead(); }}
                disabled={busy}
                className="text-gray-500 hover:text-black disabled:opacity-50"
              >
                {busy ? "Marking..." : "Mark read"}
              </button>
            )}
            {read && <span className="text-gray-400">Read</span>}
          </div>
        </div>
      </div>
    </article>
  );
}