"use client";

import { useRef, useState } from "react";

const MAX_BYTES = 4 * 1024 * 1024;

export default function AvatarUploader({
  artistSlug,
  initialUrl,
  label = "Avatar",
  fallbackInitials,
}: {
  artistSlug: string;
  initialUrl: string | null;
  label?: string;
  fallbackInitials: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function pickFile() {
    inputRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) { setError("Max 4 MB"); return; }
    if (!file.type.startsWith("image/")) { setError("Only images"); return; }

    setError(null);
    setBusy(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("kind", label.toLowerCase() === "cover" ? "cover" : "avatar");

      const res = await fetch("/api/artist/" + artistSlug + "/upload", {
        method: "POST",
        body: fd,
      });

      if (res.status === 401) {
        window.location.href = "/login?next=/artist/" + artistSlug + "/edit";
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isAvatar = label.toLowerCase() !== "cover";

  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={pickFile}
          disabled={busy}
          className={
            (isAvatar
              ? "relative h-20 w-20 rounded-full "
              : "relative h-32 w-full max-w-md rounded-2xl ") +
            "overflow-hidden bg-gray-200 hover:opacity-90 disabled:opacity-60"
          }
          aria-label={isAvatar ? "Change avatar" : "Change cover"}
        >
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span
              className={
                (isAvatar
                  ? "grid h-full w-full place-items-center rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-lg font-bold text-white"
                  : "grid h-full w-full place-items-center text-xs text-gray-500")
              }
            >
              {isAvatar ? fallbackInitials : "Click to upload"}
            </span>
          )}
        </button>

        <div className="text-xs">
          <button
            type="button"
            onClick={pickFile}
            disabled={busy}
            className="rounded-full border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            {busy ? "Uploading..." : url ? "Replace" : "Upload"}
          </button>
          <p className="mt-2 text-gray-500">JPG, PNG, WebP · max 4 MB</p>
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}