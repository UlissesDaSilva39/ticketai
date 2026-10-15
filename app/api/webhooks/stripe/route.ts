import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";
import { sendTicketEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const admin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    console.error("Stripe webhook signature verification failed:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as {
    id: string;
    payment_intent: string | null;
    customer_email?: string | null;
    amount_total: number | null;
    currency: string | null;
    metadata: Record<string, string> | null;
  };

  const md = session.metadata ?? {};
  const eventId = md.eventId;
  const userId = md.userId;
  const rawTickets = md.tickets;
  const rawSeats = md.seats;
  const referralCode = md.referralCode || null;
  const campaignId = md.campaignId || null;
  const campaignCode = md.campaignCode || null;
  const promoCode = md.promoCode || null;

  if (!eventId || !userId || !rawTickets) {
    console.error("Webhook: missing metadata", { eventId, userId, hasTickets: !!rawTickets });
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  const { data: existing } = await admin
    .from("orders")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicated: true });
  }

  const ticketSelections = JSON.parse(rawTickets) as Array<{ name: string; qty: number }>;
  const seats = rawSeats ? (JSON.parse(rawSeats) as Array<{ label: string; seat_id?: string }>) : [];

  const { data: eventRow, error: evErr } = await admin
    .from("events")
    .select("id, title, date, time, venue_name, city, ticket_types")
    .eq("id", eventId)
    .single();
  if (evErr || !eventRow) {
    console.error("Webhook: event not found", eventId, evErr?.message);
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  let subtotal = 0;
  const ticketRows: Array<Record<string, unknown>> = [];

  for (const t of ticketSelections) {
    const tt = (eventRow.ticket_types as Array<{ name: string; price: number }>)
      ?.find((x) => x.name === t.name);
    if (!tt) continue;
    const unitPrice = Number(tt.price);
    subtotal += unitPrice * Number(t.qty);

    for (let i = 0; i < Number(t.qty); i++) {
      ticketRows.push({
        event_id: eventId,
        user_id: userId,
        ticket_type: t.name,
        price: unitPrice,
        qr_code: crypto.randomUUID(),
        status: "valid",
      });
    }
  }

  const totalAmount = subtotal;
  const platformFee = +(totalAmount * 0.02).toFixed(2);
  const processingFee = +(totalAmount * 0.029).toFixed(2);

  const { data: orderRow, error: orderErr } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      event_id: eventId,
      total_amount: totalAmount,
      platform_fee: platformFee,
      processing_fee: processingFee,
      currency: session.currency ?? "gbp",
      stripe_payment_intent_id: session.payment_intent,
      stripe_checkout_session_id: session.id,
      status: "paid",
      tickets: ticketSelections,
      referral_code: referralCode,
      campaign_id: campaignId,
      campaign_code: campaignCode,
      promo_code: promoCode,
    })
    .select("id")
    .single();

  if (orderErr || !orderRow) {
    console.error("Webhook: failed to create order", orderErr?.message);
    return NextResponse.json({ error: "Order insert failed" }, { status: 500 });
  }

  const orderId = orderRow.id;

  for (let i = 0; i < ticketRows.length; i++) {
    ticketRows[i].order_id = orderId;
    if (seats[i]) {
      ticketRows[i].seat_label = seats[i].label;
      if (seats[i].seat_id) ticketRows[i].seat_id = seats[i].seat_id;
    }
  }

  const { data: insertedTickets, error: ticketsErr } = await admin
    .from("tickets")
    .insert(ticketRows)
    .select("id, ticket_type, price, qr_code");

  if (ticketsErr || !insertedTickets) {
    console.error("Webhook: failed to insert tickets", ticketsErr?.message);
    return NextResponse.json({ error: "Ticket insert failed" }, { status: 500 });
  }

  const toEmail = session.customer_email ?? null;
  if (!toEmail) {
    console.warn("Webhook: no customer_email on session", session.id);
    return NextResponse.json({ received: true, emailed: false });
  }

  try {
    await sendTicketEmail({
      toEmail,
      toName: null,
      eventTitle: eventRow.title,
      eventDate: String(eventRow.date),
      orderId,
      tickets: insertedTickets.map((t) => ({
        id: t.id,
        ticket_type: t.ticket_type,
        price: Number(t.price),
        qr_code: t.qr_code,
      })),
      totalAmount,
      attachPdf: true,
    });
    console.log("Webhook: ticket email sent to", toEmail, "order", orderId);
  } catch (mailErr) {
    console.error("Webhook: email send failed", mailErr);
  }

  return NextResponse.json({ received: true, orderId, emailed: true });
}