import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/ads/mine: this member's campaigns with views and clicks.
export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { data, error } = await supabase
    .from("ad_campaigns")
    .select("id, plan, headline, body, image_url, link_url, amount_pence, status, review_note, days, starts_at, ends_at, impressions, clicks, created_at")
    .eq("owner_id", user.id)
    .neq("status", "pending_payment")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ campaigns: [], setupPending: true });
  return NextResponse.json({ campaigns: data ?? [] });
}
