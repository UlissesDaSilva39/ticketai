import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const campaignId = req.nextUrl.searchParams.get("campaignId");
    if (!campaignId) {
      return NextResponse.json({ error: "campaignId required" }, { status: 400 });
    }

    const { data: campaign } = await supabase
      .from("campaigns")
      .select("id, organizer_id")
      .eq("id", campaignId)
      .single();

    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    if (campaign.organizer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: promos, error } = await supabase
      .from("promo_codes")
      .select("id, code, discount_type, discount_value, max_uses, times_used, expires_at, active, created_at")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ promos: promos ?? [] });
  } catch (err) {
    console.error("Promo list error:", err);
    const message = err instanceof Error ? err.message : "Failed to list";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}