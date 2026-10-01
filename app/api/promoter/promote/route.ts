import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

function generateReferralCode(prefix: string) {
  const clean = prefix.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${clean}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { eventId } = await req.json();

    const { data: promoter } = await supabase
      .from("promoters")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!promoter) {
      return NextResponse.json({ error: "Join as promoter first" }, { status: 400 });
    }

    const { data: event } = await supabase
      .from("events")
      .select("title")
      .eq("id", eventId)
      .single();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const referral_code = generateReferralCode(event.title);

    const { data, error } = await supabase
      .from("promoter_events")
      .insert({
        promoter_id: promoter.id,
        event_id: eventId,
        referral_code,
        commission_rate: promoter.commission_rate,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "You already promote this event" }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ promoter_event: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Apply failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
