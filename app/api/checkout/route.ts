 import { createClient as createAdminClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { stripe } from "@/lib/stripe";

function inferChannel(ref: string | null): string {
  if (!ref) return "Direct";
  const r = ref.toLowerCase();
  if (r.includes("instagram.com")) return "Instagram";
  if (r.includes("facebook.com") || r.includes("fb.com") || r.includes("l.facebook.com")) return "Facebook";
  if (r.includes("google.com") || r.includes("googleadservices.com")) return "Google";
  if (r.includes("tiktok.com")) return "TikTok";
  if (r.includes("twitter.com") || r.includes("t.co") || r.includes("x.com")) return "Twitter/X";
  if (r.includes("mail.google.com") || r.includes("outlook.com") || r.includes("mail.yahoo.com")) return "Email";
  return "Organic";
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { eventId, tickets, seats, campaignCode, promoCode } = await req.json();

    let campaignId: string | null = null;
    if (campaignCode) {
      const { data: c } = await supabase
        .from("campaigns")
        .select("id")
        .eq("tracking_code", campaignCode)
        .maybeSingle();
      if (c) campaignId = c.id;
    }

    // Validate promo code (server-side)
    let promo: { id: string; code: string; discount_type: string; discount_value: number } | null = null;
    if (promoCode) {
      const normalized = String(promoCode).trim().toUpperCase();
      const { data: p } = await supabase
        .from("promo_codes")
        .select("id, code, discount_type, discount_value, max_uses, times_used, expires_at, active, event_id")
        .eq("code", normalized)
        .eq("active", true)
        .maybeSingle();

      if (p) {
        const expired = p.expires_at && new Date(p.expires_at) < new Date();
        const exhausted = p.max_uses != null && p.times_used >= p.max_uses;
        const wrongEvent = p.event_id && p.event_id !== eventId;
        if (!expired && !exhausted && !wrongEvent) {
          promo = {
            id: p.id,
            code: p.code,
            discount_type: p.discount_type,
            discount_value: Number(p.discount_value),
          };
        }
      }
    }

    const channel = inferChannel(req.headers.get("referer"));

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

    const discountAmount = promo
      ? promo.discount_type === "percent"
        ? subtotal * (promo.discount_value / 100)
        : Math.min(promo.discount_value, subtotal)
      : 0;

    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const processingFee = discountedSubtotal * 0.029;
    const platformFee = discountedSubtotal * 0.02;

    // Apply discount via a Stripe coupon (Stripe rejects negative
    // unit_amount in price_data)
    let discountsParam: Array<{ coupon: string }> | undefined;
    if (discountAmount > 0 && promo) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "gbp",
        duration: "once",
        name: "Discount (" + promo.code + ")",
      });
      discountsParam = [{ coupon: coupon.id }];
    }

    const origin = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts: discountsParam,
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
        discountAmount: discountAmount.toFixed(2),
        discountedSubtotal: discountedSubtotal.toFixed(2),
        discountedTotal: (discountedSubtotal + processingFee).toFixed(2),
        processingFee: processingFee.toFixed(2),
        platformFee: platformFee.toFixed(2),
        campaignId: campaignId || "",
        campaignCode: campaignCode || "",
        channel: channel,
        promoCode: promo ? promo.code : "",
      },
    });

    // Increment promo usage
    if (promo) {
      const admin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await admin
        .from("promo_codes")
        .update({ times_used: (await admin.from("promo_codes").select("times_used").eq("id", promo.id).single()).data?.times_used + 1 })
        .eq("id", promo.id);
    }

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}