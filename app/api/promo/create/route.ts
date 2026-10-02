import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const { campaignId, code, discount_type, discount_value, max_uses, expires_at } = (body ?? {}) as {
      campaignId?: string;
      code?: string;
      discount_type?: "percent" | "fixed";
      discount_value?: number;
      max_uses?: number | null;
      expires_at?: string | null;
    };

    if (!campaignId) return NextResponse.json({ error: "campaignId required" }, { status: 400 });
    if (!code || !code.trim()) return NextResponse.json({ error: "Code required" }, { status: 400 });
    if (!discount_type || !["percent", "fixed"].includes(discount_type)) {
      return NextResponse.json({ error: "Invalid discount type" }, { status: 400 });
    }
    if (!discount_value || discount_value <= 0) {
      return NextResponse.json({ error: "Discount value must be positive" }, { status: 400 });
    }
    if (discount_type === "percent" && discount_value > 100) {
      return NextResponse.json({ error: "Percent discount cannot exceed 100" }, { status: 400 });
    }

    const { data: campaign } = await supabase
      .from("campaigns")
      .select("id, organizer_id, event_id")
      .eq("id", campaignId)
      .single();

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    if (campaign.organizer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const normalized = code.trim().toUpperCase();

    const { data: existing } = await supabase
      .from("promo_codes")
      .select("id")
      .eq("code", normalized)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "This code is already in use" }, { status: 409 });
    }

    const { data, error } = await supabase
      .from("promo_codes")
      .insert({
        code: normalized,
        campaign_id: campaignId,
        event_id: campaign.event_id,
        discount_type,
        discount_value: Number(discount_value),
        max_uses: max_uses ?? null,
        expires_at: expires_at || null,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ promo: data });
  } catch (err) {
    console.error("Promo create error:", err);
    const message = err instanceof Error ? err.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}