import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { sendTicketEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as {
    id: string;
    payment_intent: string;
    metadata: Record<string, string> | null;
    customer_details?: { email?: string };
  };

  const metadata = session.metadata || {};

  // ===== BOOST PAYMENT =====
  if (metadata.type === "boost") {
    const admin = createAdminClient();
    const eventId = metadata.eventId;
    const days = Number(metadata.days || 7);
    const tier = metadata.tier;
    const paidAmount = Number(metadata.price || 0);

    try {
      const featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

      await admin
        .from("events")
        .update({
          featured_until: featuredUntil,
          featured_tier: tier,
          featured_paid: paidAmount,
        })
        .eq("id", eventId);

      console.log("Event boosted:", eventId, "until", featuredUntil);
      return NextResponse.json({ received: true });
    } catch (boostErr) {
      console.error("Boost processing error:", boostErr);
      return NextResponse.json({ error: "Boost failed" }, { status: 500 });
    }
  }

  // ===== RESALE PAYMENT =====
  if (metadata.type === "resale") {
    const admin = createAdminClient();
    const originalTicketId = metadata.originalTicketId;
    const originalOrderId = metadata.originalOrderId;
    const newUserId = metadata.newUserId;
    const eventId = metadata.eventId;
    const ticketType = metadata.ticketType;
    const price = Number(metadata.price || 0);

    try {
      const { data: orig } = await admin
        .from("tickets")
        .select("seat_label")
        .eq("id", originalTicketId)
        .single();

      await admin
        .from("tickets")
        .update({
          status: "resold",
          resale_completed_at: new Date().toISOString(),
        })
        .eq("id", originalTicketId);

      const { data: newTicket } = await admin
        .from("tickets")
        .insert({
          event_id: eventId,
          order_id: originalOrderId,
          user_id: newUserId,
          ticket_type: ticketType,
          price: price,
          qr_code: crypto.randomUUID(),
          seat_label: orig?.seat_label ?? null,
          status: "valid",
        })
        .select()
        .single();

      const { data: originalOrder } = await admin
        .from("orders")
        .select("stripe_payment_intent_id")
        .eq("id", originalOrderId)
        .single();

      if (originalOrder?.stripe_payment_intent_id) {
        try {
          await stripe.refunds.create({
            payment_intent: originalOrder.stripe_payment_intent_id,
          });
        } catch (refundErr) {
          console.error("Refund failed:", refundErr);
        }
      }

      const { data: newUserAuth } = await admin.auth.admin.getUserById(newUserId);
      const { data: eventData } = await admin
        .from("events")
        .select("title, start_date")
        .eq("id", eventId)
        .single();

      if (newUserAuth?.user?.email && newTicket && eventData) {
        try {
          await sendTicketEmail({
            toEmail: newUserAuth.user.email,
            toName: newUserAuth.user.email.split("@")[0],
            eventTitle: eventData.title,
            eventDate: new Date(eventData.start_date).toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            }),
            orderId: originalOrderId,
            tickets: [{
              id: newTicket.id,
              ticket_type: newTicket.ticket_type,
              price: Number(newTicket.price),
              qr_code: newTicket.qr_code,
            }],
            totalAmount: price,
          });
        } catch (e) {
          console.error("Resale email failed:", e);
        }
      }

      console.log("Resale completed - new ticket issued");
      return NextResponse.json({ received: true });
    } catch (resaleErr) {
      console.error("Resale processing error:", resaleErr);
      return NextResponse.json({ error: "Resale failed" }, { status: 500 });
    }
  }

  // ===== REGULAR TICKET PURCHASE =====
  try {
    const admin = createAdminClient();
    const eventId = metadata.eventId;
    const userId = metadata.userId;
    const tickets = JSON.parse(metadata.tickets || "[]");
    const referralCode = metadata.referralCode || null;

    const subtotal = Number(metadata.subtotal || 0);
    const processingFee = Number(metadata.processingFee || 0);
    const platformFee = Number(metadata.platformFee || 0);
    const total = subtotal + processingFee;

    let promoterEvent: { id: string; commission_rate: number } | null = null;
    if (referralCode) {
      const { data: pe } = await admin
        .from("promoter_events")
        .select("id, commission_rate")
        .eq("referral_code", referralCode)
        .maybeSingle();
      if (pe) promoterEvent = pe;
    }

    const { data: eventData } = await admin
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    let venue: { id: string; revenue_share_percent: number } | null = null;
    if (eventData?.venue_id) {
      const { data: v } = await admin
        .from("venues")
        .select("id, revenue_share_percent")
        .eq("id", eventData.venue_id)
        .maybeSingle();
      if (v) venue = v;
    }

    const venueRevenue = venue ? subtotal * (Number(venue.revenue_share_percent) / 100) : 0;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        event_id: eventId,
        total_amount: total,
        platform_fee: platformFee,
        processing_fee: processingFee,
        currency: "GBP",
        status: "paid",
        tickets,
        referral_code: referralCode,
        promoter_event_id: promoterEvent?.id || null,
        venue_id: venue?.id || null,
        venue_revenue: venueRevenue,
        stripe_payment_intent_id: session.payment_intent,
        stripe_checkout_session_id: session.id,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const ticketsToInsert: Array<{
      event_id: string;
      order_id: string;
      user_id: string;
      ticket_type: string;
      price: number;
      qr_code: string;
      status: string;
    }> = [];

    const seats: string[] = JSON.parse(metadata.seats || "[]");
    let seatIndex = 0;
    for (const t of tickets) {
      const matchedTT = eventData?.ticket_types?.find(
        (x: { name: string; price: number }) => x.name === t.name
      );
      const unitPrice = matchedTT ? Number(matchedTT.price) : 0;
      for (let i = 0; i < t.qty; i++) {
        ticketsToInsert.push({
          event_id: eventId,
          order_id: order.id,
          user_id: userId,
          ticket_type: t.name,
          price: unitPrice,
          qr_code: crypto.randomUUID(),
          status: "valid",
        });
      }
    }

    if (venue) {
      const { data: vc } = await admin
        .from("venues")
        .select("total_revenue")
        .eq("id", venue.id)
        .single();
      if (vc) {
        await admin
          .from("venues")
          .update({ total_revenue: Number(vc.total_revenue || 0) + venueRevenue })
          .eq("id", venue.id);
      }
    }

    if (promoterEvent) {
      const commission = subtotal * (promoterEvent.commission_rate / 100);
      const { data: current } = await admin
        .from("promoter_events")
        .select("conversions, revenue")
        .eq("id", promoterEvent.id)
        .single();
      if (current) {
        await admin
          .from("promoter_events")
          .update({
            conversions: (current.conversions || 0) + 1,
            revenue: Number(current.revenue || 0) + commission,
          })
          .eq("id", promoterEvent.id);
      }
    }

    const { data: insertedTickets } = await admin
      .from("tickets")
      .insert(ticketsToInsert)
      .select("id, ticket_type, price, qr_code, seat_label");

    const buyerEmail = session.customer_details?.email;
    if (buyerEmail && insertedTickets) {
      try {
        await sendTicketEmail({
          toEmail: buyerEmail,
          toName: buyerEmail.split("@")[0],
          eventTitle: eventData?.title || "Event",
          eventDate: new Date(eventData?.start_date || Date.now()).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          orderId: order.id,
          tickets: insertedTickets.map((t: { id: string; ticket_type: string; price: number; qr_code: string }) => ({
            id: t.id,
            ticket_type: t.ticket_type,
            price: Number(t.price),
            qr_code: t.qr_code,
          })),
          totalAmount: total,
          attachPdf: false,
        });
      } catch (e) {
        console.error("Email failed:", e);
      }
    }

    console.log("Order created from webhook:", order.id);
    // ===== CAMPAIGN CONVERSION TRACKING =====
    const campaignId = metadata.campaignId;
    if (campaignId) {
      try {
        await admin.from("campaign_events").insert({
          campaign_id: campaignId,
          event_id: eventId,
          type: "conversion",
          order_id: order.id,
          revenue: total,
        });
        await admin.rpc("increment_campaign_conversion", {
          campaign_id_in: campaignId,
          revenue_in: total,
        });
      } catch (conversionErr) {
        console.error("Campaign conversion tracking failed:", conversionErr);
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}





