"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MIN_ARTWORK_PX,
  RELEASE_TYPES,
  RELEASE_TYPE_LABEL,
  checkRelease,
  isReady,
  type ReleaseInput,
  type ReleaseTrackInput,
} from "@/lib/distribution/checks";

const GENRES = [
  "Alternative", "Afrobeats", "Ambient", "Blues", "Classical", "Country", "Dance", "Drum & Bass", "Dubstep",
  "Electronic", "Folk", "Funk", "Gospel", "Hip-Hop/Rap", "House", "Indie", "Jazz", "Latin", "Metal", "Pop",
  "Punk", "R&B/Soul", "Reggae", "Rock", "Singer/Songwriter", "Soundtrack", "Tech House", "Techno", "Trance", "UK Garage", "World",
];

const input =
  "w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500";
const label = "block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1";
const card = "bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 sm:p-6";

const emptyTrack = (composers = "", producers = ""): ReleaseTrackInput => ({
  title: "",
  version: null,
  featuredArtists: null,
  composers: composers || null,
  producers: producers || null,
  isrc: null,
  explicit: false,
  audioPath: null,
  audioName: null,
});

async function upload(kind: "artwork" | "audio", file: File) {
  const res = await fetch("/api/distribution/file-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, contentType: file.type, size: file.size, name: file.name }),
  });
  const t = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(t.error || "Upload failed.");
  const { error } = await createClient().storage.from(t.bucket).uploadToSignedUrl(t.path, t.token, file, {
    contentType: file.type || "application/octet-stream",
  });
  if (error) throw new Error("Upload failed. Please try again.");
  return t.path as string;
}

const imageSize = (file: File) =>
  new Promise<{ w: number; h: number; url: string }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight, url });
    img.onerror = () => reject(new Error("That image couldn't be read."));
    img.src = url;
  });

