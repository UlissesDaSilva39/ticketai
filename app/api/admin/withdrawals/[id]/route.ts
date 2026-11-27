import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { payWithStripe } from "@/lib/payouts";

export const dynamic = "force-dynamic";

// POST /api/admin/withdrawals/<id> { action: "stripe" | "manual" | "reject", note }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;
  const { action, note } = await req.json().catch(() => ({}));
  if (action === "stripe") {
    const r = await payWithStripe(id);
    return r.ok ? NextResponse.json({ ok: true, status: "paid" }) : NextResponse.json({ error: r.error }, { status: 409 });
  }
  if (action !== "manual" && action !== "reject") return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  const { data } = await createAdminClient()
    .from("marketplace_payouts")
    .update(action === "manual" ? { status: "paid", paid_at: new Date().toISOString(), method: "manual", note: typeof note === "string" ? note.slice(0, 300) : null } : { status: "rejected", note: typeof note === "string" ? note.slice(0, 300) : null })
    .eq("id", id)
    .eq("status", "requested")
    .select("id, status")
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "This withdrawal isn't waiting any more." }, { status: 409 });
  return NextResponse.json({ ok: true, status: data.status });
}
