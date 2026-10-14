import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaService = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key || !whSecret || !supaUrl || !supaService) {
    return NextResponse.json({ error: "Missing Stripe or Supabase env" }, { status: 500 });
  }

  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid signature: " + (e instanceof Error ? e.message : "") },
      { status: 400 }
    );
  }

  const supa = createClient(supaUrl, supaService, { auth: { persistSession: false } });

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata || {};
      const merchId = meta.merch_id;
      const qty = parseInt(meta.quantity || "1", 10);

      await supa
        .from("merch_orders")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent: session.payment_intent as string || null,
          buyer_email: session.customer_details?.email || null,
          shipping_address: session.customer_details?.address
            ? JSON.parse(JSON.stringify(session.customer_details.address))
            : null,
        })
        .eq("stripe_session_id", session.id);

      // Decrement stock
      if (merchId) {
        const { data: prod } = await supa
          .from("merch")
          .select("stock")
          .eq("id", merchId)
          .maybeSingle();
        if (prod && prod.stock !== null) {
          const newStock = Math.max(0, prod.stock - qty);
          await supa.from("merch").update({ stock: newStock }).eq("id", merchId);
        }
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      await supa
        .from("merch_orders")
        .update({ status: "failed" })
        .eq("stripe_session_id", session.id);
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("[merch-webhook] error:", e);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}