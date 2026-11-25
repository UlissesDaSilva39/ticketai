import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { LICENCE_BUCKET } from "@/lib/licensing/server";

export const dynamic = "force-dynamic";

// GET /api/licensing/download/<dealId>: the licensee of an active licence (or the
// licensor) gets a short-lived signed link to the full-quality track.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ dealId: string }> }) {
  const { dealId } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  if (!/^[0-9a-f-]{36}$/i.test(dealId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data: deal } = await admin.from("licence_deals").select("listing_id, buyer_id, seller_id, status").eq("id", dealId).maybeSingle();
  if (!deal || deal.status !== "active" || (deal.buyer_id !== user.id && deal.seller_id !== user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: file } = await admin.from("licence_listing_files").select("file_path, file_name").eq("listing_id", deal.listing_id).maybeSingle();
  if (!file) return NextResponse.json({ error: "This track has no file yet." }, { status: 404 });

  const { data, error } = await admin.storage.from(LICENCE_BUCKET).createSignedUrl(file.file_path, 120, { download: file.file_name });
  if (error || !data) return NextResponse.json({ error: "Download unavailable. Please try again." }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
