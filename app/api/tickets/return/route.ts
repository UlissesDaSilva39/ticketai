import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendResaleNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { ticketId } = await req.json();
    if (!ticketId) return NextResponse.json({ error: "ticketId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const admin = createAdminClient();

    const { data: ticket } = await admin
      .from("tickets")
      .select("*")
      .eq("id", ticketId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    if (ticket.status !== "valid") return NextResponse.json({ error: "Only valid tickets can be returned" }, { status: 400 });

    const { data: event } = await admin
      .from("events")
      .select("title, start_date, venue_id")
      .eq("id", ticket.event_id)
      .maybeSingle();

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: updateErr } = await admin
      .from("tickets")
      .update({
        status: "returned",
        returned_at: new Date().toISOString(),
        resale_claim_token: token,
        resale_claim_expires_at: expiresAt,
      })
      .eq("id", ticketId);

    if (updateErr) throw updateErr;

    const { data: waitlistEntries } = await admin
      .from("waitlist")
      .select("id, email")
      .eq("event_id", ticket.event_id)
      .is("notified_at", null)
      .neq("email", user.email || "")
      .order("created_at", { ascending: true })
      .limit(1);

    let notifiedEmail: string | null = null;
    if (waitlistEntries && waitlistEntries.length > 0) {
      const entry = waitlistEntries[0];
      const origin = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";
      const claimUrl = origin + "/resale/" + token;

      try {
        await sendResaleNotification({
          toEmail: entry.email,
          eventTitle: event?.title || "Event",
          eventDate: event ? new Date(event.start_date).toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          }) : "",
          ticketType: ticket.ticket_type,
          price: Number(ticket.price),
          claimUrl,
          expiresAt,
        });
        await admin.from("waitlist").update({ notified_at: new Date().toISOString() }).eq("id", entry.id);
        notifiedEmail = entry.email;
      } catch (e) {
        console.error("Failed to notify waitlist:", e);
      }
    }

    return NextResponse.json({
      success: true,
      notified: !!notifiedEmail,
      notifiedEmail,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to return ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

