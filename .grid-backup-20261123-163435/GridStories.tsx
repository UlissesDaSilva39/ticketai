"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadMedia, validateFile, kindOf } from "./media";

type ItemKind = "image" | "video" | "text";

interface StoryItem {
  id: string;
  kind: ItemKind;
  url?: string;
  caption?: string;
  bg?: string;
  createdAt: number;
}

interface Story {
  id: string;
  name: string;
  initials: string;
  items: StoryItem[];
}

const DAY = 24 * 60 * 60 * 1000;
const IMAGE_MS = 5000;
const hoursAgo = (h: number) => Date.now() - h * 60 * 60 * 1000;

const SEED: Story[] = [
  { id: "me", name: "Your story", initials: "U", items: [] },
  {
    id: "sarah",
    name: "Sarah Jenkins",
    initials: "SJ",
    items: [
      { id: "s1", kind: "text", caption: "Looking for a House producer to collab on a new track", bg: "#0f6e56", createdAt: hoursAgo(2) },
      { id: "s2", kind: "text", caption: "Studio session tonight", bg: "#534ab7", createdAt: hoursAgo(1) },
    ],
  },
  {
    id: "david",
    name: "David Chen",
    initials: "DC",
    items: [{ id: "d1", kind: "text", caption: "New set live Friday at 11pm", bg: "#993c1d", createdAt: hoursAgo(5) }],
  },
  {
    id: "alex",
    name: "Alex Rivera",
    initials: "AR",
    items: [{ id: "a1", kind: "text", caption: "Techno remix swap is open", bg: "#185fa5", createdAt: hoursAgo(9) }],
  },
  {
    id: "studiox",
    name: "Studio X",
    initials: "SX",
    items: [{ id: "x1", kind: "text", caption: "Two mixing slots left this week", bg: "#854f0b", createdAt: hoursAgo(14) }],
  },
];

function live(s: Story): Story {
  return { ...s, items: s.items.filter((i) => Date.now() - i.createdAt < DAY) };
}

