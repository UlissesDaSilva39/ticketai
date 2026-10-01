import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { eventId } = await req.json();
    if (!eventId) {
      return NextResponse.json({ error: "eventId required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();

    const { error } = await supabase.rpc("increment_event_views", {
      event_id: eventId,
    });

    if (error) {
      console.error("track-view error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("track-view exception:", err);
    return NextResponse.json({ success: false }, { status: 200 });
  }
}

