import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify the remix request exists and user is involved
    const { data: remix, error: remixErr } = await supabase
      .from("remix_requests")
      .select("*")
      .eq("id", id)
      .single();
      
    if (remixErr || !remix) return NextResponse.json({ error: "Remix not found" }, { status: 404 });
    if (remix.status !== "released") {
      return NextResponse.json({ error: "Can only log revenue for released remixes" }, { status: 400 });
    }

    const body = await req.json();
    const { amount_cents, source, notes } = body;

    if (!amount_cents || amount_cents <= 0) {
      return NextResponse.json({ error: "Valid amount_cents required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("revenue_ledger")
      .insert({
        remix_request_id: id,
        logged_by: user.id,
        amount_cents,
        source: source || "sale",
        notes,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, entry: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}