export default function GridStories() {
  const [stories, setStories] = useState<Story[]>(SEED);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [viewer, setViewer] = useState<{ s: number; i: number } | null>(null);
  const [draft, setDraft] = useState<{ file: File; url: string; kind: "image" | "video" } | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const visible = stories.map(live).filter((s) => s.id === "me" || s.items.length > 0);

  async function onPick(file?: File) {
    if (!file) return;
    setError(null);
    const problem = await validateFile(file);
    if (problem) {
      setError(problem);
      return;
    }
    if (draft) URL.revokeObjectURL(draft.url);
    setDraft({ file, url: URL.createObjectURL(file), kind: kindOf(file) as "image" | "video" });
    setCaption("");
  }

  function closeDraft() {
    if (draft) URL.revokeObjectURL(draft.url);
    setDraft(null);
    setError(null);
  }

  async function share() {
    if (!draft) return;
    setBusy(true);
    try {
      const up = await uploadMedia(draft.file);
      const item: StoryItem = {
        id: crypto.randomUUID(),
        kind: up.kind,
        url: up.url,
        caption: caption.trim() || undefined,
        createdAt: Date.now(),
      };
      setStories((cur) => cur.map((s) => (s.id === "me" ? { ...s, items: [...s.items, item] } : s)));
      setDraft(null);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function openStory(index: number) {
    const s = visible[index];
    if (s.id === "me" && s.items.length === 0) {
      fileRef.current?.click();
      return;
    }
    setViewer({ s: index, i: 0 });
  }

  return (
    <section
      aria-label="Stories"
      className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">Stories</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">Visible for 24 hours</span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visible.map((s, idx) => {
          const isMe = s.id === "me";
          const hasItems = s.items.length > 0;
          const ring = !hasItems
            ? "border-dashed border-gray-300 dark:border-zinc-600"
            : seen.has(s.id)
              ? "border-gray-300 dark:border-zinc-600"
              : "border-emerald-500";
          return (
            <div key={s.id} className="relative flex min-w-[64px] flex-col items-center gap-1">
              <button
                type="button"
                onClick={() => openStory(idx)}
                aria-label={isMe && !hasItems ? "Add to your story" : "View " + s.name}
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <span className={"flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 " + ring}>
                  <span
                    className={
                      "flex h-12 w-12 items-center justify-center rounded-full text-[13px] font-bold " +
                      (isMe
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200")
                    }
                  >
                    {s.initials}
                  </span>
                </span>
              </button>
              {isMe && (
                <button
                  type="button"
                  aria-label="Add a photo or video story"
                  onClick={() => fileRef.current?.click()}
                  className="absolute right-1 top-[38px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-xs leading-none text-white hover:bg-emerald-700 dark:border-zinc-900"
                >
                  +
                </button>
              )}
              <span className="max-w-[64px] truncate text-[11px] text-gray-600 dark:text-gray-400">{s.name}</span>
            </div>
          );
        })}
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*,video/*"
        onChange={(e) => {
          void onPick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && !draft && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}

      {draft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Create story"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 text-gray-900 dark:bg-zinc-900 dark:text-gray-100">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-base">New story</strong>
              <button
                type="button"
                onClick={closeDraft}
                aria-label="Close"
                className="text-2xl leading-none text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mb-3 flex max-h-[380px] items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
              {draft.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.url} alt="Story preview" className="max-h-[380px] max-w-full object-contain" />
              ) : (
                <video src={draft.url} controls playsInline muted className="max-h-[380px] max-w-full object-contain" />
              )}
            </div>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={140}
              placeholder="Add a caption"
              className="mb-3 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
            {error && (
              <p role="alert" className="mb-2 text-xs text-red-600">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => fileRef.current?.click()}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Change
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={share}
                className="flex-[2] rounded-lg bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy ? "Sharing..." : "Share story"}
              </button>
            </div>
            <p className="mt-2.5 text-xs text-gray-500">Visible for 24 hours.</p>
          </div>
        </div>
      )}

      {viewer && (
        <Viewer
          list={visible}
          start={viewer}
          onSeen={(id) => setSeen((p) => (p.has(id) ? p : new Set(p).add(id)))}
          onClose={() => setViewer(null)}
        />
      )}
    </section>
  );
}

function Viewer({
  list,
  start,
  onSeen,
  onClose,
}: {
  list: Story[];
  start: { s: number; i: number };
  onSeen: (id: string) => void;
  onClose: () => void;
}) {
  const [pos, setPos] = useState(start);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const story = list[pos.s];
  const item = story?.items[pos.i];

  const next = useCallback(() => {
    setProgress(0);
    setPos((p) => {
      if (p.i < list[p.s].items.length - 1) return { s: p.s, i: p.i + 1 };
      let n = p.s + 1;
      while (n < list.length && list[n].items.length === 0) n++;
      if (n < list.length) return { s: n, i: 0 };
      queueMicrotask(onClose);
      return p;
    });
  }, [list, onClose]);

  const prev = useCallback(() => {
    setProgress(0);
    setPos((p) => {
      if (p.i > 0) return { s: p.s, i: p.i - 1 };
      let n = p.s - 1;
      while (n >= 0 && list[n].items.length === 0) n--;
      if (n >= 0) return { s: n, i: list[n].items.length - 1 };
      return p;
    });
  }, [list]);

  const storyId = story?.id;
  useEffect(() => {
    if (storyId) onSeen(storyId);
  }, [storyId, onSeen]);

  useEffect(() => {
    if (!item || item.kind === "video" || paused) return;
    const t = setInterval(() => {
      setProgress((p) => {
        const v = p + 50 / IMAGE_MS;
        if (v >= 1) {
          queueMicrotask(next);
          return 1;
        }
        return v;
      });
    }, 50);
    return () => clearInterval(t);
  }, [item, paused, next]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) v.pause();
    else void v.play().catch(() => undefined);
  }, [paused, item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  if (!item) return null;
  const age = Math.max(1, Math.round((Date.now() - item.createdAt) / 3600000));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={story.name + "'s story"}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4"
    >
      <div className="relative flex h-[min(88vh,680px)] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-neutral-900 text-white">
        <div className="flex gap-1 px-3 pt-2.5">
          {story.items.map((it, idx) => (
            <span key={it.id} className="h-[3px] flex-1 overflow-hidden rounded bg-white/35">
              <span
                className="block h-full bg-white"
                style={{ width: idx < pos.i ? "100%" : idx === pos.i ? progress * 100 + "%" : "0%" }}
              />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold">
            {story.initials}
          </span>
          <span className="text-[13px] font-semibold">{story.name}</span>
          <span className="text-xs text-white/65">{age}h</span>
          <span className="flex-1" />
          <button type="button" onClick={onClose} aria-label="Close story" className="text-2xl leading-none text-white">
            &times;
          </button>
        </div>
        <div
          className="relative flex flex-1 items-center justify-center bg-neutral-800"
          style={item.kind === "text" ? { background: item.bg } : undefined}
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          {item.kind === "image" && item.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="" className="h-full w-full object-contain" />
          )}
          {item.kind === "video" && item.url && (
            <video
              key={item.id}
              ref={videoRef}
              src={item.url}
              autoPlay
              playsInline
              className="h-full w-full object-contain"
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress(v.currentTime / v.duration);
              }}
              onEnded={next}
            />
          )}
          {item.kind === "text" && (
            <p className="m-0 p-7 text-center text-[22px] font-semibold leading-tight">{item.caption}</p>
          )}
          <button type="button" onClick={prev} aria-label="Previous" className="absolute inset-y-0 left-0 w-[35%]" />
          <button type="button" onClick={next} aria-label="Next" className="absolute inset-y-0 right-0 w-[35%]" />
        </div>
        {item.kind !== "text" && item.caption && (
          <p className="m-0 bg-neutral-900 px-3.5 pb-4 pt-3 text-sm">{item.caption}</p>
        )}
      </div>
    </div>
  );
}