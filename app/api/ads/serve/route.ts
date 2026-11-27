import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/ads/serve: one active sponsored card (Premium campaigns shown twice as often).
export async function GET() {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("ad_campaigns")
    .select("id, plan, headline, body, image_url, link_url")
    .eq("status", "active")
    .gt("ends_at", new Date().toISOString())
    .limit(50);
  if (error || !data?.length) return NextResponse.json({ ad: null }, { headers: { "cache-control": "no-store" } });
  const pool = data.flatMap((a) => (a.plan === "premium" ? [a, a] : [a]));
  const ad = pool[Math.floor(Math.random() * pool.length)];
  await admin.rpc("grid_ad_count", { p_id: ad.id, p_click: false });
  let host = "";
  try {
    host = new URL(ad.link_url).hostname.replace(/^www\./, "");
  } catch {}
  return NextResponse.json(
    { ad: { id: ad.id, headline: ad.headline, body: ad.body, imageUrl: ad.image_url, host } },
    { headers: { "cache-control": "no-store" } }
  );
}
