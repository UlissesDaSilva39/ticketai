import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const { data: campaign, error: cErr } = await supabase
    .from("campaigns")
    .select("id, name, tracking_code, budget, daily_budget, clicks, conversions, revenue, organizer_id")
    .eq("id", id)
    .single();

  if (cErr || !campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (campaign.organizer_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: events } = await supabase
    .from("campaign_events")
    .select("id, type, revenue, order_id, created_at, referrer, user_agent, visitor_id")
    .eq("campaign_id", id)
    .order("created_at", { ascending: false })
    .limit(200);

  const allEvents = events ?? [];
  const clicks = allEvents.filter((e) => e.type === "click");
  const conversions = allEvents.filter((e) => e.type === "conversion");

  const orderIds = conversions.map((c) => c.order_id).filter((v): v is string => Boolean(v));

  let orders: Array<{ id: string; total_amount: number; status: string; created_at: string }> = [];
  if (orderIds.length > 0) {
    const { data: orderRows } = await supabase
      .from("orders")
      .select("id, total_amount, status, created_at")
      .in("id", orderIds)
      .order("created_at", { ascending: false });
    orders = orderRows ?? [];
  }

  const clickCount = campaign.clicks || clicks.length;
  const conversionCount = campaign.conversions || conversions.length;
  const totalRevenue = Number(campaign.revenue || 0);
  const spend = Number(campaign.budget || 0);

  const conversionRate = clickCount > 0 ? conversionCount / clickCount : 0;
  const roas = spend > 0 ? totalRevenue / spend : 0;
  const costPerTicket = conversionCount > 0 ? spend / conversionCount : 0;
  const aov = conversionCount > 0 ? totalRevenue / conversionCount : 0;

  const referrerCounts: Record<string, number> = {};
  for (const c of clicks) {
    const r = c.referrer || "direct";
    referrerCounts[r] = (referrerCounts[r] || 0) + 1;
  }

  const referrers = Object.entries(referrerCounts).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count).slice(0, 10);

  return NextResponse.json({
    campaign: {
      id: campaign.id,
      name: campaign.name,
      tracking_code: campaign.tracking_code,
      budget: spend,
      daily_budget: campaign.daily_budget,
    },
    metrics: {
      clicks: clickCount,
      conversions: conversionCount,
      revenue: totalRevenue,
      spend,
      conversionRate,
      roas,
      costPerTicket,
      aov,
    },
    orders,
    recentClicks: clicks.slice(0, 20).map((c) => ({
      id: c.id,
      created_at: c.created_at,
      referrer: c.referrer,
      user_agent: c.user_agent,
      visitor_id: c.visitor_id,
    })),
    referrers,
  });
}
