import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

type IncomingItem = {
  id: string;
  name: string;
  price: number;   // in pence
  quantity: number;
  size?: string;
};

export async function POST(req: Request) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { items } = (await req.json()) as { items: IncomingItem[] };

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (!STRIPE_SECRET) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.' },
      { status: 500 }
    );
  }

  // Lazily import Stripe so the build doesn't fail without the SDK
  const Stripe = (await import('stripe')).default;
  const stripe = new Stripe(STRIPE_SECRET);

  const origin =
    process.env.NEXT_PUBLIC_URL ??
    req.headers.get('origin') ??
    'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((it) => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: it.name,
            metadata: { size: it.size ?? '' },
          },
          unit_amount: it.price,
        },
        quantity: it.quantity,
      })),
      success_url: `${origin}/merch/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/artists`,
      metadata: {
        userId: user.id,
        itemCount: String(items.length),
      },
    });

    return NextResponse.json({ ok: true, url: session.url, sessionId: session.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}