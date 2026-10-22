import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(venues);
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return NextResponse.json({ error: 'Failed to fetch venues' }, { status: 500 });
  }
}
