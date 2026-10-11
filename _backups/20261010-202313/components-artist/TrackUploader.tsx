"use client";

import { useEffect, useState } from "react";

type Track = {
  id: string;
  title: string;
  duration_seconds: number | null;
  audio_url: string;
  play_count: number;
};

export default function TrackUploader() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch("/api/artist-tracks?artistId=self");
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch {}
  };

  useEffect(() => {
    fetch("/api/artist-tracks?artistId=self")
      .then((r) => r.json())
      .then((d) => setTracks(d.tracks || []))
      .catch(() => {});
  }, []);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/track", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setAudioUrl(data.url);
      } else {
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!title.trim() || !audioUrl) return;
    setUploading(true);
    try {
      await fetch("/api/artist-tracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), audio_url: audioUrl }),
      });
      setTitle("");
      setAudioUrl(null);
      await load();
    } catch {}
    setUploading(false);
  };

  const remove = async (id: string) => {
    await fetch("/api/artist-tracks?id=" + id, { method: "DELETE" });
    await load();
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        Tracks
      </p>

      {tracks.length > 0 ? (
        <ul className="space-y-2">
          {tracks.map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <span className="flex-1 truncate">{t.title}</span>
              <span className="text-xs text-gray-400">{t.play_count} plays</span>
              <button
                onClick={() => remove(t.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-500">No tracks yet.</p>
      )}

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Track title"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm outline-none focus:border-black"
        />
        <div className="flex items-center gap-2">
          <label className="px-4 py-2 border border-gray-300 text-xs rounded-full cursor-pointer hover:bg-gray-50">
            {uploading ? "Uploading..." : audioUrl ? "Audio ready" : "Choose audio"}
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) upload(f);
              }}
            />
          </label>
          <button
            type="button"
            onClick={save}
            disabled={!title.trim() || !audioUrl || uploading}
            className="px-4 py-2 bg-black text-white text-xs rounded-full disabled:opacity-50"
          >
            Add track
          </button>
        </div>
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
      </div>
    </div>
  );
}