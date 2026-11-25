"use client";

import { useEffect, useRef, useState } from "react";
import { kindOf, uploadMedia, validateFile, type MediaKind, type UploadedMedia } from "./media";

interface Pending {
  id: string;
  file: File;
  kind: MediaKind;
  previewUrl: string;
}

interface Post {
  id: string;
  text: string;
  media: UploadedMedia[];
}

const MAX_FILES = 4;

function fmt(sec?: number) {
  if (!sec) return "";
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

export default function GridComposer({ userInitial = "U", userName = "Ulisses Silva" }: { userInitial?: string; userName?: string }) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  useEffect(() => () => pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  async function addFiles(files: FileList) {
    setError(null);
    const added: Pending[] = [];
    for (const file of Array.from(files)) {
      if (pendingRef.current.length + added.length >= MAX_FILES) {
        setError("You can attach up to " + MAX_FILES + " files.");
        break;
      }
      const problem = await validateFile(file);
      if (problem) {
        setError(problem);
        continue;
      }
      added.push({ id: crypto.randomUUID(), file, kind: kindOf(file) as MediaKind, previewUrl: URL.createObjectURL(file) });
    }
    if (added.length) setPending((prev) => [...prev, ...added]);
  }

  function remove(id: string) {
    setPending((prev) => {
      const hit = prev.find((p) => p.id === id);
      if (hit) URL.revokeObjectURL(hit.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
    setError(null);
  }

  const canPublish = (text.trim().length > 0 || pending.length > 0) && !busy;

  async function publish() {
    if (!canPublish) return;
    setBusy(true);
    setError(null);
    try {
      const media = await Promise.all(pending.map((p) => uploadMedia(p.file)));
      setPosts((cur) => [{ id: crypto.randomUUID(), text: text.trim(), media }, ...cur]);
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPending([]);
      setText("");
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const toolBtn =
    "text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-md flex items-center gap-2 transition-colors";

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white grid place-items-center font-bold flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Share a track, an event, or an update..."
              className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {pending.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pending.map((p) => (
                  <div
                    key={p.id}
                    className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800"
                  >
                    {p.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.previewUrl} alt={p.file.name} className="h-full w-full object-cover" />
                    ) : (
                      <video src={p.previewUrl} muted playsInline className="h-full w-full object-cover" />
                    )}
                    {p.kind === "video" && (
                      <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 text-[10px] font-semibold text-white">
                        VIDEO
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      aria-label={"Remove " + p.file.name}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/65 text-sm leading-none text-white hover:bg-black/85"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <p role="alert" className="mt-2 text-xs text-red-600">
                {error}
              </p>
            )}

            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2 flex-wrap">
                <button type="button" className={toolBtn} onClick={() => fileRef.current?.click()}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4-4a3 3 0 014 0l4 4m-2-2l1-1a3 3 0 014 0l2 2M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 2.5h.01" />
                  </svg>{" "}
                  Photo / video
                </button>
                <button type="button" className={toolBtn}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>{" "}
                  Audio
                </button>
                <button type="button" className={toolBtn}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>{" "}
                  Event
                </button>
              </div>
              <button
                type="button"
                disabled={!canPublish}
                onClick={publish}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-6 py-2 rounded-md transition-colors"
              >
                {busy ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          hidden
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            if (e.target.files?.length) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white grid place-items-center font-bold flex-shrink-0 text-lg">
              {userInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-base">{userName}</p>
              <p className="text-xs text-gray-500">Just now</p>
              {post.text && <p className="text-[15px] text-gray-800 dark:text-gray-200 mt-3">{post.text}</p>}
              {post.media.length > 0 && (
                <div className={"mt-3 grid gap-1 overflow-hidden rounded-xl " + (post.media.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                  {post.media.map((m) =>
                    m.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={m.id}
                        src={m.url}
                        alt={m.name}
                        className={"w-full object-cover bg-black " + (post.media.length === 1 ? "max-h-[480px]" : "aspect-square")}
                      />
                    ) : (
                      <div key={m.id} className="relative">
                        <video
                          src={m.url}
                          controls
                          playsInline
                          preload="metadata"
                          className={"w-full object-cover bg-black " + (post.media.length === 1 ? "max-h-[480px]" : "aspect-square")}
                        />
                        {fmt(m.duration) && (
                          <span className="pointer-events-none absolute left-2 top-2 rounded bg-black/65 px-1.5 text-[10px] font-semibold text-white">
                            {fmt(m.duration)}
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}