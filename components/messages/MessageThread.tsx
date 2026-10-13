"use client";

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
