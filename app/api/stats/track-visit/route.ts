import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  try {
    const admin = createAdminClient();

    const { data: current } = await admin
      .from("site_stats")
      .select("total_visits")
      .eq("id", "discover")
      .single();

    const newCount = Number(current?.total_visits || 0) + 1;

    await admin
      .from("site_stats")
      .update({ total_visits: newCount, updated_at: new Date().toISOString() })
      .eq("id", "discover");

    return NextResponse.json({ total_visits: newCount });
  } catch {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
