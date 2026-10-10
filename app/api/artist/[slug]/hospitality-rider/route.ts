import { NextResponse } from 'next/server';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return new NextResponse(`Hospitality rider for ${slug} — coming soon`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