export default function ReleaseEditor({ id }: { id: string }) {
  const router = useRouter();
  const [r, setR] = useState<ReleaseInput | null>(null);
  const [status, setStatus] = useState("draft");
  const [notify, setNotify] = useState(true);
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string>("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch(`/api/distribution/releases/${id}`)
      .then(async (res) => {
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.error || "Could not load this release.");
        setR(d.release);
        setStatus(d.status);
        setNotify(d.notifyOnLaunch !== false);
        setArtworkUrl(d.artworkUrl);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : "Could not load this release."));
  }, [id]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const checks = useMemo(() => (r ? checkRelease(r) : []), [r]);
  const errors = checks.filter((c) => !c.ok && c.level === "error");
  const warnings = checks.filter((c) => !c.ok && c.level === "warning");
  const passed = checks.filter((c) => c.ok).length;
  const ready = r ? isReady(checks) : false;
  const editable = status === "draft" || status === "ready";

  const set = <K extends keyof ReleaseInput>(k: K, v: ReleaseInput[K]) => {
    setR((prev) => (prev ? { ...prev, [k]: v } : prev));
    setDirty(true);
    setMsg(null);
  };
  const setTrack = (i: number, patch: Partial<ReleaseTrackInput>) => {
    setR((prev) => (prev ? { ...prev, tracks: prev.tracks.map((t, j) => (j === i ? { ...t, ...patch } : t)) } : prev));
    setDirty(true);
    setMsg(null);
  };
  const moveTrack = (i: number, d: -1 | 1) =>
    setR((prev) => {
      if (!prev) return prev;
      const t = [...prev.tracks];
      const j = i + d;
      if (j < 0 || j >= t.length) return prev;
      [t[i], t[j]] = [t[j], t[i]];
      setDirty(true);
      return { ...prev, tracks: t };
    });

  async function save() {
    if (!r) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/distribution/releases/${id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...r, notifyOnLaunch: notify }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not save.");
      setStatus(d.status);
      setDirty(false);
      setMsg({
        kind: "ok",
        text: d.invalidCodes
          ? "Saved, except an ISRC or UPC that isn't valid. Fix it or leave it empty."
          : d.status === "ready"
            ? "Saved. Your release is ready for delivery."
            : "Saved as a draft.",
      });
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Could not save." });
    } finally {
      setSaving(false);
    }
  }

  async function onArtwork(file: File | undefined) {
    if (!file) return;
    setBusy("artwork");
    setMsg(null);
    try {
      const { w, h, url } = await imageSize(file);
      const path = await upload("artwork", file);
      setArtworkUrl(url);
      setR((prev) => (prev ? { ...prev, artworkPath: path, artworkWidth: w, artworkHeight: h } : prev));
      setDirty(true);
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setBusy("");
    }
  }

  async function onAudio(i: number, file: File | undefined) {
    if (!file) return;
    setBusy(`audio-${i}`);
    setMsg(null);
    try {
      const path = await upload("audio", file);
      setTrack(i, {
        audioPath: path,
        audioName: file.name,
        ...(r && !r.tracks[i].title ? { title: file.name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ") } : {}),
      });
    } catch (e) {
      setMsg({ kind: "error", text: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setBusy("");
    }
  }

  async function remove() {
    if (!confirm("Delete this release and its uploaded files? This can't be undone.")) return;
    const res = await fetch(`/api/distribution/releases/${id}`, { method: "DELETE" });
    if (res.ok) {
      setDirty(false);
      router.push("/distribution/releases");
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg({ kind: "error", text: d.error || "Could not delete." });
    }
  }

  if (loadError)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4 text-center">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{loadError}</p>
          <Link href="/distribution/releases" className="inline-block mt-4 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
            Back to my releases
          </Link>
        </div>
      </div>
    );
  if (!r)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <p className="text-gray-500" role="status">Loading your release…</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/distribution/releases" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← My releases
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
          <div className="space-y-6 min-w-0">
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">Release builder · Early access</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white break-words">{r.title || "Untitled release"}</h1>
            </div>

            {!editable && (
              <p className="rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 px-4 py-3 text-sm">
                This release has been submitted, so it can&apos;t be edited here.
              </p>
            )}

            <fieldset disabled={!editable} className="space-y-6 min-w-0">
              {/* RELEASE DETAILS */}
              <section className={card}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">1. Release details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <span className={label}>Release type</span>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Release type">
                      {RELEASE_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={r.releaseType === t}
                          onClick={() => set("releaseType", t)}
                          className={`py-2.5 rounded-xl text-sm font-bold border-2 ${
                            r.releaseType === t ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300" : "border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {RELEASE_TYPE_LABEL[t]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="title" className={label}>Release title *</label>
                    <input id="title" value={r.title} onChange={(e) => set("title", e.target.value)} maxLength={200} className={input} />
                  </div>
                  <div>
                    <label htmlFor="artist" className={label}>Primary artist *</label>
                    <input id="artist" value={r.primaryArtist} onChange={(e) => set("primaryArtist", e.target.value)} maxLength={200} className={input} />
                  </div>
                  <div>
                    <label htmlFor="genre" className={label}>Genre *</label>
                    <select id="genre" value={r.genre ?? ""} onChange={(e) => set("genre", e.target.value || null)} className={input}>
                      <option value="">Choose a genre</option>
                      {GENRES.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="language" className={label}>Lyrics language</label>
                    <input id="language" value={r.language ?? ""} onChange={(e) => set("language", e.target.value || null)} placeholder="English, or Instrumental" maxLength={40} className={input} />
                  </div>
                  <div>
                    <label htmlFor="copyright" className={label}>℗ Copyright line *</label>
                    <input id="copyright" value={r.copyrightLine ?? ""} onChange={(e) => set("copyrightLine", e.target.value || null)} placeholder="2026 Your Name" maxLength={200} className={input} />
                  </div>
                  <div>
                    <label htmlFor="labelName" className={label}>Label name</label>
                    <input id="labelName" value={r.labelName ?? ""} onChange={(e) => set("labelName", e.target.value || null)} placeholder="Leave empty if independent" maxLength={200} className={input} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 sm:col-span-2">
                    <input type="checkbox" checked={r.explicit} onChange={(e) => set("explicit", e.target.checked)} className="w-4 h-4 accent-emerald-600" />
                    Contains explicit lyrics
                  </label>
                </div>
              </section>

              {/* ARTWORK */}
              <section className={card}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">2. Cover art</h2>
                <p className="text-sm text-gray-500 mb-4">Square JPG or PNG, at least {MIN_ARTWORK_PX}×{MIN_ARTWORK_PX}px. No website addresses, social handles or blurry images.</p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 flex-none overflow-hidden flex items-center justify-center text-white text-4xl">
                    {artworkUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={artworkUrl} alt="Cover art preview" className="w-full h-full object-cover" />
                    ) : (
                      <span aria-hidden="true">♫</span>
                    )}
                  </div>
                  <div className="text-sm">
                    <label className="inline-block cursor-pointer px-4 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700">
                      {busy === "artwork" ? "Uploading…" : r.artworkPath ? "Replace cover art" : "Upload cover art"}
                      <input type="file" accept="image/jpeg,image/png" className="sr-only" onChange={(e) => onArtwork(e.target.files?.[0])} disabled={busy !== ""} />
                    </label>
                    {r.artworkPath && r.artworkWidth && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {r.artworkWidth}×{r.artworkHeight}px
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* TRACKS */}
              <section className={card}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">3. Tracks</h2>
                  <span className="text-xs text-gray-500">{r.tracks.length} track{r.tracks.length === 1 ? "" : "s"}</span>
                </div>
                <ol className="space-y-4">
                  {r.tracks.map((t, i) => (
                    <li key={i} className="rounded-xl border border-gray-200 dark:border-zinc-800 p-4">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-bold text-gray-900 dark:text-white">Track {i + 1}</span>
                        <div className="flex gap-1">
                          <button type="button" onClick={() => moveTrack(i, -1)} disabled={i === 0} aria-label={`Move track ${i + 1} up`} className="px-2 py-1 rounded-lg text-sm border border-gray-200 dark:border-zinc-700 disabled:opacity-30">↑</button>
                          <button type="button" onClick={() => moveTrack(i, 1)} disabled={i === r.tracks.length - 1} aria-label={`Move track ${i + 1} down`} className="px-2 py-1 rounded-lg text-sm border border-gray-200 dark:border-zinc-700 disabled:opacity-30">↓</button>
                          <button
                            type="button"
                            onClick={() => {
                              setR((p) => (p ? { ...p, tracks: p.tracks.filter((_, j) => j !== i) } : p));
                              setDirty(true);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold text-red-700 dark:text-red-400 border border-gray-200 dark:border-zinc-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <span className={label}>Audio file * (WAV or FLAC preferred, under 50 MB)</span>
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-block cursor-pointer px-3.5 py-2 rounded-lg text-sm font-bold border border-emerald-600 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20">
                              {busy === `audio-${i}` ? "Uploading…" : t.audioPath ? "Replace audio" : "Upload audio"}
                              <input type="file" accept=".wav,.flac,.aiff,.aif,.mp3,audio/*" className="sr-only" onChange={(e) => onAudio(i, e.target.files?.[0])} disabled={busy !== ""} />
                            </label>
                            <span className="text-xs text-gray-500 truncate max-w-full">{t.audioName ?? "No file yet"}</span>
                          </div>
                        </div>
                        <div>
                          <label htmlFor={`t-title-${i}`} className={label}>Track title *</label>
                          <input id={`t-title-${i}`} value={t.title} onChange={(e) => setTrack(i, { title: e.target.value })} maxLength={200} className={input} />
                        </div>
                        <div>
                          <label htmlFor={`t-version-${i}`} className={label}>Version</label>
                          <input id={`t-version-${i}`} value={t.version ?? ""} onChange={(e) => setTrack(i, { version: e.target.value || null })} placeholder="e.g. Extended Mix" maxLength={100} className={input} />
                        </div>
                        <div>
                          <label htmlFor={`t-feat-${i}`} className={label}>Featured artists</label>
                          <input id={`t-feat-${i}`} value={t.featuredArtists ?? ""} onChange={(e) => setTrack(i, { featuredArtists: e.target.value || null })} placeholder="Comma separated" maxLength={300} className={input} />
                        </div>
                        <div>
                          <label htmlFor={`t-comp-${i}`} className={label}>Composers / songwriters *</label>
                          <input id={`t-comp-${i}`} value={t.composers ?? ""} onChange={(e) => setTrack(i, { composers: e.target.value || null })} placeholder="Real full names" maxLength={300} className={input} />
                        </div>
                        <div>
                          <label htmlFor={`t-prod-${i}`} className={label}>Producers</label>
                          <input id={`t-prod-${i}`} value={t.producers ?? ""} onChange={(e) => setTrack(i, { producers: e.target.value || null })} maxLength={300} className={input} />
                        </div>
                        <div>
                          <label htmlFor={`t-isrc-${i}`} className={label}>ISRC</label>
                          <input id={`t-isrc-${i}`} value={t.isrc ?? ""} onChange={(e) => setTrack(i, { isrc: e.target.value.toUpperCase().replace(/[-\s]/g, "") || null })} placeholder="Leave empty to get one" maxLength={15} className={input} />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <input type="checkbox" checked={t.explicit} onChange={(e) => setTrack(i, { explicit: e.target.checked })} className="w-4 h-4 accent-emerald-600" />
                          Explicit
                        </label>
                      </div>
                    </li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => {
                    const last = r.tracks[r.tracks.length - 1];
                    set("tracks", [...r.tracks, emptyTrack(last?.composers ?? "", last?.producers ?? "")]);
                  }}
                  disabled={r.tracks.length >= 100}
                  className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-zinc-700 text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-emerald-500"
                >
                  + Add a track
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  Collaborating? Set up who gets what with a{" "}
                  <Link href="/splits/new" className="underline">split sheet</Link> before release.
                </p>
              </section>

              {/* DATE & CODES */}
              <section className={card}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">4. Release date and codes</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="date" className={label}>Release date *</label>
                    <input id="date" type="date" value={r.releaseDate ?? ""} onChange={(e) => set("releaseDate", e.target.value || null)} className={input} />
                    <p className="text-xs text-gray-500 mt-1">4+ weeks away gives you time to pitch to playlists.</p>
                  </div>
                  <div>
                    <label htmlFor="upc" className={label}>UPC / barcode</label>
                    <input id="upc" inputMode="numeric" value={r.upc ?? ""} onChange={(e) => set("upc", e.target.value.replace(/\D/g, "") || null)} placeholder="Leave empty to get one" maxLength={13} className={input} />
                  </div>
                </div>
              </section>

              {/* RIGHTS */}
              <section className={card}>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">5. Rights</h2>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={r.rightsConfirmed} onChange={(e) => set("rightsConfirmed", e.target.checked)} className="mt-0.5 w-5 h-5 accent-emerald-600 flex-none" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    I own or control the rights to these recordings, the songs and the cover art, or I have written permission from everyone involved.
                    The release has no uncleared samples and isn&apos;t already distributed exclusively elsewhere.
                  </span>
                </label>
              </section>
            </fieldset>
          </div>

          {/* SIDEBAR: status, checks, save */}
          <aside className="lg:sticky lg:top-20 space-y-4">
            <div className={card}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-bold text-gray-900 dark:text-white">Store checks</h2>
                <span className="text-xs font-bold text-gray-500">
                  {passed}/{checks.length} passed
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-zinc-800 mt-3 overflow-hidden">
                <div className="h-full bg-emerald-600 transition-all" style={{ width: `${checks.length ? (passed / checks.length) * 100 : 0}%` }} />
              </div>
              <p className={`mt-3 text-sm font-semibold ${ready ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                {ready ? "✓ Ready for delivery" : `${errors.length} thing${errors.length === 1 ? "" : "s"} to fix before delivery`}
              </p>
              <ul className="mt-3 space-y-2 max-h-[45vh] overflow-y-auto pr-1">
                {[...errors, ...warnings, ...checks.filter((c) => c.ok)].map((c) => (
                  <li key={c.id} className="flex gap-2 text-xs">
                    <span
                      aria-hidden="true"
                      className={`flex-none w-4 text-center font-bold ${c.ok ? "text-emerald-600" : c.level === "error" ? "text-red-600" : "text-amber-600"}`}
                    >
                      {c.ok ? "✓" : c.level === "error" ? "✕" : "!"}
                    </span>
                    <span className={c.ok ? "text-gray-500" : "text-gray-800 dark:text-gray-200"}>
                      <span className="sr-only">{c.ok ? "Passed: " : c.level === "error" ? "To fix: " : "Advice: "}</span>
                      {c.label}
                      {c.fix && <span className="block text-gray-500 mt-0.5">{c.fix}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={card}>
              {msg && (
                <p role={msg.kind === "error" ? "alert" : "status"} className={`mb-3 rounded-lg p-3 text-sm ${msg.kind === "error" ? "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300"}`}>
                  {msg.text}
                </p>
              )}
              {editable && (
                <button type="button" onClick={save} disabled={saving || busy !== ""} className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60">
                  {saving ? "Saving…" : dirty ? "Save changes" : "Saved"}
                </button>
              )}
              <button
                type="button"
                disabled
                title="Delivery to stores opens soon"
                className="mt-2 w-full py-3 rounded-xl font-bold border border-gray-300 dark:border-zinc-700 text-gray-500 cursor-not-allowed"
              >
                Deliver to stores · opens soon
              </button>
              <label className="mt-4 flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => {
                    setNotify(e.target.checked);
                    setDirty(true);
                  }}
                  className="mt-0.5 w-4 h-4 accent-emerald-600"
                />
                Email me when delivery opens so I can send this release
              </label>
              {editable && (
                <button type="button" onClick={remove} className="mt-4 text-xs font-semibold text-red-700 dark:text-red-400 hover:underline">
                  Delete release
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
