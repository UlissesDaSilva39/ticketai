import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  const allowed = [
    "full_name", "bio", "city", "website", "instagram", "twitter",
    "avatar_url", "cover_image", "genre", "label",
    "spotify", "youtube", "soundcloud",
  ] as const;

  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in payload) update[key] = payload[key];
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}