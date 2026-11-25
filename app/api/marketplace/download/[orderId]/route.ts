import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MARKETPLACE_BUCKET } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// GET /api/marketplace/download/<orderId>: the buyer of a paid order gets a
// short-lived signed link to the product file.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data: order } = await admin.from("marketplace_orders").select("listing_id, buyer_id, status").eq("id", orderId).maybeSingle();
  if (!order || order.buyer_id !== user.id || order.status !== "paid") return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: file } = await admin.from("marketplace_listing_files").select("file_path, file_name").eq("listing_id", order.listing_id).maybeSingle();
  if (!file) return NextResponse.json({ error: "This item has no download." }, { status: 404 });

  const { data, error } = await admin.storage.from(MARKETPLACE_BUCKET).createSignedUrl(file.file_path, 120, { download: file.file_name });
  if (error || !data) return NextResponse.json({ error: "Download unavailable. Please try again." }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
