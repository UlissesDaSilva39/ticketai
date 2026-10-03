import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { lineup } = await req.json();

    if (!Array.isArray(lineup)) {
      return NextResponse.json({ error: "lineup must be an array" }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data: event } = await supabase
      .from("events")
      .select("organizer_id")
      .eq("id", id)
      .maybeSingle();

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.organizer_id !== user.id) {
      return NextResponse.json({ error: "Not your event" }, { status: 403 });
    }

    const cleaned = lineup.map((a: { name?: string; time?: string; photo?: string; bio?: string }) => ({
      name: String(a.name || "").trim(),
      time: a.time ? String(a.time).trim() : undefined,
      photo: a.photo ? String(a.photo).trim() : undefined,
      bio: a.bio ? String(a.bio).trim() : undefined,
    })).filter((a: { name: string }) => a.name.length > 0);

    const { error } = await supabase
      .from("events")
      .update({ lineup: cleaned })
      .eq("id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, lineup: cleaned });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
