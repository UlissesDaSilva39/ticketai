import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { original_artist_slug, original_track_id, proposed_split, message } = body ?? {};

    if (!original_artist_slug || !proposed_split) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const op = Number(proposed_split.original_pct ?? 30);
    const rp = Number(proposed_split.remixer_pct ?? 60);
    const pp = Number(proposed_split.platform_pct ?? 10);
    if (op + rp + pp !== 100) {
      return NextResponse.json({ error: "Splits must total 100%" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("remix_requests")
      .insert({
        original_artist_slug,
        original_track_id: original_track_id || null,
        remixer_id: user.id,
        remixer_name: user.user_metadata?.name || user.email?.split("@")[0] || "Artist",
        remixer_email: user.email,
        proposed_split,
        message: message || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, request: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const artistSlug = url.searchParams.get("artist");
    const mine = url.searchParams.get("mine");

    let q = supabase.from("remix_requests").select("*").order("created_at", { ascending: false });
    if (artistSlug) q = q.eq("original_artist_slug", artistSlug);
    if (mine === "1") q = q.eq("remixer_id", user.id);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ requests: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}