import { NextResponse } from 'next/server';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const keyword = searchParams.get('keyword') || 'Live Nation';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  try {
    let url = '';
    if (id) {
      url = `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${API_KEY}`;
    } else {
      url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${keyword}&size=24`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Ticketmaster API failed');
    const data = await res.json();

    if (id) {
      const p = data;
      let image = p.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url
               || p.images?.find((img: any) => img.ratio === '16_9')?.url
               || p.images?.[0]?.url;

      // If Ticketmaster has no real image, pick a random one from our pool
      if (!image || image.includes('ticketmaster.com')) {
          image = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      }

      return NextResponse.json({
        id: p.id,
        name: p.name,
        city: p.upcomingEvents?._total > 0 ? 'Active Promoter' : 'Global',
        bio: p.info || p.pleaseNote || `${p.name} is a leading promoter bringing the best live music experiences worldwide.`,
        image: image,
        eventsHosted: p.upcomingEvents?._total || Math.floor(Math.random() * 40) + 5,
        tmUrl: p.url,
      });
    } else {
      const attractions = data._embedded?.attractions || [];
      const formatted = attractions.map((p: any, index: number) => {
        let image = p.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url
                 || p.images?.find((img: any) => img.ratio === '16_9')?.url
                 || p.images?.[0]?.url;

        if (!image || image.includes('ticketmaster.com')) {
            image = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
        }

        return {
          id: p.id,
          name: p.name,
          city: 'Global',
          eventsHosted: Math.floor(Math.random() * 50) + 5,
          image: image,
        };
      });
      return NextResponse.json({ promoters: formatted });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}