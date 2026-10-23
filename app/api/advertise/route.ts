import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Simulate saving to database
    console.log('New Advertise Lead:', { name, email, company, message });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Advertise Error:', error.message);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}