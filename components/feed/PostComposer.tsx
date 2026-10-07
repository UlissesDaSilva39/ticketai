"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

type MiniEvent = {
  id: string;
  title: string;
  start_date: string | null;
  hero_image?: string | null;
};

type Props = {
  userName: string;
  initials: string;
  events: MiniEvent[];
};

export default function PostComposer({ userName, initials, events }: Props) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [attachedEvent, setAttachedEvent] = useState<MiniEvent | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [body]);

  const onPickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/posts/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setAttachedImage(data.url);
      else setError(data.error || "Upload failed");
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const post = async () => {
    if (busy) return;
    if (!body.trim() && !attachedEvent && !attachedImage) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim() || null,
          event_id: attachedEvent?.id || null,
          image_url: attachedImage,
          audio_url: null,
        }),
      });
      const data = await res.json();
      if (data.post) {
        setBody("");
        setAttachedEvent(null);
        setAttachedImage(null);
        router.refresh();
      } else {
        setError(data.error || "Post failed");
      }
    } catch {
      setError("Post failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
          {initials}
        </div>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={"What's on your mind, " + userName + "?"}
          rows={1}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl outline-none focus:border-black resize-none"
        />
      </div>

      {attachedImage ? (
        <div className="mt-3 relative">
          <img src={attachedImage} alt="" className="w-full max-h-64 object-cover rounded-xl" />
          <button
            onClick={() => setAttachedImage(null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center"
          >
            x
          </button>
        </div>
      ) : null}

      {attachedEvent ? (
        <div className="mt-3 flex items-center gap-2 border border-gray-200 rounded-xl p-2 bg-gray-50">
          {attachedEvent.hero_image ? (
            <img src={attachedEvent.hero_image} alt="" className="w-10 h-10 rounded object-cover" />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-200" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{attachedEvent.title}</p>
            <p className="text-[10px] text-gray-500">
              {attachedEvent.start_date
                ? new Date(attachedEvent.start_date).toLocaleDateString()
                : "TBC"}
            </p>
          </div>
          <button
            onClick={() => setAttachedEvent(null)}
            className="text-xs text-gray-500 hover:text-black"
          >
            Remove
          </button>
        </div>
      ) : null}

      {showEventPicker ? (
        <div className="mt-3 border border-gray-200 rounded-xl max-h-60 overflow-y-auto">
          {events.length === 0 ? (
            <p className="p-3 text-xs text-gray-500">No events to attach</p>
          ) : (
            events.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setAttachedEvent(e);
                  setShowEventPicker(false);
                }}
                className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                {e.title}
              </button>
            ))
          )}
        </div>
      ) : null}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickImage}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            {uploading ? "..." : "Photo"}
          </button>
          <button
            type="button"
            onClick={() => setShowEventPicker((v) => !v)}
            className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100"
          >
            Event
          </button>
        </div>
        <button
          type="button"
          onClick={post}
          disabled={busy || (!body.trim() && !attachedEvent && !attachedImage)}
          className="px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {busy ? "..." : "Post"}
        </button>
      </div>

      {error ? <p className="text-xs text-red-600 mt-2">{error}</p> : null}
    </div>
  );
}
