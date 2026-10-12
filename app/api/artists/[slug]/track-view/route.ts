import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "missing slug" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const source: string | null =
      typeof body.source === "string" ? body.source.slice(0, 64) : null;

    const h = req.headers;
    const city =
      h.get("x-vercel-ip-city") ||
      h.get("cf-ipcity") ||
      h.get("x-city") ||
      null;

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("artist_views").insert({
      artist_slug: slug,
      viewer_id: user?.id ?? null,
      source,
      city: city ? decodeURIComponent(city) : null,
    });

    if (error) {
      console.error("track-view insert failed:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "failed";
    console.error("track-view error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
