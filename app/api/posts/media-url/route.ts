import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// (Route files may only export handlers/config, so these stay module-private.)
const POST_MEDIA_BUCKET = "post-media";
const MAX_BYTES = { image: 10 * 1024 * 1024, video: 50 * 1024 * 1024, audio: 30 * 1024 * 1024 } as const;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
  "audio/mpeg": "mp3", "audio/mp3": "mp3", "audio/wav": "wav", "audio/x-wav": "wav", "audio/wave": "wav",
  "audio/mp4": "m4a", "audio/x-m4a": "m4a", "audio/aac": "aac", "audio/ogg": "ogg", "audio/flac": "flac", "audio/x-flac": "flac",
};
const LIMIT_TEXT = { image: "Photos must be under 10 MB.", video: "Videos must be under 50 MB.", audio: "Audio must be under 30 MB." } as const;

// Returns a one-time signed upload link so the browser can upload a photo/video
// straight to Supabase Storage (no big files through our server).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  if (!rateLimit(`post-media:${user.id}`, 20, 10 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many uploads. Try again in a few minutes." }, { status: 429 });
  }

  let body: { contentType?: string; size?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const contentType = String(body.contentType ?? "");
  const size = Number(body.size ?? 0);
  const ext = EXT[contentType];
  const kind = contentType.startsWith("image/") ? "image" : contentType.startsWith("video/") ? "video" : contentType.startsWith("audio/") ? "audio" : null;
  if (!ext || !kind) {
    return NextResponse.json({ error: "Supported: JPG, PNG, WebP, GIF, AVIF photos; MP4, WebM, MOV videos; MP3, WAV, M4A, AAC, OGG, FLAC audio." }, { status: 400 });
  }
  if (!size || size > MAX_BYTES[kind]) {
    return NextResponse.json({ error: LIMIT_TEXT[kind] }, { status: 400 });
  }

  const path = `${user.id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(POST_MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[posts/media-url]", error);
    return NextResponse.json({ error: "Could not start the upload." }, { status: 500 });
  }
  const { data: pub } = admin.storage.from(POST_MEDIA_BUCKET).getPublicUrl(path);

  return NextResponse.json({ bucket: POST_MEDIA_BUCKET, path, token: data.token, publicUrl: pub.publicUrl, kind });
}
