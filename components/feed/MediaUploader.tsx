"use client";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Kind = "image" | "video" | "audio";
const ACCEPT: Record<Kind, string> = { image: "image/*", video: "video/*", audio: "audio/*" };
const MAX_MB = 50;

export default function MediaUploader({
  kind, userId, value, onChange,
}: {
  kind: Kind; userId: string; value: string | null;
  onChange: (url: string | null) => void; label: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_MB * 1024 * 1024) { setError(`Max ${MAX_MB} MB`); return; }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "bin";
      const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("post-media")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("post-media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const clear = () => { onChange(null); if (inputRef.current) inputRef.current.value = ""; };
  const emoji = kind === "image" ? "📷" : kind === "video" ? "🎬" : "🎵";
  const shortLabel = kind === "image" ? "Photo" : kind === "video" ? "Video" : "Audio";

  return (
    <div className="inline-flex items-center gap-2">
      <input ref={inputRef} type="file" accept={ACCEPT[kind]} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          value ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
        } ${uploading ? "opacity-50" : ""}`}>
        <span aria-hidden="true">{emoji}</span>
        <span>{uploading ? "Uploading…" : value ? `${shortLabel} ✓` : shortLabel}</span>
        {value ? (
          <span role="button" tabIndex={0}
            onClick={(e) => { e.stopPropagation(); clear(); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); clear(); } }}
            className="ml-1 text-green-800 hover:text-red-600"
            aria-label="Remove attachment">✕</span>
        ) : null}
      </button>
      {error ? <span className="text-xs text-red-600" role="alert">{error}</span> : null}
    </div>
  );
}
