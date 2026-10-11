import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { booking_id, status } = body;

    if (!booking_id || !status) {
      return NextResponse.json(
        { error: "booking_id and status are required" },
        { status: 400 }
      );
    }

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'accepted' or 'declined'" },
        { status: 400 }
      );
    }

    // Fetch the booking to verify ownership
    const { data: booking, error: fetchErr } = await supabase
      .from("booking_requests")
      .select("id, artist_slug")
      .eq("id", booking_id)
      .maybeSingle();

    if (fetchErr) {
      console.error("Fetch error:", fetchErr);
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify the user owns this artist
    const { data: artist } = await supabase
      .from("artists")
      .select("owner_id")
      .eq("slug", booking.artist_slug)
      .maybeSingle();

    if (!artist || artist.owner_id !== user.id) {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }

    // Update status (use update without .single() to avoid coerce errors)
    const { error: updateErr } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("id", booking_id);

    if (updateErr) {
      console.error("Update error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, booking_id, status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    console.error("Respond route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
