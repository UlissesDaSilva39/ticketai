import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { markAdPaid } from "@/lib/ads/server";

export const dynamic = "force-dynamic";

// POST /api/ads/confirm { sessionId }: back from Stripe; the campaign goes to review.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { sessionId } = await req.json().catch(() => ({}));
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) return NextResponse.json({ error: "Bad session" }, { status: 400 });
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== user.id) return NextResponse.json({ error: "Not your payment" }, { status: 403 });
  const row = await markAdPaid(session);
  return NextResponse.json({ status: row?.status ?? "pending_payment" });
}
