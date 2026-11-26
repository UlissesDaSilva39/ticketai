import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { DISTRIBUTION_BUCKET } from "@/lib/distribution/checks";

export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024;
const ARTWORK: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png" };
const AUDIO: Record<string, string> = {
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/aiff": "aiff",
  "audio/x-aiff": "aiff",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
};
const byName = (name: string) => {
  const m = name.toLowerCase().match(/\.(wav|flac|aiff?|mp3)$/);
  return m ? (m[1] === "aif" ? "aiff" : m[1]) : null;
};

// POST /api/distribution/file-url { kind: "artwork" | "audio", contentType, size, name }
// One-time signed upload link into the private distribution bucket.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!rateLimit(`dist-file:${user.id}`, 60, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  const kind = b.kind === "artwork" ? "artwork" : b.kind === "audio" ? "audio" : null;
  const contentType = String(b.contentType ?? "");
  const size = Number(b.size ?? 0);
  if (!kind) return NextResponse.json({ error: "Unknown upload type." }, { status: 400 });
  const ext = kind === "artwork" ? ARTWORK[contentType] : AUDIO[contentType] ?? byName(String(b.name ?? ""));
  if (!ext) {
    return NextResponse.json(
      { error: kind === "artwork" ? "Cover art must be a JPG or PNG." : "Upload a WAV, FLAC, AIFF or MP3 file." },
      { status: 400 }
    );
  }
  if (!size || size > MAX_BYTES) {
    return NextResponse.json(
      { error: kind === "audio" ? "Audio must be under 50 MB. Long tracks fit as FLAC, which is lossless but smaller than WAV." : "Images must be under 50 MB." },
      { status: 400 }
    );
  }

  const path = `${user.id}/releases/${kind}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { data, error } = await createAdminClient().storage.from(DISTRIBUTION_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[distribution/file-url]", error?.message);
    return NextResponse.json({ error: "Uploads aren't ready yet. Please try again shortly." }, { status: 500 });
  }
  return NextResponse.json({ bucket: DISTRIBUTION_BUCKET, path, token: data.token });
}
