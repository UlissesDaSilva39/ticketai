import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      // Allow local testing even without auth
      return NextResponse.json({ ok: true, stored: false, reason: "unauthenticated" });
    }

    const { track_title, splits } = body ?? {};
    if (!track_title || !Array.isArray(splits)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { error } = await supabase.from("splits").insert({
      user_id: user.id,
      track_title,
      splits,
    });
    if (error) {
      // Table may not exist yet — return ok so the UI proceeds
      return NextResponse.json({ ok: true, stored: false, reason: error.message });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}