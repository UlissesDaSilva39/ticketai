"use client";

import { useMemo, useState } from "react";
import MessageRow, { type InboxMessage } from "./MessageRow";

type Tab = "all" | "artist" | "promoter" | "direct" | "unread";

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "artist", label: "Artist" },
  { key: "promoter", label: "Promoter" },
  { key: "direct", label: "Direct" },
];

export default function InboxList({
  messages,
  counts,
}: {
  messages: InboxMessage[];
  counts: Record<string, number>;
}) {
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return messages;
    if (tab === "unread") return messages.filter((m) => !m.read_at);
    return messages.filter((m) => m.source === tab);
  }, [tab, messages]);

  function countFor(key: Tab): number {
    if (key === "all") return counts.all ?? messages.length;
    if (key === "unread") return counts.unread ?? 0;
    return counts[key] ?? 0;
  }

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => {
          const active = tab === t.key;
          const n = countFor(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition " +
                (active
                  ? "bg-black text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-black")
              }
            >
              {t.label}
              <span className={active ? "text-white/60" : "text-gray-400"}>{n}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <p className="text-sm font-medium text-gray-900">No messages here yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Messages sent to your artist, promoter, or user profiles appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <MessageRow key={m.source + ":" + m.id} message={m} />
          ))}
        </div>
      )}
    </>
  );
}