import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { payoutId, status, reference, notes, method } = await req.json();

    if (!payoutId || !status) {
      return NextResponse.json({ error: "Missing payoutId or status" }, { status: 400 });
    }

    const update: Record<string, unknown> = { status };
    if (reference) update.reference = reference;
    if (notes) update.notes = notes;
    if (method) update.method = method;
    if (status === "paid") update.paid_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("promoter_payouts")
      .update(update)
      .eq("id", payoutId)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ payout: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
