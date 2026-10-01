import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { eventId, tickets, seats, campaignCode } = await req.json();

    let campaignId: string | null = null;
    if (campaignCode) {
      const { data: c } = await supabase
        .from("campaigns")
        .select("id")
        .eq("tracking_code", campaignCode)
        .maybeSingle();
      if (c) campaignId = c.id;
    }

    if (Array.isArray(seats) && seats.length > 0) {
      const qty = (tickets as { qty: number }[]).reduce((a, t) => a + t.qty, 0);
      const labels: string[] = seats.map((s: { label: string }) => s.label);
      if (labels.length !== qty || new Set(labels).size !== labels.length) {
        return NextResponse.json({ error: "Select exactly one seat per ticket" }, { status: 400 });
      }
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: ev } = await admin.from("events").select("seatmap_config").eq("id", eventId).single();
      const valid = new Set<string>(
        ((ev?.seatmap_config?.rows ?? []) as { seats: string[] }[]).flatMap((r) => r.seats)
      );
      if (labels.some((l) => !valid.has(l))) {
        return NextResponse.json({ error: "Invalid seat selected" }, { status: 400 });
      }
      const { data: taken } = await admin
        .from("tickets").select("seat_label")
        .eq("event_id", eventId).in("seat_label", labels).in("status", ["valid", "used"]);
      if (taken && taken.length > 0) {
        return NextResponse.json({ error: "Some seats were just taken. Please pick again." }, { status: 409 });
      }
    }

    const cookieStore = await cookies();
    const referralCode = cookieStore.get("referral_code")?.value || null;

    const { data: event } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    let subtotal = 0;
    const lineItems: Array<{
      price_data: { currency: string; product_data: { name: string }; unit_amount: number };
      quantity: number;
    }> = [];

    for (const t of tickets) {
      const tt = event.ticket_types.find(
        (x: { name: string; price: number }) => x.name === t.name
      );
      if (!tt) continue;
      subtotal += Number(tt.price) * Number(t.qty);
      lineItems.push({
        price_data: {
          currency: "gbp",
          product_data: { name: event.title + " - " + t.name },
          unit_amount: Math.round(Number(tt.price) * 100),
        },
        quantity: t.qty,
      });
    }

    const processingFee = subtotal * 0.029;
    const platformFee = subtotal * 0.02;

    const origin = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: origin + "/confirmation?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/checkout?event=" + eventId,
      customer_email: user.email || undefined,
      metadata: {
        eventId,
        userId: user.id,
        tickets: JSON.stringify(tickets),
        seats: JSON.stringify(seats || []),
        referralCode: referralCode || "",
        subtotal: subtotal.toFixed(2),
        processingFee: processingFee.toFixed(2),
        platformFee: platformFee.toFixed(2),
        campaignId: campaignId || "",
        campaignCode: campaignCode || "",
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
