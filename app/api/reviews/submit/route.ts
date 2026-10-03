import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { eventId, rating, comment } = await req.json();
    if (!eventId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "eventId and rating (1-5) required" }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    // Eligibility: user must have a going or interested row for this event
    const { data: interest } = await supabase
      .from("event_interest")
      .select("id")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .maybeSingle();

    if (!interest) {
      return NextResponse.json({ error: "Mark going or interested first" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("event_reviews")
      .upsert(
        {
          event_id: eventId,
          user_id: user.id,
          rating,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "event_id,user_id" }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ review: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
