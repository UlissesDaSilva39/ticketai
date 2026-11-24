"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
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

// "Today" / "Yesterday" / "Mon 3 Nov" divider between days.
function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86_400_000);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(d, today)) return "Today";
  if (same(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
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
  const router = useRouter();
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
      // Refresh the conversation list (last message preview and order).
      router.refresh();
    } catch {
      setError("Network error");
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      setText(body);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-zinc-900">
      <div className="min-h-0 flex-1 overflow-y-auto p-4" ref={scrollRef} data-testid="message-list">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-gray-400 mt-8">
            No messages yet. Say hi to {otherName}.
          </div>
        ) : (
          <ul className="space-y-3">
            {messages.map((m, i) => {
              const mine = m.sender_id === currentUserId;
              const newDay = i === 0 || new Date(messages[i - 1].created_at).toDateString() !== new Date(m.created_at).toDateString();
              return (
                <li key={m.id} data-testid="message-item" data-mine={mine ? "1" : "0"}>
                  {newDay && (
                    <div className="my-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
                      {dayLabel(m.created_at)}
                      <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-800" />
                    </div>
                  )}
                  <div className={"flex " + (mine ? "justify-end" : "justify-start")}>
                    <div
                      className={
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-line break-words " +
                        (mine
                          ? "bg-emerald-600 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 rounded-bl-md")
                      }
                    >
                      {m.body}
                      <div className={"text-[10px] mt-1 " + (mine ? "text-emerald-100" : "text-gray-500 dark:text-gray-400")}>
                        {timeShort(m.created_at)}
                      </div>
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
        className="border-t border-gray-200 dark:border-zinc-800 p-3 flex gap-2 items-end"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            // Enter sends; Shift+Enter adds a new line.
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          placeholder="Write a message…"
          aria-label="Write a message"
          rows={Math.min(5, Math.max(1, text.split("\n").length))}
          maxLength={4000}
          disabled={busy}
          className="flex-1 resize-none rounded-2xl bg-[#f4f2ee] dark:bg-zinc-800 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          data-testid="message-input"
        />
        <button
          type="submit"
          disabled={busy || !text.trim()}
          className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition"
          data-testid="message-send"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

