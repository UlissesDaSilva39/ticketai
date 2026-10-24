"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, UserPlus, UserCheck } from "lucide-react";

type Role = "attendee" | "a_and_r" | "record_company" | "artist" | "promoter" | "venue" | "admin" | "user";

export type PersonCardData = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  city: string | null;
  genre: string | null;
  bio: string | null;
  role: Role | string;
  label: string | null;
  followerCount: number;
  initialFollowing: boolean;
  signedIn: boolean;
};

const ROLE_LABELS: Record<string, string> = {
  attendee: "Fan",
  a_and_r: "A&R",
  record_company: "Label",
  artist: "Artist",
  promoter: "Promoter",
  venue: "Venue",
  admin: "Admin",
  user: "User",
};

function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role;
}

function initials(name: string | null, username: string | null): string {
  const src = (name || username || "?").trim();
  const parts = src.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PersonCard({ person }: { person: PersonCardData }) {
  const [following, setFollowing] = useState(person.initialFollowing);
  const [count, setCount] = useState(person.followerCount);
  const [busy, setBusy] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgForm, setMsgForm] = useState({ name: "", email: "", message: "" });
  const [msgBusy, setMsgBusy] = useState(false);
  const [msgOk, setMsgOk] = useState(false);
  const [msgErr, setMsgErr] = useState("");

  async function toggleFollow() {
    if (!person.signedIn) {
      window.location.href = "/login?next=" + encodeURIComponent("/people");
      return;
    }
    setBusy(true);
    const next = !following;
    setFollowing(next);
    setCount((n) => Math.max(n + (next ? 1 : -1), 0));
    try {
      const res = await fetch("/api/follows/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType: "user", targetId: person.id }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFollowing(Boolean(data.following));
      setCount(Number(data.count ?? count));
    } catch {
      setFollowing(!next);
      setCount((n) => Math.max(n + (next ? -1 : 1), 0));
    } finally {
      setBusy(false);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    setMsgBusy(true);
    setMsgErr("");
    try {
      const res = await fetch("/api/users/" + person.id + "/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msgForm),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Send failed");
      }
      setMsgOk(true);
      setMsgForm({ name: "", email: "", message: "" });
      setTimeout(() => { setMsgOk(false); setMsgOpen(false); }, 1800);
    } catch (err) {
      setMsgErr(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setMsgBusy(false);
    }
  }

  const profileHref = person.username ? "/u/" + person.username : null;
  const displayName = person.full_name || person.username || "Someone";
  const roleLine = [
    roleLabel(person.role),
    person.city,
    person.genre,
    person.label,
  ].filter(Boolean).join(" · ");

  return (
    <>
      <article className="bg-white border border-gray-200 rounded-2xl p-5 transition hover:border-black">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-xl bg-black text-white grid place-items-center text-lg font-bold flex-shrink-0">
            {initials(person.full_name, person.username)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {displayName}
              </h3>
              {person.username && (
                <span className="text-xs text-gray-500">@{person.username}</span>
              )}
            </div>

            <p className="mt-0.5 text-sm text-gray-500 truncate">{roleLine}</p>

            <p className="mt-2 text-xs text-gray-500">
              {count} {count === 1 ? "follower" : "followers"}
            </p>

            {person.bio && (
              <p className="mt-2 text-sm text-gray-700 italic line-clamp-2">
                {person.bio}
              </p>
            )}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleFollow}
                disabled={busy}
                aria-pressed={following}
                className={
                  "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition disabled:opacity-60 " +
                  (following
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800")
                }
              >
                {following ? (
                  <><UserCheck className="h-3.5 w-3.5" /> Following</>
                ) : (
                  <><UserPlus className="h-3.5 w-3.5" /> Follow</>
                )}
              </button>

              <button
                type="button"
                onClick={() => setMsgOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Message
              </button>

              {profileHref && (
                <Link
                  href={profileHref}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium hover:bg-gray-50"
                >
                  View profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {msgOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4 text-white"
          onClick={() => setMsgOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message {displayName}</h3>
              <button
                type="button"
                onClick={() => setMsgOpen(false)}
                className="text-gray-400 hover:text-black text-xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={sendMessage} className="space-y-3">
              <input
                type="text" required placeholder="Your name *"
                value={msgForm.name}
                onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
              />
              <input
                type="email" required placeholder="Your email *"
                value={msgForm.email}
                onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none"
              />
              <textarea
                rows={5} required placeholder="Message *"
                value={msgForm.message}
                onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-black focus:outline-none resize-y"
              />

              {msgErr && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{msgErr}</p>}
              {msgOk && (
                <p className="text-sm text-green-900 bg-green-50 border border-green-200 p-3 rounded-lg">
                  Message sent.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMsgOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={msgBusy}
                  className="px-5 py-2.5 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
                >
                  {msgBusy ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}