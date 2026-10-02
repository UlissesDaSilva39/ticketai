import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data: promo } = await supabase
      .from("promo_codes")
      .select("id, campaign_id, campaigns:campaign_id (organizer_id)")
      .eq("id", id)
      .single();

    if (!promo) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const orgId = (promo as { campaigns?: { organizer_id?: string } }).campaigns?.organizer_id;
    if (orgId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase
      .from("promo_codes")
      .update({ active: false })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Promo delete error:", err);
    const message = err instanceof Error ? err.message : "Failed to deactivate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}