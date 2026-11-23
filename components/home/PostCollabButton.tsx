"use client";

import { useState } from "react";

const CATEGORIES = [
  { value: "collab", label: "Collab" },
  { value: "gig", label: "Gig" },
  { value: "booking", label: "Booking" },
  { value: "session", label: "Session work" },
  { value: "remix", label: "Remix" },
  { value: "job", label: "Job" },
];

const input =
  "w-full rounded-lg border border-neutral-300 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

/** "+ Post a collab" button that opens a form and creates an opportunity. */
export default function PostCollabButton({ onPosted }: { onPosted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: f.get("title"),
          org: f.get("org"),
          category: f.get("category"),
          location: f.get("location"),
          remote: f.get("remote") === "on",
          compensation: f.get("compensation"),
          description: f.get("description"),
          deadline: f.get("deadline"),
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not post. Try again.");
      setOpen(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
      onPosted?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not post. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button
        type="button"
        data-cta="post-collab"
        onClick={() => setOpen(true)}
        className="mt-3 block w-full rounded-lg border border-emerald-700 py-2 text-center text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
      >
        + Post a collab
      </button>
      {done && <p role="status" className="mt-2 text-xs font-semibold text-emerald-700">Posted ✓ It&apos;s now in people&apos;s matches.</p>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="post-collab-title">
          <form onSubmit={submit} className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl text-neutral-900 dark:text-white space-y-3">
            <h2 id="post-collab-title" className="text-lg font-bold">Post an opportunity</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">It appears in members&apos; Matched For You. Applications arrive in your Messaging.</p>

            <label className="block text-sm font-semibold">
              Title
              <input name="title" required maxLength={120} placeholder="House vocalist needed for an EP" className={input + " mt-1"} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold">
                Posted as
                <input name="org" required maxLength={120} placeholder="Your name or label" className={input + " mt-1"} />
              </label>
              <label className="block text-sm font-semibold">
                Type
                <select name="category" defaultValue="collab" className={input + " mt-1"}>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-semibold">
                Location
                <input name="location" maxLength={80} placeholder="London" className={input + " mt-1"} />
              </label>
              <label className="block text-sm font-semibold">
                Pay (optional)
                <input name="compensation" maxLength={80} placeholder="£200 / rev share" className={input + " mt-1"} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <label className="block text-sm font-semibold">
                Deadline (optional)
                <input name="deadline" type="date" className={input + " mt-1"} />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold pb-2">
                <input name="remote" type="checkbox" className="h-4 w-4 accent-emerald-700" /> Remote OK
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Details
              <textarea name="description" rows={4} maxLength={4000} placeholder="Genre, what you need, timeline…" className={input + " mt-1 resize-none"} />
            </label>

            {error && <p role="alert" className="text-xs text-red-600">{error}</p>}
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-neutral-300 dark:border-zinc-700 py-2 text-sm font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={sending} className="flex-1 rounded-lg bg-emerald-700 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
                {sending ? "Posting…" : "Post"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
