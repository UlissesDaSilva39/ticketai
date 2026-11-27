import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

// POST /api/admin/ads/<id> { action: "approve" | "reject", note }: admins review paid ads.
// Approve starts the campaign now; reject refunds the advertiser in full.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;
  const { action, note } = await req.json().catch(() => ({}));
  const admin = createAdminClient();
  const { data: c } = await admin.from("ad_campaigns").select("id, status, days, stripe_session_id").eq("id", id).maybeSingle();
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (c.status !== "in_review") return NextResponse.json({ error: `This campaign is ${c.status.replace("_", " ")}.` }, { status: 409 });

  if (action === "approve") {
    const now = new Date();
    await admin
      .from("ad_campaigns")
      .update({ status: "active", starts_at: now.toISOString(), ends_at: new Date(now.getTime() + c.days * 86400000).toISOString(), review_note: null })
      .eq("id", id)
      .eq("status", "in_review");
    return NextResponse.json({ ok: true, status: "active" });
  }
  if (action === "reject") {
    try {
      if (c.stripe_session_id) {
        const s = await stripe.checkout.sessions.retrieve(c.stripe_session_id);
        const pi = typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id;
        if (pi) await stripe.refunds.create({ payment_intent: pi });
      }
    } catch (e) {
      return NextResponse.json({ error: `Refund failed: ${e instanceof Error ? e.message : e}` }, { status: 502 });
    }
    await admin
      .from("ad_campaigns")
      .update({ status: "rejected", review_note: typeof note === "string" ? note.slice(0, 300) : null })
      .eq("id", id)
      .eq("status", "in_review");
    return NextResponse.json({ ok: true, status: "rejected" });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
