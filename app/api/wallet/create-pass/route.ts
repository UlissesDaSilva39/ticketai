import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { ticketId } = await req.json();
    if (!ticketId) return NextResponse.json({ error: "ticketId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data: ticket } = await supabase
      .from("tickets")
      .select("*, events(title, start_date)")
      .eq("id", ticketId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    const eventDate = ticket.events
      ? new Date(ticket.events.start_date).toLocaleDateString("en-GB", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        })
      : "";

    const res = await fetch("https://api.walletwallet.dev/api/passes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.WALLETWALLET_API_KEY,
      },
      body: JSON.stringify({
        barcodeValue: ticket.qr_code,
        barcodeFormat: "QR",
        logoText: "TicketAI",
        organizationName: ticket.events?.title || "TicketAI Event",
        primaryFields: [
          { label: "EVENT", value: ticket.events?.title || "Event" },
        ],
        secondaryFields: [
          { label: "DATE", value: eventDate },
          { label: "TICKET TYPE", value: ticket.ticket_type },
          { label: "SEAT", value: ticket.seat_label || "General" },
        ],
        backFields: [
          { label: "Ticket ID", value: ticket.qr_code },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Wallet API error:", err);
      return NextResponse.json({ error: "Wallet API error" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({
      applePass: data.applePass,
      googleSaveUrl: data.googleSaveUrl,
      shareUrl: data.shareUrl,
    });
  } catch (err) {
    console.error("Wallet pass error:", err);
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

