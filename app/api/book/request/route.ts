import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    artist_slug,
    event_date,
    venue_name,
    message,
    promoter_name,
    promoter_email,
  } = body;

  if (!artist_slug || !event_date) {
    return NextResponse.json(
      { error: "artist_slug and event_date are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("booking_requests")
    .insert({
      artist_slug,
      date: event_date,
      venue: venue_name || null,
      message: message || null,
      name: promoter_name || user.email?.split("@")[0] || "Promoter",
      email: promoter_email || user.email || "",
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ booking: data });
}
