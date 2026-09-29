import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data } = await admin
    .from("tickets")
    .select("seat_label")
    .eq("event_id", id)
    .in("status", ["valid", "used"])
    .not("seat_label", "is", null);
  return NextResponse.json({ seats: (data ?? []).map((t) => t.seat_label) });
}