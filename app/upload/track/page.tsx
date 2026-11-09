"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadTrackPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) { setError("Please choose an audio file"); return; }
    if (!title.trim()) { setError("Title is required"); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title.trim());
      fd.append("genre", genre.trim());
      fd.append("bpm", bpm.trim());

      const res = await fetch("/api/artist-tracks", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed (" + res.status + ")");
      }
      setSuccess(true);
      setTimeout(() => router.push("/messages"), 1500);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Track uploaded</h1>
        <p className="text-gray-600">Redirecting to your messages…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-4xl font-bold mb-2">Upload Track</h1>
      <p className="text-gray-500 mb-8">Publish a new track to your GRID profile.</p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2">Audio file</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm border rounded-xl px-4 py-3"
          />
          {file && (
            <p className="text-xs text-gray-500 mt-2">
              {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-xl px-4 py-3"
            placeholder="Midnight Drive"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Genre</label>
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Tech House"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">BPM</label>
            <input
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="128"
              inputMode="numeric"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full rounded-full bg-black text-white py-4 font-medium disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </form>
    </main>
  );
}