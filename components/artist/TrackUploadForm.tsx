"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const KINDS = ["song", "album", "playlist", "set", "remix"] as const;
type Kind = (typeof KINDS)[number];

export default function TrackUploadForm({
  profileId,
  defaultArtistName,
}: {
  profileId: string;
  defaultArtistName: string;
}) {
  const router = useRouter();
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("song");
  const [artistName, setArtistName] = useState(defaultArtistName);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAudio = (file: File) => {
    setError(null);
    if (file.size > 50 * 1024 * 1024) { setError("Audio must be under 50 MB"); return; }
    setAudioFile(file);
    const url = URL.createObjectURL(file);
    const a = document.createElement("audio");
    a.preload = "metadata";
    a.src = url;
    a.onloadedmetadata = () => { setDuration(Math.round(a.duration)); URL.revokeObjectURL(url); };
    a.onerror = () => URL.revokeObjectURL(url);
  };

  const onCover = (file: File) => {
    setError(null);
    if (file.size > 10 * 1024 * 1024) { setError("Cover must be under 10 MB"); return; }
    setCoverFile(file);
  };

  const upload = async (file: File, prefix: string) => {
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "bin";
    const path = `${profileId}/${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("post-media")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (upErr) throw upErr;
    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const submit = async () => {
    setError(null);
    if (!title.trim()) { setError("Title is required"); return; }
    if (!audioFile) { setError("Pick an audio file"); return; }
    setBusy(true);
    try {
      const audioUrl = await upload(audioFile, "track-audio");
      let coverUrl: string | null = null;
      if (coverFile) coverUrl = await upload(coverFile, "track-cover");

      const supabase = createClient();
      const { error: insErr } = await supabase.from("tracks").insert({
        artist_id: profileId,
        title: title.trim(),
        artist_name: artistName.trim() || defaultArtistName,
        kind,
        audio_url: audioUrl,
        cover_url: coverUrl,
        duration_seconds: duration,
        play_count: 0,
      });
      if (insErr) throw insErr;

      router.refresh();
      setTitle("");
      setKind("song");
      setAudioFile(null);
      setCoverFile(null);
      setDuration(null);
      if (audioInputRef.current) audioInputRef.current.value = "";
      if (coverInputRef.current) coverInputRef.current.value = "";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-antonio)" }}>
        Upload a track
      </h3>
      <div className="grid gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Track title"
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            placeholder="Artist name"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black"
          />
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-black bg-white"
          >
            {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <input ref={audioInputRef} type="file" accept="audio/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onAudio(f); }} />
          <button type="button" onClick={() => audioInputRef.current?.click()}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              audioFile ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}>
            Audio: {audioFile ? `ready${duration ? " (" + duration + "s)" : ""}` : "choose"}
          </button>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onCover(f); }} />
          <button type="button" onClick={() => coverInputRef.current?.click()}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              coverFile ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}>
            Cover: {coverFile ? "ready" : "choose"}
          </button>
        </div>
        {error ? <p className="text-xs text-red-600" role="alert">{error}</p> : null}
        <button type="button" onClick={submit} disabled={busy}
          className="rounded-full bg-black text-white text-sm font-semibold px-5 py-2 hover:bg-gray-800 disabled:opacity-50">
          {busy ? "Uploading..." : "Publish track"}
        </button>
      </div>
    </div>
  );
}

