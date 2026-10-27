import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || searchParams.get('city') || 'London';
  const API_KEY = process.env.TICKETMASTER_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API Key missing' }, { status: 401 });
  }

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${encodeURIComponent(keyword)}&classificationName=music&size=20`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Ticketmaster API failed: ${res.status}`);

    const data = await res.json();
    const items = data._embedded?.attractions || [];

    const formatted = items.map((item: any) => {
      const image = item.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url
        || item.images?.[0]?.url
        || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80';

      return {
        id: item.id,
        name: item.name,
        slug: item.id,
        genre: item.classifications?.[0]?.genre?.name || 'Music',
        city: item._embedded?.venues?.[0]?.city?.name || 'UK',
        image,
        avatar_url: image,
      };
    });

    return NextResponse.json({ data: formatted, count: formatted.length });
  } catch (error: any) {
    console.error('Attractions API Error:', error.message);
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 });
  }
}
