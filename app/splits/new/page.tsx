"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Split = { name: string; email: string; pct: number };

export default function NewSplitPage() {
  const router = useRouter();
  const [trackTitle, setTrackTitle] = useState("");
  const [splits, setSplits] = useState<Split[]>([
    { name: "", email: "", pct: 50 },
    { name: "", email: "", pct: 50 },
  ]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = splits.reduce((s, x) => s + (Number(x.pct) || 0), 0);

  function update(i: number, patch: Partial<Split>) {
    setSplits((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addRow() {
    setSplits((prev) => [...prev, { name: "", email: "", pct: 0 }]);
  }

  function removeRow(i: number) {
    setSplits((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!trackTitle.trim()) { setError("Track title required"); return; }
    if (Math.abs(total - 100) > 0.01) { setError("Splits must total 100% (currently " + total + "%)"); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/splits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track_title: trackTitle.trim(), splits }),
      });
      if (!res.ok && res.status !== 404) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Save failed (" + res.status + ")");
      }
      router.push("/splits");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold mb-2">New split</h1>
      <p className="text-gray-500 mb-8">
        Decide who owns what percentage of this track. Total must be 100%.
      </p>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Track title *</label>
          <input
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Midnight Drive"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Collaborators</label>
            <span className={"text-sm " + (Math.abs(total - 100) < 0.01 ? "text-green-600" : "text-red-600")}>
              Total: {total}%
            </span>
          </div>

          <div className="space-y-3">
            {splits.map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="col-span-4 border rounded-xl px-3 py-2"
                  placeholder="Name"
                  value={s.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                />
                <input
                  className="col-span-5 border rounded-xl px-3 py-2"
                  placeholder="email@example.com"
                  type="email"
                  value={s.email}
                  onChange={(e) => update(i, { email: e.target.value })}
                />
                <input
                  className="col-span-2 border rounded-xl px-3 py-2"
                  placeholder="%"
                  type="number"
                  min={0}
                  max={100}
                  value={s.pct}
                  onChange={(e) => update(i, { pct: Number(e.target.value) })}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  className="col-span-1 text-red-600 text-sm"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addRow}
            className="mt-3 text-sm underline"
          >
            + Add collaborator
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-full border px-5 py-3 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-black text-white px-6 py-3 font-medium disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create split"}
          </button>
        </div>
      </form>
    </main>
  );
}