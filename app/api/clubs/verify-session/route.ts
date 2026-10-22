import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) return NextResponse.json({ verified: false });

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return NextResponse.json({ verified: true, dev_mode: true });

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as any });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      verified: session.payment_status === "paid" || session.status === "complete",
      status: session.payment_status,
    });
  } catch {
    return NextResponse.json({ verified: false });
  }
}