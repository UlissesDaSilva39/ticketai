"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { uploadMedia, validateFile, kindOf } from "./media";

// Stories are stored in Supabase (tables: stories, story_views) and expire after 24 hours.

interface StoryItem {
  id: string;
  kind: "image" | "video";
  url: string;
  caption: string | null;
  createdAt: number;
  seen: boolean;
}

interface Story {
  authorId: string;
  name: string;
  username: string | null;
  avatar: string | null;
  isMe: boolean;
  items: StoryItem[];
}

const IMAGE_MS = 5000;

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase() || "U";
}

function Avatar({ story, size, myName }: { story: Story; size: "lg" | "sm"; myName?: string }) {
  const cls = size === "lg" ? "h-12 w-12 text-[13px]" : "h-[30px] w-[30px] text-[11px]";
  const label = story.isMe && myName ? myName : story.name;
  if (story.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={story.avatar} alt="" className={`${cls} rounded-full object-cover`} />;
  }
  return (
    <span
      className={
        `flex ${cls} items-center justify-center rounded-full font-bold ` +
        (story.isMe ? "bg-emerald-600 text-white" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200")
      }
    >
      {initialsOf(label)}
    </span>
  );
}

export default function GridStories({ myName, myAvatar }: { myName?: string; myAvatar?: string | null }) {
  const [stories, setStories] = useState<Story[] | null>(null);
  const [viewer, setViewer] = useState<{ s: number; i: number } | null>(null);
  const [draft, setDraft] = useState<{ file: File; url: string; kind: "image" | "video" } | null>(null);
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/stories", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { groups: [] }))
      .then((d) => setStories((d.groups ?? []) as Story[]))
      .catch(() => setStories([]));
  }, []);

  // Keep my own avatar in sync with the profile shown elsewhere on the page.
  const visible = (stories ?? []).map((s) => (s.isMe && myAvatar && !s.avatar ? { ...s, avatar: myAvatar } : s));

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
    setError(null);
    try {
      const up = await uploadMedia(draft.file);
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mediaUrl: up.url, mediaType: up.kind, caption: caption.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.item) throw new Error(d.error || "Could not share your story.");
      setStories((cur) => (cur ?? []).map((s) => (s.isMe ? { ...s, items: [...s.items, d.item as StoryItem] } : s)));
      URL.revokeObjectURL(draft.url);
      setDraft(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function openStory(index: number) {
    const s = visible[index];
    if (s.isMe && s.items.length === 0) {
      fileRef.current?.click();
      return;
    }
    // Start at the first unseen item.
    const firstUnseen = s.items.findIndex((i) => !i.seen);
    setViewer({ s: index, i: firstUnseen >= 0 ? firstUnseen : 0 });
  }

  const markSeen = useCallback((itemId: string) => {
    setStories((cur) => {
      if (!cur) return cur;
      let changed = false;
      const next = cur.map((s) => ({
        ...s,
        items: s.items.map((i) => {
          if (i.id !== itemId || i.seen) return i;
          changed = true;
          return { ...i, seen: true };
        }),
      }));
      if (changed) void fetch(`/api/stories/${itemId}`, { method: "POST", credentials: "include" }).catch(() => undefined);
      return changed ? next : cur;
    });
  }, []);

  async function deleteItem(itemId: string) {
    const res = await fetch(`/api/stories/${itemId}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) return false;
    setStories((cur) => (cur ?? []).map((s) => (s.isMe ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s)));
    return true;
  }

  return (
    <section aria-label="Stories" className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white">Stories</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">Visible for 24 hours</span>
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stories === null
          ? [0, 1, 2].map((i) => (
              <div key={i} className="flex min-w-[64px] flex-col items-center gap-1 animate-pulse">
                <span className="h-[58px] w-[58px] rounded-full bg-gray-200 dark:bg-zinc-800" />
                <span className="h-2.5 w-12 rounded bg-gray-100 dark:bg-zinc-800" />
              </div>
            ))
          : visible.map((s, idx) => {
              const hasItems = s.items.length > 0;
              const unseen = s.items.some((i) => !i.seen);
              const ring = !hasItems
                ? "border-dashed border-gray-300 dark:border-zinc-600"
                : unseen && !s.isMe
                  ? "border-emerald-500"
                  : s.isMe
                    ? "border-emerald-500"
                    : "border-gray-300 dark:border-zinc-600";
              return (
                <div key={s.authorId} className="relative flex min-w-[64px] flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openStory(idx)}
                    aria-label={s.isMe && !hasItems ? "Add to your story" : "View " + s.name}
                    className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  >
                    <span className={"flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 " + ring}>
                      <Avatar story={s} size="lg" myName={myName} />
                    </span>
                  </button>
                  {s.isMe && (
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
        {stories !== null && visible.length <= 1 && (
          <p className="self-center text-xs text-gray-500 dark:text-gray-400 pl-1">
            No stories from others yet. Share the first one!
          </p>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
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
        <div role="dialog" aria-modal="true" aria-label="Create story" className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 text-gray-900 dark:bg-zinc-900 dark:text-gray-100">
            <div className="mb-3 flex items-center justify-between">
              <strong className="text-base">New story</strong>
              <button type="button" onClick={closeDraft} aria-label="Close" className="text-2xl leading-none text-gray-500 hover:text-gray-700">
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
              aria-label="Caption"
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
            <p className="mt-2.5 text-xs text-gray-500">Visible to GRID members for 24 hours.</p>
          </div>
        </div>
      )}

      {viewer && (
        <Viewer list={visible} start={viewer} myName={myName} onSeen={markSeen} onDelete={deleteItem} onClose={() => setViewer(null)} />
      )}
    </section>
  );
}

function Viewer({
  list,
  start,
  myName,
  onSeen,
  onDelete,
  onClose,
}: {
  list: Story[];
  start: { s: number; i: number };
  myName?: string;
  onSeen: (itemId: string) => void;
  onDelete: (itemId: string) => Promise<boolean>;
  onClose: () => void;
}) {
  const [pos, setPos] = useState(start);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const story = list[pos.s];
  const item = story?.items[Math.min(pos.i, (story?.items.length ?? 1) - 1)];

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

  const itemId = item?.id;
  useEffect(() => {
    if (itemId) onSeen(itemId);
  }, [itemId, onSeen]);

  // Close if the current story has no items left (e.g. after deleting the last one).
  useEffect(() => {
    if (!item) onClose();
  }, [item, onClose]);

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

  async function remove() {
    if (!item || deleting) return;
    if (!window.confirm("Delete this story? This can't be undone.")) return;
    setDeleting(true);
    setPaused(true);
    const ok = await onDelete(item.id);
    setDeleting(false);
    setPaused(false);
    setProgress(0);
    if (ok) setPos((p) => ({ s: p.s, i: Math.max(0, p.i - (p.i >= story.items.length - 1 ? 1 : 0)) }));
  }

  if (!item) return null;
  const mins = Math.max(1, Math.round((Date.now() - item.createdAt) / 60000));
  const age = mins < 60 ? `${mins}m` : `${Math.round(mins / 60)}h`;

  return (
    <div role="dialog" aria-modal="true" aria-label={story.name + "'s story"} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-4">
      <div className="relative flex h-[min(88vh,680px)] w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-neutral-900 text-white">
        <div className="flex gap-1 px-3 pt-2.5">
          {story.items.map((it, idx) => (
            <span key={it.id} className="h-[3px] flex-1 overflow-hidden rounded bg-white/35">
              <span className="block h-full bg-white" style={{ width: idx < pos.i ? "100%" : idx === pos.i ? progress * 100 + "%" : "0%" }} />
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <Avatar story={story} size="sm" myName={myName} />
          <span className="text-[13px] font-semibold">{story.isMe ? myName || "You" : story.name}</span>
          <span className="text-xs text-white/65">{age}</span>
          <span className="flex-1" />
          {story.isMe && (
            <button type="button" onClick={remove} disabled={deleting} className="text-xs font-semibold text-white/80 hover:text-white mr-2 disabled:opacity-50">
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Close story" className="text-2xl leading-none text-white">
            &times;
          </button>
        </div>
        <div
          className="relative flex flex-1 items-center justify-center bg-neutral-800"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          {item.kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.url} alt="" className="h-full w-full object-contain" />
          )}
          {item.kind === "video" && (
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
          <button type="button" onClick={prev} aria-label="Previous" className="absolute inset-y-0 left-0 w-[35%]" />
          <button type="button" onClick={next} aria-label="Next" className="absolute inset-y-0 right-0 w-[35%]" />
        </div>
        {item.caption && <p className="m-0 bg-neutral-900 px-3.5 pb-4 pt-3 text-sm">{item.caption}</p>}
      </div>
    </div>
  );
}
