"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { kindOf, uploadMedia, validateAudio, validateFile, type MediaKind, type UploadedMedia } from "./media";

export type ShareableEvent = {
  id: string;
  title: string;
  start_date: string;
  venue_name: string | null;
  venue_city: string | null;
  hero_image: string | null;
};

export function eventDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

interface Pending {
  id: string;
  file: File;
  kind: MediaKind;
  previewUrl: string;
}

// A post as saved in the database (returned by /api/posts/create).
export interface SavedPost {
  id: string;
  author_id: string;
  body: string | null;
  image_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  audio_title?: string | null;
  audio_artist?: string | null;
  event_id?: string | null;
  event?: ShareableEvent | null;
  like_count: number | null;
  comment_count: number | null;
  share_count: number | null;
  created_at: string;
}

// A post holds one photo or one video (posts.image_url / posts.video_url).
const MAX_FILES = 1;
const MAX_TEXT = 2000;

interface GridComposerProps {
  userInitial?: string;
  userName?: string;
  userAvatar?: string | null;
  onPublished?: (post: SavedPost) => void;
  onAudioClick?: () => void;
  onEventClick?: () => void;
  audioIcon?: ReactNode;
  eventIcon?: ReactNode;
}

export default function GridComposer({
  userInitial = "",
  userName = "You",
  userAvatar = null,
  onPublished,
  onAudioClick,
  onEventClick,
  audioIcon,
  eventIcon,
}: GridComposerProps) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [audio, setAudio] = useState<{ file: File; title: string } | null>(null);
  const [event, setEvent] = useState<ShareableEvent | null>(null);
  const [pickingEvent, setPickingEvent] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef(pending);
  pendingRef.current = pending;

  useEffect(() => () => pendingRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl)), []);

  async function addFiles(files: FileList) {
    setError(null);
    const added: Pending[] = [];
    for (const file of Array.from(files)) {
      if (pendingRef.current.length + added.length >= MAX_FILES) {
        setError("You can attach one photo or one video per post.");
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

  function pickAudio(file: File) {
    const problem = validateAudio(file);
    if (problem) return setError(problem);
    setError(null);
    setAudio({ file, title: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").slice(0, 120) });
  }

  const hasContent = text.trim().length > 0 || pending.length > 0 || !!audio || !!event;
  const canPublish = hasContent && text.length <= MAX_TEXT && !busy && (!audio || audio.title.trim().length > 0);

  async function publish() {
    if (!canPublish) return;
    setBusy(true);
    setError(null);
    try {
      // 1) upload the photo/video (if any) to Supabase Storage
      const media: UploadedMedia[] = await Promise.all([
        ...pending.map((p) => uploadMedia(p.file)),
        ...(audio ? [uploadMedia(audio.file)] : []),
      ]);
      const image = media.find((m) => m.kind === "image");
      const video = media.find((m) => m.kind === "video");
      const track = media.find((m) => m.kind === "audio");

      // 2) save the post
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          body: text.trim(),
          image_url: image?.url ?? null,
          video_url: video?.url ?? null,
          audio_url: track?.url ?? null,
          audio_title: audio?.title.trim() || null,
          audio_artist: track ? userName : null,
          event_id: event?.id ?? null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.post) throw new Error(data.error || "Could not publish. Try again.");

      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPending([]);
      setText("");
      setAudio(null);
      const sharedEvent = event;
      setEvent(null);
      onPublished?.({ ...(data.post as SavedPost), event: sharedEvent });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not publish. Try again.");
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
          {userAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={userAvatar} alt={userName} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white grid place-items-center font-bold flex-shrink-0">
              {userInitial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              maxLength={MAX_TEXT}
              aria-label="Write a post"
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

            {audio && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-3">
                <span aria-hidden="true" className="text-emerald-600 text-lg">&#9835;</span>
                <div className="flex-1 min-w-0">
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-gray-500">Track title</label>
                  <input
                    value={audio.title}
                    maxLength={120}
                    onChange={(e) => setAudio({ ...audio, title: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-none border-b border-transparent focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-gray-500 truncate">{audio.file.name} · {(audio.file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button type="button" onClick={() => setAudio(null)} aria-label="Remove track" className="h-6 w-6 rounded-full bg-black/60 text-white text-sm leading-none hover:bg-black/80">
                  &times;
                </button>
              </div>
            )}

            {event && (
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 p-3">
                <span aria-hidden="true" className="text-emerald-600 text-lg">&#128197;</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{event.title}</p>
                  <p className="text-[11px] text-gray-500 truncate">
                    {eventDate(event.start_date)}
                    {event.venue_name ? ` · ${event.venue_name}` : ""}
                    {event.venue_city ? `, ${event.venue_city}` : ""}
                  </p>
                </div>
                <button type="button" onClick={() => setEvent(null)} aria-label="Remove event" className="h-6 w-6 rounded-full bg-black/60 text-white text-sm leading-none hover:bg-black/80">
                  &times;
                </button>
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
                <button type="button" className={toolBtn} onClick={() => (onAudioClick ? onAudioClick() : audioRef.current?.click())}>
                  {audioIcon ?? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  )}{" "}
                  Audio
                </button>
                <button type="button" className={toolBtn} onClick={() => (onEventClick ? onEventClick() : setPickingEvent(true))}>
                  {eventIcon ?? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}{" "}
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
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
          onChange={(e) => {
            if (e.target.files?.length) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={audioRef}
          type="file"
          hidden
          accept="audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/aac,audio/ogg,audio/flac,.mp3,.wav,.m4a,.aac,.ogg,.flac"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pickAudio(f);
            e.target.value = "";
          }}
        />
      </div>

      {pickingEvent && (
        <EventPicker
          onClose={() => setPickingEvent(false)}
          onPick={(ev) => {
            setEvent(ev);
            setPickingEvent(false);
          }}
        />
      )}
    </>
  );
}

function EventPicker({ onClose, onPick }: { onClose: () => void; onPick: (e: ShareableEvent) => void }) {
  const [q, setQ] = useState("");
  const [events, setEvents] = useState<ShareableEvent[] | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      fetch("/api/events/shareable?q=" + encodeURIComponent(q), { credentials: "include", cache: "no-store" })
        .then((r) => (r.ok ? r.json() : { events: [] }))
        .then((d) => setEvents(d.events ?? []))
        .catch(() => setEvents([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="pick-event-title">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="pick-event-title" className="text-lg font-bold text-gray-900 dark:text-white">Share an event</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-500 text-xl leading-none">&times;</button>
        </div>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search events, venues or cities"
          aria-label="Search events"
          className="mt-3 w-full rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <ul className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {events === null ? (
            <li className="p-3 text-sm text-gray-500">Loading…</li>
          ) : events.length === 0 ? (
            <li className="p-3 text-sm text-gray-500">No upcoming events{q ? ` matching “${q}”` : ""}.</li>
          ) : (
            events.map((ev) => (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => onPick(ev)}
                  className="w-full flex items-center gap-3 rounded-lg p-2 text-left hover:bg-emerald-50 dark:hover:bg-zinc-800"
                >
                  {ev.hero_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.hero_image} alt="" className="h-10 w-10 rounded object-cover flex-shrink-0" />
                  ) : (
                    <span className="h-10 w-10 rounded bg-emerald-100 text-emerald-800 grid place-items-center flex-shrink-0">&#128197;</span>
                  )}
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-gray-900 dark:text-white truncate">{ev.title}</span>
                    <span className="block text-xs text-gray-500 truncate">
                      {eventDate(ev.start_date)}
                      {ev.venue_city ? ` · ${ev.venue_city}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}