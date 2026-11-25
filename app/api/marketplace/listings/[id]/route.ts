import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MAX_PRICE_PENCE, MIN_PRICE_PENCE } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

// PATCH /api/marketplace/listings/<id>: the seller edits their listing
// (title, description, price, pay-what-you-want, status live/paused/deleted).
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const admin = createAdminClient();
  const { data: listing } = await admin.from("marketplace_listings").select("seller_id, status").eq("id", id).maybeSingle();
  if (!listing || listing.seller_id !== user.id || listing.status === "deleted") return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (title.length < 3 || title.length > 120) return NextResponse.json({ error: "Title must be 3–120 characters." }, { status: 400 });
    patch.title = title;
  }
  if (body.description !== undefined) {
    const description = String(body.description ?? "").trim();
    if (description.length > 2000) return NextResponse.json({ error: "Description is too long." }, { status: 400 });
    patch.description = description || null;
  }
  if (body.pricePence !== undefined) {
    const p = Math.round(Number(body.pricePence));
    if (!Number.isFinite(p) || p < MIN_PRICE_PENCE || p > MAX_PRICE_PENCE) return NextResponse.json({ error: "Price must be between £1 and £5,000." }, { status: 400 });
    patch.price_pence = p;
  }
  if (body.payWhatYouWant !== undefined) patch.pay_what_you_want = body.payWhatYouWant === true;
  if (body.status !== undefined) {
    if (!["active", "paused", "deleted"].includes(body.status)) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    patch.status = body.status;
  }

  const { error } = await admin.from("marketplace_listings").update(patch).eq("id", id).eq("seller_id", user.id);
  if (error) return NextResponse.json({ error: "Could not save your changes." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
