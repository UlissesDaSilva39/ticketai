import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProStatus, syncSubscription } from "@/lib/pro";

export const dynamic = "force-dynamic";

// Called by /pro after Stripe Checkout returns, so Pro switches on immediately
// even before (or without) the Stripe webhook arriving.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { sessionId } = await req.json().catch(() => ({}));
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["subscription"] });
  // Only the member who started this checkout can confirm it.
  if (session.client_reference_id !== user.id || session.metadata?.type !== "pro") {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.subscription && typeof session.subscription !== "string") {
    await syncSubscription(session.subscription, user.id);
  }
  return NextResponse.json({ pro: await getProStatus(user.id) });
}
