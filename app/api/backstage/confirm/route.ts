import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { syncBackstageSub } from "@/lib/backstage/server";

export const dynamic = "force-dynamic";

// POST /api/backstage/confirm { sessionId }: back from Stripe, unlock straight away.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { sessionId } = await req.json().catch(() => ({}));
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) return NextResponse.json({ error: "Bad session" }, { status: 400 });
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== user.id || session.metadata?.type !== "backstage") return NextResponse.json({ error: "Not your payment" }, { status: 403 });
  if (session.subscription) {
    const id = typeof session.subscription === "string" ? session.subscription : session.subscription.id;
    await syncBackstageSub(await stripe.subscriptions.retrieve(id));
  }
  return NextResponse.json({ ok: true });
}
