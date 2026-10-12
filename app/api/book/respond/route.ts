import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyServer } from "@/lib/notify-server";
import { sendBookingResponseEmail } from "@/lib/email-booking-response";

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
        { error: "status must be accepted or declined" },
        { status: 400 }
      );
    }

    const { data: booking, error: fetchErr } = await supabase
      .from("booking_requests")
      .select("id, artist_slug, date, name, email, venue, promoter_id")
      .eq("id", booking_id)
      .maybeSingle();

    if (fetchErr || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const { data: artist } = await supabase
      .from("artists")
      .select("owner_id, name")
      .eq("slug", booking.artist_slug)
      .maybeSingle();

    if (!artist || artist.owner_id !== user.id) {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }

    const { error: updateErr } = await supabase
      .from("booking_requests")
      .update({ status })
      .eq("id", booking_id);

    if (updateErr) {
      console.error("Update error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    const artistName = artist.name || booking.artist_slug;
    const siteUrl = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";
    const bookingUrl = siteUrl + "/promoter/dashboard/sent-bookings";
    const eventShort = new Date(booking.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });

    if (booking.promoter_id) {
      try {
        await notifyServer({
          userId: booking.promoter_id,
          type: "booking_response",
          title:
            status === "accepted"
              ? "Booking accepted: " + artistName
              : "Booking declined: " + artistName,
          body:
            "Your request for " + eventShort +
            (booking.venue ? " at " + booking.venue : "") + ".",
          href: "/promoter/dashboard/sent-bookings",
        });
      } catch (e) {
        console.error("notifyServer failed:", e);
      }
    }

    if (booking.email) {
      try {
        await sendBookingResponseEmail({
          toEmail: booking.email,
          toName: booking.name || "there",
          artistName: artistName,
          status: status as "accepted" | "declined",
          eventDate: booking.date,
          venue: booking.venue,
          bookingUrl: bookingUrl,
        });
      } catch (e) {
        console.error("Booking response email failed:", e);
      }
    }

    return NextResponse.json({ success: true, booking_id: booking_id, status: status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    console.error("Respond route error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
