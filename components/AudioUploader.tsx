"use client";

import { useState, useRef } from "react";

export default function AudioUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const remove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
  };

  const togglePlay = () => {
    if (!value) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(value);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
        onChange={handleFile}
        className="hidden"
      />
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-black transition-colors text-center"
        >
          <p className="text-sm font-medium">
            {uploading ? "Uploading..." : "Upload an MP3 preview"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            MP3, WAV, or OGG · Max 50MB
          </p>
        </button>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <button
            type="button"
            onClick={togglePlay}
            className={"w-10 h-10 rounded-full flex items-center justify-center " + (playing ? "bg-[#00FF87] text-black" : "bg-black text-white")}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Preview uploaded</p>
            <p className="text-xs text-gray-500 truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={remove}
            className="px-3 py-1.5 border border-gray-300 text-xs rounded-full hover:border-black"
          >
            Remove
          </button>
        </div>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
