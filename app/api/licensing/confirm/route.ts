import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { fulfilLicenceSession } from "@/lib/licensing/server";

export const dynamic = "force-dynamic";

// POST /api/licensing/confirm { sessionId }: called when the licensee returns
// from Stripe, so the licence activates straight away even before the webhook.
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

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== user.id || session.metadata?.type !== "licence") {
    return NextResponse.json({ error: "Licence not found" }, { status: 404 });
  }

  const { dealId, active } = await fulfilLicenceSession(session);
  if (!dealId) return NextResponse.json({ error: "Licence not found" }, { status: 404 });
  return NextResponse.json({ dealId, active });
}
