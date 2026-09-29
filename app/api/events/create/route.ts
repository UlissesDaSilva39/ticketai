import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json();
    const {
      title, description, startDate, eventType,
      heroImage, ticketTypes, status, venueId,
      previewAudioUrl,
      seatmapConfig,
    } = body;

    if (!title || !startDate) {
      return NextResponse.json({ error: "Title and start date are required" }, { status: 400 });
    }

    const insertData = {
      organizer_id: user.id,
      venue_id: venueId || null,
      title,
      description: description || null,
      start_date: new Date(startDate).toISOString(),
      timezone: "Europe/London",
      event_type: eventType || "in-person",
      status: status || "draft",
      hero_image: heroImage || null,
      preview_audio_url: previewAudioUrl || null,
      seatmap_config: seatmapConfig || null,
      ticket_types: ticketTypes || [],
      fee_handling: "pass",
    };

    const { data, error } = await supabase
      .from("events")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ event: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
