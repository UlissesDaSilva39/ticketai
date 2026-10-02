import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const { code, eventId } = (body ?? {}) as {
      code?: string;
      eventId?: string;
    };

    if (!code || !eventId) {
      return NextResponse.json(
        { valid: false, error: "Code and event are required" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const normalized = code.trim().toUpperCase();

    const { data: promo } = await supabase
      .from("promo_codes")
      .select("id, code, discount_type, discount_value, max_uses, times_used, expires_at, active, event_id, campaign_id")
      .eq("code", normalized)
      .eq("active", true)
      .maybeSingle();

    if (!promo) {
      return NextResponse.json(
        { valid: false, error: "Invalid promo code" },
        { status: 200 }
      );
    }

    if (promo.event_id && promo.event_id !== eventId) {
      return NextResponse.json(
        { valid: false, error: "This code is not valid for this event" },
        { status: 200 }
      );
    }

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return NextResponse.json(
        { valid: false, error: "This code has expired" },
        { status: 200 }
      );
    }

    if (promo.max_uses != null && promo.times_used >= promo.max_uses) {
      return NextResponse.json(
        { valid: false, error: "This code has reached its usage limit" },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      promo: {
        id: promo.id,
        code: promo.code,
        discount_type: promo.discount_type,
        discount_value: Number(promo.discount_value),
        campaign_id: promo.campaign_id,
      },
    });
  } catch (err) {
    console.error("Promo validate error:", err);
    const message = err instanceof Error ? err.message : "Failed to validate";
    return NextResponse.json({ valid: false, error: message }, { status: 500 });
  }
}