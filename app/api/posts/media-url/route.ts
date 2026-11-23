import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// (Route files may only export handlers/config, so these stay module-private.)
const POST_MEDIA_BUCKET = "post-media";
const MAX_BYTES = { image: 10 * 1024 * 1024, video: 50 * 1024 * 1024 } as const;
const EXT: Record<string, string> = {
  "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif", "image/avif": "avif",
  "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
};

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
  const kind = contentType.startsWith("image/") ? "image" : contentType.startsWith("video/") ? "video" : null;
  if (!ext || !kind) {
    return NextResponse.json({ error: "Only JPG, PNG, WebP, GIF, AVIF photos and MP4, WebM, MOV videos." }, { status: 400 });
  }
  if (!size || size > MAX_BYTES[kind]) {
    return NextResponse.json({ error: kind === "image" ? "Photos must be under 10 MB." : "Videos must be under 50 MB." }, { status: 400 });
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
