import { NextResponse } from 'next/server';

// In-memory waitlist store (replace with database in production)
const waitlists: Record<string, { email: string; joinedAt: string }[]> = {};

export async function POST(request: Request) {
  try {
    const { eventId, email } = await request.json();

    if (!eventId || !email) {
      return NextResponse.json({ error: 'Missing eventId or email' }, { status: 400 });
    }

    if (!waitlists[eventId]) {
      waitlists[eventId] = [];
    }

    // Check if already on the list
    const exists = waitlists[eventId].some(w => w.email === email);
    if (exists) {
      return NextResponse.json({ message: 'Already on the waitlist' }, { status: 200 });
    }

    waitlists[eventId].push({
      email,
      joinedAt: new Date().toISOString(),
    });

    console.log(`[Waitlist] ${email} joined waitlist for event ${eventId}`);
    console.log(`[Waitlist] Total on list: ${waitlists[eventId].length}`);

    return NextResponse.json({ message: 'Added to waitlist', position: waitlists[eventId].length }, { status: 200 });
  } catch (error) {
    console.error('[Waitlist] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get('eventId');

  if (!eventId) {
    return NextResponse.json({ error: 'Missing eventId' }, { status: 400 });
  }

  return NextResponse.json({ count: (waitlists[eventId] || []).length });
}
