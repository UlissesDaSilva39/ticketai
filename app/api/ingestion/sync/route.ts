import { NextRequest, NextResponse } from 'next/server';
import { runTicketmasterSync } from '@/lib/ingestion';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const source = body.source ?? 'ticketmaster';
    const maxResults = Math.min(Number(body.maxResults ?? 20), 100);

    if (source !== 'ticketmaster') {
      return NextResponse.json({ error: 'Only ticketmaster supported so far' }, { status: 400 });
    }

    const result = await runTicketmasterSync(maxResults);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    hint: 'POST with { source: "ticketmaster", maxResults: 20 }',
    requires: 'TICKETMASTER_API_KEY in .env.local',
  });
}