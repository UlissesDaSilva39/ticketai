"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  author_name: string;
  role_needed: string;
  genre: string | null;
  bpm: number | null;
  description: string;
  reference_url: string | null;
  created_at: string;
};

export function CollabBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [role, setRole] = useState("Vocalist");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [desc, setDesc] = useState("");
  const [refUrl, setRefUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/collab/posts");
      if (r.ok) {
        const j = await r.json();
        setPosts(j.posts ?? []);
      }
    } catch {}
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function submit() {
    setErr(null);
    if (!desc.trim()) { setErr("Description required"); return; }
    setBusy(true);
    try {
      const r = await fetch("/api/collab/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role_needed: role,
          genre: genre || null,
          bpm: bpm ? Number(bpm) : null,
          description: desc,
          reference_url: refUrl || null,
        }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error || "Failed");
      setShowForm(false);
      setDesc(""); setGenre(""); setBpm(""); setRefUrl("");
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Co-creation board</h2>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="text-sm rounded-full border px-3 py-1"
        >
          {showForm ? "Cancel" : "+ Post"}
        </button>
      </div>

      {showForm && (
        <div className="space-y-2 mb-4 rounded-xl bg-gray-50 p-3">
          <div className="grid grid-cols-2 gap-2">
            <select value={role} onChange={(e) => setRole(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm">
              <option>Vocalist</option>
              <option>Producer</option>
              <option>DJ</option>
              <option>Mix Engineer</option>
              <option>Guitarist</option>
              <option>Drummer</option>
              <option>Songwriter</option>
            </select>
            <input value={genre} onChange={(e) => setGenre(e.target.value)}
              placeholder="Genre (optional)"
              className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input value={bpm} onChange={(e) => setBpm(e.target.value)}
              placeholder="BPM (optional)" inputMode="numeric"
              className="border rounded-lg px-3 py-2 text-sm" />
            <input value={refUrl} onChange={(e) => setRefUrl(e.target.value)}
              placeholder="Reference URL (optional)"
              className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full border rounded-lg px-3 py-2 text-sm h-20" />
          {err && <p className="text-xs text-red-600">{err}</p>}
          <button onClick={submit} disabled={busy}
            className="rounded-full bg-black text-white px-4 py-2 text-sm disabled:opacity-50">
            {busy ? "Posting…" : "Post"}
          </button>
        </div>
      )}

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {!loading && posts.length === 0 && (
        <p className="text-sm text-gray-500">
          No open collab posts yet. Be the first — click "+ Post".
        </p>
      )}
      <ul className="space-y-2">
        {posts.map((p) => (
          <li key={p.id} className="rounded-xl border p-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <strong>{p.author_name}</strong>
              <span className="text-xs text-gray-500">{p.role_needed}</span>
            </div>
            <p className="text-gray-700">{p.description}</p>
            <div className="text-xs text-gray-500 mt-1">
              {p.genre && <span>{p.genre}</span>}
              {p.bpm && <span> · {p.bpm} BPM</span>}
              {p.reference_url && (
                <>
                  {" · "}
                  <a href={p.reference_url} target="_blank" rel="noreferrer" className="underline">
                    reference
                  </a>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}