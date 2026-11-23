import { createClient } from "@/lib/supabase/client";

export type MediaKind = "image" | "video" | "audio";

export interface UploadedMedia {
  id: string;
  kind: MediaKind;
  url: string;
  name: string;
  size: number;
  duration?: number; // seconds, videos only
}

export const MAX_IMAGE_MB = 10;
export const MAX_VIDEO_MB = 50;
export const MAX_VIDEO_SECONDS = 60;

export const MAX_AUDIO_MB = 30;

export function kindOf(file: File): MediaKind | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return null;
}

/** Checks an audio file for the Audio button. Returns an error message or null. */
export function validateAudio(file: File): string | null {
  if (kindOf(file) !== "audio") return `${file.name}: please choose an audio file (MP3, WAV, M4A…).`;
  if (file.size / 1024 / 1024 > MAX_AUDIO_MB) return `${file.name}: audio must be under ${MAX_AUDIO_MB} MB.`;
  return null;
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(v.duration);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video"));
    };
    v.src = url;
  });
}

/** Returns an error message, or null if the file is fine. */
export async function validateFile(file: File): Promise<string | null> {
  const kind = kindOf(file);
  if (!kind || kind === "audio") return `${file.name}: only photos and videos here (use the Audio button for tracks).`;
  const mb = file.size / 1024 / 1024;
  if (kind === "image" && mb > MAX_IMAGE_MB)
    return `${file.name}: photos must be under ${MAX_IMAGE_MB} MB.`;
  if (kind === "video") {
    if (mb > MAX_VIDEO_MB)
      return `${file.name}: videos must be under ${MAX_VIDEO_MB} MB.`;
    try {
      const d = await getVideoDuration(file);
      if (d > MAX_VIDEO_SECONDS + 0.5)
        return `${file.name}: videos must be ${MAX_VIDEO_SECONDS}s or shorter.`;
    } catch {
      return `${file.name}: this video format can't be read by your browser.`;
    }
  }
  return null;
}

/**
 * Uploads a photo/video to Supabase Storage (bucket "post-media"):
 * 1) our server checks the file and returns a one-time signed upload link,
 * 2) the browser uploads the file straight to Supabase with that link.
 * Returns the permanent public URL.
 */
export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const kind = kindOf(file);
  if (!kind) throw new Error("Unsupported file type");

  const res = await fetch("/api/posts/media-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  const ticket = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(ticket.error || "Could not start the upload.");

  const { error } = await createClient()
    .storage.from(ticket.bucket)
    .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
  if (error) throw new Error("Upload failed. Please try again.");

  return {
    id: crypto.randomUUID(),
    kind,
    url: ticket.publicUrl,
    name: file.name,
    size: file.size,
    duration: kind === "video" ? await getVideoDuration(file).catch(() => undefined) : undefined,
  };
}