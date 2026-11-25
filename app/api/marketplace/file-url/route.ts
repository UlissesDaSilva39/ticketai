import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { MARKETPLACE_BUCKET } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

const MAX_BYTES = 50 * 1024 * 1024;
const EXT: Record<string, string> = {
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/wave": "wav",
  "audio/flac": "flac",
  "audio/x-flac": "flac",
  "audio/aiff": "aiff",
  "audio/x-aiff": "aiff",
};

// POST /api/marketplace/file-url: one-time signed upload link for the product
// file (private bucket; buyers get it only after paying).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!rateLimit(`market-file:${user.id}`, 20, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many uploads. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const contentType = String(body.contentType ?? "");
  const size = Number(body.size ?? 0);
  const ext = EXT[contentType] ?? (String(body.name ?? "").toLowerCase().endsWith(".zip") ? "zip" : null);
  if (!ext) return NextResponse.json({ error: "Upload a ZIP, MP3, WAV, FLAC or AIFF file." }, { status: 400 });
  if (!size || size > MAX_BYTES) return NextResponse.json({ error: "Files must be under 50 MB." }, { status: 400 });

  const path = `${user.id}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const { data, error } = await createAdminClient().storage.from(MARKETPLACE_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error("[marketplace/file-url]", error?.message);
    return NextResponse.json({ error: "Uploads aren't ready yet. Please try again shortly." }, { status: 500 });
  }
  return NextResponse.json({ bucket: MARKETPLACE_BUCKET, path, token: data.token });
}
