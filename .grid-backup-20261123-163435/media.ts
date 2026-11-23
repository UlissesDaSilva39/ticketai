export type MediaKind = "image" | "video";

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

export function kindOf(file: File): MediaKind | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
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
  if (!kind) return `${file.name}: only photos and videos are supported.`;
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
 * STUB. Replace the body with a real upload (S3 presigned URL, Supabase
 * storage, Firebase, your own /api/upload route, ...) and return the
 * permanent URL. Until then it returns a temporary blob URL that only
 * lives in the current tab.
 */
export async function uploadMedia(file: File): Promise<UploadedMedia> {
  const kind = kindOf(file);
  if (!kind) throw new Error("Unsupported file type");
  await new Promise((r) => setTimeout(r, 400)); // fake network delay
  return {
    id: crypto.randomUUID(),
    kind,
    url: URL.createObjectURL(file),
    name: file.name,
    size: file.size,
    duration: kind === "video" ? await getVideoDuration(file).catch(() => undefined) : undefined,
  };
}