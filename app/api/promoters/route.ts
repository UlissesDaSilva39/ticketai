import { NextResponse } from 'next/server';

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
      // Promoters don't exist on TM, so we use attractions or organizations
      url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${keyword}&size=24`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Ticketmaster API failed');
    const data = await res.json();

    if (id) {
      const p = data;
      return NextResponse.json({
        id: p.id,
        name: p.name,
        city: 'Global',
        bio: p.info || p.pleaseNote || `Promoter profile for ${p.name}.`,
        image: p.images?.find((img: any) => img.ratio === '16_9')?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
        tmUrl: p.url,
      });
    } else {
      const items = data._embedded?.attractions || [];
      const formatted = items.map((p: any) => {
        return {
          id: p.id,
          name: p.name,
          city: 'Global',
          image: p.images?.find((img: any) => img.ratio === '16_9')?.url || p.images?.[0]?.url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
        };
      });
      return NextResponse.json({ promoters: formatted });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}