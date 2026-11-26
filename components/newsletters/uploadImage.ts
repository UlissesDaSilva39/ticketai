import { createClient } from "@/lib/supabase/client";

/** Uploads an image to GRID's public post-media bucket and returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image (JPG, PNG, WebP or GIF).");
  const res = await fetch("/api/posts/media-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  });
  const t = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(t.error || "Upload failed.");
  const { error } = await createClient().storage.from(t.bucket).uploadToSignedUrl(t.path, t.token, file, { contentType: file.type });
  if (error) throw new Error("Upload failed. Please try again.");
  return t.publicUrl as string;
}
