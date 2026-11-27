import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { REVIEWER_GENRES } from "@/lib/submissions/catalog";

export const dynamic = "force-dynamic";

async function me() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// GET: my reviewer settings (or null).
export async function GET() {
  const user = await me();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { data } = await createAdminClient().from("reviewers").select("headline, genres, accepts_demos, accepts_messages, active").eq("user_id", user.id).maybeSingle();
  return NextResponse.json({ reviewer: data ?? null });
}

// PUT: become a reviewer / update settings / pause ({ active: false }).
export async function PUT(req: NextRequest) {
  const user = await me();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const b = await req.json().catch(() => ({}));
  const headline = typeof b.headline === "string" ? b.headline.trim() : "";
  if (headline.length < 3 || headline.length > 120) return NextResponse.json({ error: "Describe what you look for (3 to 120 characters)." }, { status: 400 });
  const genres = Array.isArray(b.genres) ? b.genres.filter((g: unknown) => typeof g === "string" && REVIEWER_GENRES.includes(g)).slice(0, 6) : [];
  const row = {
    user_id: user.id,
    headline,
    genres,
    accepts_demos: b.acceptsDemos !== false,
    accepts_messages: b.acceptsMessages !== false,
    active: b.active !== false,
    updated_at: new Date().toISOString(),
  };
  if (!row.accepts_demos && !row.accepts_messages) return NextResponse.json({ error: "Accept demos, messages or both." }, { status: 400 });
  const { error } = await createAdminClient().from("reviewers").upsert(row, { onConflict: "user_id" });
  if (error) return NextResponse.json({ error: "Reviews are being set up. Please try again soon." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
