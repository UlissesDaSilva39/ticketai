import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { venueId, venueName, tierName, price } = body;

    if (!venueId || !tierName) {
      return NextResponse.json({ error: 'Missing venueId or tierName' }, { status: 400 });
    }

    // Free tier logic (No Stripe needed)
    if (tierName === 'Supporter') {
      return NextResponse.json({ url: '/discover/venues?success=free' });
    }

    // Pro / VIP tier logic (Create Stripe Session)
    const session = await stripe.checkout.sessions.create({
      payment_method_data: { allow_redirects: 'never' } as any,
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: venueName + ' - ' + tierName,
              description: 'Monthly membership for ' + venueName,
            },
            unit_amount: price * 100, // Convert £ to pence
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      success_url: process.env.NEXT_PUBLIC_APP_URL + '/discover/venues?success=true&venue=' + venueId + '&tier=' + tierName,
      cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/discover/venues?canceled=true',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

