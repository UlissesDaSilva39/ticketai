"use client";

import { useEffect, useState } from "react";
import { useReferral } from "@/lib/hooks/useReferral";
{/* data-join-privacy */}
<p style={{ marginTop: 12, fontSize: 13, opacity: 0.7 }}>
  We&apos;ll only use your email to tell you when GRID launches. Unsubscribe anytime.
  See our <a href="/legal/privacy" style={{ textDecoration: "underline" }}>privacy policy</a>.
</p>

export default function JoinPage() {
  const { addToWaitlist, recordOpen } = useReferral("GRID");
  const [ref, setRef] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("ref");
    setRef(r);
    recordOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToWaitlist(email.trim(), ref);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-8 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-5 mx-auto">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
          {ref ? "You've been invited to GRID" : "Join GRID"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {ref
            ? `Your friend shared a referral code (${ref}). GRID is invite-only right now â€” leave your email and we'll unlock your account this week.`
            : "GRID is invite-only right now. Leave your email and we'll be in touch."}
        </p>

        {submitted ? (
          <div className="text-center py-6">
            <p className="text-emerald-600 font-bold mb-1">You're on the list!</p>
            <p className="text-xs text-gray-500">We'll email {email} when your invite opens. Your friend earns their Pro month automatically.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
            >
              Claim my invite â†’
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              No spam. Just your invite. Unsubscribe any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}