import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// GET /api/ads/click/<id>: counts the click, then sends the visitor to the advertiser's link.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.redirect(new URL("/", req.url));
  const admin = createAdminClient();
  const { data } = await admin.from("ad_campaigns").select("link_url, status").eq("id", id).maybeSingle();
  if (!data || data.status !== "active" || !data.link_url.startsWith("https://")) return NextResponse.redirect(new URL("/", req.url));
  await admin.rpc("grid_ad_count", { p_id: id, p_click: true });
  return NextResponse.redirect(data.link_url);
}
