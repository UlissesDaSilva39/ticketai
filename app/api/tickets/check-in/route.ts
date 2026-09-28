import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { qrCode } = await req.json();
    if (!qrCode) return NextResponse.json({ error: "QR code required" }, { status: 400 });

    const { data: ticket } = await supabase
      .from("tickets")
      .select("*, events:event_id(title, organizer_id)")
      .eq("qr_code", qrCode)
      .maybeSingle();

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.status === "used") {
      return NextResponse.json({
        error: "Ticket already used",
        checked_in_at: ticket.checked_in_at,
      }, { status: 400 });
    }

    if (ticket.status === "cancelled") {
      return NextResponse.json({ error: "Ticket cancelled" }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from("tickets")
      .update({
        status: "used",
        checked_in_at: new Date().toISOString(),
      })
      .eq("id", ticket.id);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      ticket_type: ticket.ticket_type,
      event_title: ticket.events?.title || "Event",
      checked_in_at: new Date().toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Check-in failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
