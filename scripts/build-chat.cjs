const fs = require("fs");
const path = require("path");

function W(rel, content) {
  const full = path.join(process.cwd(), rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log("  ✅ " + rel + " (" + content.split("\n").length + " lines)");
}

// ---------- components/messages/MessageThread.tsx ----------
W("components/messages/MessageThread.tsx", `"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

type Props = {
  conversationId: string;
  currentUserId: string;
  otherName: string;
  initialMessages: Message[];
};

function timeShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  });
}

export default function MessageThread({
  conversationId,
  currentUserId,
  otherName,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const supa = useRef<ReturnType<typeof createClient> | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  // Subscribe to realtime inserts
  useEffect(() => {
    if (!supa.current) supa.current = createClient();
    const client = supa.current;

    const channel = client
      .channel("messages-" + conversationId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "conversation_id=eq." + conversationId,
        },
        (payload) => {
          const incoming = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === incoming.id) ? prev : [...prev, incoming]
          );
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [conversationId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;

    setBusy(true);
    setError(null);

    // Optimistic
    const optimisticId = "temp-" + Date.now();
    const optimistic: Message = {
      id: optimisticId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      body,
      read_at: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, body }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        setError(data.error || "Failed to send");
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
        setText(body);
        return;
      }

      // Replace optimistic with server row
      if (data.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticId ? (data.message as Message) : m))
        );
      }
    } catch {
      setError("Network error");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setText(body);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-2xl border border-gray-200">
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef} data-testid="message-list">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-gray-400 mt-8">
            No messages yet. Say hi to {otherName}.
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => {
              const mine = m.sender_id === currentUserId;
              return (
                <li
                  key={m.id}
                  className={"flex " + (mine ? "justify-end" : "justify-start")}
                  data-testid="message-item"
                  data-mine={mine ? "1" : "0"}
                >
                  <div
                    className={
                      "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line break-words " +
                      (mine
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-900")
                    }
                  >
                    {m.body}
                    <div
                      className={
                        "text-[10px] mt-1 " +
                        (mine ? "text-gray-300" : "text-gray-500")
                      }
                    >
                      {timeShort(m.created_at)}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-red-700 bg-red-50 border-t border-red-100">
          {error}
        </div>
      )}

      <form
        onSubmit={submit}
        className="border-t border-gray-200 p-3 flex gap-2 items-center"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a message…"
          maxLength={4000}
          disabled={busy}
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50"
          data-testid="message-input"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-black text-white hover:bg-gray-800 disabled:opacity-40 transition"
          data-testid="message-send"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
`);

// ---------- app/messages/page.tsx (inbox list) ----------
W("app/messages/page.tsx", `import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Messages" };
export const dynamic = "force-dynamic";

function timeAgoShort(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return Math.floor(s / 60) + "m";
  if (s < 86400) return Math.floor(s / 3600) + "h";
  if (s < 604800) return Math.floor(s / 86400) + "d";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
}

export default async function MessagesInboxPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages");

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b, last_message_at")
    .or("participant_a.eq." + user.id + ",participant_b.eq." + user.id)
    .order("last_message_at", { ascending: false })
    .limit(50);

  const convs = conversations ?? [];
  const otherIds = Array.from(
    new Set(
      convs.map((c) => (c.participant_a === user.id ? c.participant_b : c.participant_a))
    )
  );

  let profiles: Record<string, { name: string; avatar_url: string | null }> = {};
  if (otherIds.length > 0) {
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .in("id", otherIds);
    for (const p of profs ?? []) {
      profiles[p.id] = {
        name: p.full_name || p.username || "User",
        avatar_url: p.avatar_url ?? null,
      };
    }
  }

  // Preview last message per conversation
  const previews: Record<string, string> = {};
  if (convs.length > 0) {
    const ids = convs.map((c) => c.id);
    const { data: msgs } = await supabase
      .from("messages")
      .select("conversation_id, body, created_at")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false });
    for (const m of msgs ?? []) {
      if (!previews[m.conversation_id]) previews[m.conversation_id] = m.body;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1
          className="text-4xl font-bold tracking-tight mb-2"
          style={{ fontFamily: "var(--font-antonio)" }}
          data-testid="messages-heading"
        >
          Messages
        </h1>
        <p className="text-gray-600 mb-8">Direct conversations on GRID.</p>

        {convs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
            No conversations yet. Message a promoter, venue, or artist from their
            profile to start one.
          </div>
        ) : (
          <ul className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
            {convs.map((c) => {
              const otherId =
                c.participant_a === user.id ? c.participant_b : c.participant_a;
              const other = profiles[otherId];
              const preview = previews[c.id] ?? "No messages yet";
              return (
                <li key={c.id}>
                  <Link
                    href={"/messages/" + c.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                    data-testid="conversation-row"
                  >
                    {other?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={other.avatar_url}
                        alt={other.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
                        {(other?.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-medium text-sm truncate">
                          {other?.name ?? "User"}
                        </span>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">
                          {timeAgoShort(c.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{preview}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
`);

// ---------- app/messages/[id]/page.tsx (thread view) ----------
W("app/messages/[id]/page.tsx", `import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import MessageThread from "@/components/messages/MessageThread";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Conversation" };
export const dynamic = "force-dynamic";

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/messages/" + id);

  const { data: conv } = await supabase
    .from("conversations")
    .select("id, participant_a, participant_b")
    .eq("id", id)
    .maybeSingle();

  if (!conv) notFound();
  if (conv.participant_a !== user.id && conv.participant_b !== user.id) notFound();

  const otherId =
    conv.participant_a === user.id ? conv.participant_b : conv.participant_a;

  const { data: other } = await supabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", otherId)
    .maybeSingle();

  const otherName = other?.full_name || other?.username || "User";

  const { data: messages } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, body, read_at, created_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(500);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/messages"
            className="text-sm text-gray-500 hover:text-black"
            data-testid="back-to-inbox"
          >
            ← Inbox
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-6">
          {other?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={other.avatar_url}
              alt={otherName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
              {otherName.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-antonio)" }}
              data-testid="thread-heading"
            >
              {otherName}
            </h1>
            <p className="text-xs text-gray-500">Direct message</p>
          </div>
        </div>

        <MessageThread
          conversationId={id}
          currentUserId={user.id}
          otherName={otherName}
          initialMessages={messages ?? []}
        />
      </div>
    </div>
  );
}
`);

console.log("");
console.log("Chat files written.");
