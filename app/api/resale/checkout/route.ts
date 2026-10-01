import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Please sign in to claim this ticket" }, { status: 401 });

    const admin = createAdminClient();

    const { data: ticket } = await admin
      .from("tickets")
      .select("*")
      .eq("resale_claim_token", token)
      .maybeSingle();

    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    if (ticket.status !== "returned") return NextResponse.json({ error: "Ticket is no longer available" }, { status: 400 });
    if (ticket.user_id === user.id) return NextResponse.json({ error: "You cannot claim your own ticket" }, { status: 400 });

    const expired = ticket.resale_claim_expires_at
      ? new Date(ticket.resale_claim_expires_at) < new Date()
      : false;
    if (expired) return NextResponse.json({ error: "This claim link has expired" }, { status: 400 });

    const { data: event } = await admin
      .from("events")
      .select("title, start_date")
      .eq("id", ticket.event_id)
      .single();

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    const origin = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: "Resale: " + event.title + " - " + ticket.ticket_type },
            unit_amount: Math.round(Number(ticket.price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: origin + "/confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/resale/" + token,
      customer_email: user.email || undefined,
      metadata: {
        type: "resale",
        originalTicketId: ticket.id,
        originalOrderId: ticket.order_id,
        originalUserId: ticket.user_id,
        newUserId: user.id,
        eventId: ticket.event_id,
        ticketType: ticket.ticket_type,
        price: Number(ticket.price).toFixed(2),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Resale checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

