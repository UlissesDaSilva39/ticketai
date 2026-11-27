import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { currentUser, fulfilCoinSession } from "@/lib/live/server";

export const dynamic = "force-dynamic";

// POST /api/coins/confirm { sessionId }: credit coins as soon as the buyer returns
// from Stripe (the webhook does the same; whichever comes first wins, once).
export async function POST(req: NextRequest) {
  const { supabase, user } = await currentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { sessionId } = await req.json().catch(() => ({}));
  if (typeof sessionId !== "string" || !sessionId.startsWith("cs_")) return NextResponse.json({ error: "Invalid session" }, { status: 400 });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.client_reference_id !== user.id || session.metadata?.type !== "coins") {
    return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
  }
  const { credited } = await fulfilCoinSession(session);
  const { data } = await supabase.from("coin_wallets").select("balance_coins").eq("user_id", user.id).maybeSingle();
  return NextResponse.json({ credited, balance: data?.balance_coins ?? 0 });
}
