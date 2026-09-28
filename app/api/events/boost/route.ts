import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

const TIERS: Record<string, { days: number; price: number; label: string }> = {
  "7day": { days: 7, price: 999, label: "7-Day Boost" },
  "30day": { days: 30, price: 2499, label: "30-Day Boost" },
  "90day": { days: 90, price: 5999, label: "90-Day Boost" },
};

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { eventId, tier } = await req.json();
    if (!eventId || !tier) return NextResponse.json({ error: "eventId and tier required" }, { status: 400 });

    const tierConfig = TIERS[tier];
    if (!tierConfig) return NextResponse.json({ error: "Invalid tier" }, { status: 400 });

    const { data: event } = await supabase
      .from("events")
      .select("id, title, organizer_id")
      .eq("id", eventId)
      .eq("organizer_id", user.id)
      .maybeSingle();

    if (!event) return NextResponse.json({ error: "Event not found or not yours" }, { status: 404 });

    const origin = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: tierConfig.label + ": " + event.title },
            unit_amount: tierConfig.price,
          },
          quantity: 1,
        },
      ],
      success_url: origin + "/organizer?boost=success",
      cancel_url: origin + "/organizer/events/" + eventId + "/boost",
      customer_email: user.email || undefined,
      metadata: {
        type: "boost",
        eventId: eventId,
        organizerId: user.id,
        tier: tier,
        days: String(tierConfig.days),
        price: (tierConfig.price / 100).toFixed(2),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Boost error:", err);
    const message = err instanceof Error ? err.message : "Boost failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
