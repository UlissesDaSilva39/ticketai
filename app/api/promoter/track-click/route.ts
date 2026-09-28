import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "referralCode required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: pe } = await supabase
      .from("promoter_events")
      .select("id, clicks")
      .eq("referral_code", referralCode)
      .maybeSingle();

    if (pe) {
      await supabase
        .from("promoter_events")
        .update({ clicks: Number(pe.clicks || 0) + 1 })
        .eq("id", pe.id);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
