import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const { merchId, artistId } = await req.json();

    if (!merchId || !artistId) {
      return NextResponse.json(
        { error: "Missing merchId or artistId" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();

    // Optional: log the enquiry (requires an `merch_enquiries` table).
    // Fails silently if the table doesn't exist so the endpoint always
    // returns success to the buyer.
    try {
      await supabase.from("merch_enquiries").insert({
        merch_id: merchId,
        artist_id: artistId,
      });
    } catch {
      // ignore — logging is best-effort
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}