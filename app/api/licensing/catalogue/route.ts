import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// POST /api/licensing/catalogue: "Submit your catalogue" (GRID Programme tab).
// Public form, so it's rate limited per IP and has a honeypot field.
export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`catalogue:${ip}`, 5, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  // Honeypot: real people never see or fill the "website" field.
  if (text(b.website, 200)) return NextResponse.json({ ok: true });

  const row = {
    artist_name: text(b.artistName, 200),
    email: text(b.email, 254).toLowerCase(),
    track_title: text(b.trackTitle, 200),
    isrc: text(b.isrc, 20) || null,
    master_owner: text(b.masterOwner, 200),
    composer: text(b.composer, 300),
    publisher: text(b.publisher, 200) || null,
    message: text(b.message, 2000) || null,
  };
  if (!row.artist_name || !row.track_title || !row.master_owner || !row.composer) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  let userId: string | null = null;
  try {
    const supabase = await createServerSupabase();
    userId = (await supabase.auth.getUser()).data.user?.id ?? null;
  } catch {
    /* logged-out visitor */
  }

  const { error } = await createAdminClient().from("catalogue_submissions").insert({ ...row, user_id: userId });
  if (error) {
    console.error("[licensing/catalogue]", error.message);
    return NextResponse.json({ error: "We couldn't save your submission. Please email licensing@grid.app instead." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
