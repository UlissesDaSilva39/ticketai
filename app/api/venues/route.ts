import { NextResponse } from 'next/server';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'London';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Ticketmaster API key is missing', venues: [] }, { status: 500 });
  }

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${API_KEY}&keyword=${keyword}&size=24`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      return NextResponse.json({ error: `Ticketmaster API error: ${res.status}`, venues: [] }, { status: 500 });
    }
    
    const data = await res.json();
    const venues = data._embedded?.venues || [];
    
    const formatted = venues.map((v: any, index: number) => {
      let image = v.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url;
      if (!image || image.includes('ticketmaster.com')) {
        image = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
      }
      return {
        id: v.id,
        name: v.name,
        city: v.city?.name || 'Global',
        image: image,
      };
    });

    return NextResponse.json({ venues: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch', venues: [] }, { status: 500 });
  }
}