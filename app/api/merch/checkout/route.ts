import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json(
        { error: "Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local." },
        { status: 500 }
      );
    }

    let body: { merchId?: string; quantity?: number } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const { merchId, quantity } = body;
    if (!merchId) {
      return NextResponse.json({ error: "Missing merchId" }, { status: 400 });
    }

    const qty = Math.max(1, Math.min(10, Number(quantity) || 1));

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: product, error: prodErr } = await supabase
      .from("merch")
      .select("id, artist_id, title, description, price_pence, currency, stock, is_active, image_url")
      .eq("id", merchId)
      .maybeSingle();

    if (prodErr || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!product.is_active) {
      return NextResponse.json({ error: "Product is not available" }, { status: 400 });
    }
    if (product.stock !== null && product.stock < qty) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    const stripe = new Stripe(key);

    const origin =
      process.env.NEXT_PUBLIC_ROOT_URL ||
      req.headers.get("origin") ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: qty,
          price_data: {
            currency: (product.currency || "GBP").toLowerCase(),
            unit_amount: product.price_pence,
            product_data: {
              name: product.title,
              description: product.description || undefined,
              images: product.image_url ? [product.image_url] : undefined,
            },
          },
        },
      ],
      success_url: origin + "/merch/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/merch/cancel?session_id={CHECKOUT_SESSION_ID}",
      customer_email: user?.email || undefined,
      metadata: {
        merch_id: product.id,
        artist_id: product.artist_id,
        buyer_id: user?.id || "",
        quantity: String(qty),
      },
    });

    // Pre-create the pending order row
    try {
      await supabase.from("merch_orders").insert({
        buyer_id: user?.id || null,
        artist_id: product.artist_id,
        merch_id: product.id,
        quantity: qty,
        amount_pence: product.price_pence * qty,
        currency: product.currency || "GBP",
        status: "pending",
        stripe_session_id: session.id,
        buyer_email: user?.email || null,
      });
    } catch (e) {
      console.error("[merch-checkout] could not pre-create order:", e);
    }

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (e) {
    console.error("[merch-checkout] error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Checkout failed" },
      { status: 500 }
    );
  }
}