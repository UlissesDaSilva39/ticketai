import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'London';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  try {
    // Fetch events by city keyword, sorted by date
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&classificationName=music&size=24&sort=date,asc`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
        console.error("TM API Error:", res.status);
        throw new Error('Ticketmaster API failed');
    }
    
    const data = await res.json();
    const events = data._embedded?.events || [];

    const formatted = events.map((e: any) => {
      // Get the best image
      const image = e.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url 
                 || e.images?.[0]?.url 
                 || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80';

      // Format date
      const eventDate = new Date(e.dates.start.localDate);
      const dateString = eventDate.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      const timeString = e.dates.start.localTime ? e.dates.start.localTime.substring(0, 5) : '19:00';

      return {
        id: e.id,
        name: e.name,
        date: `${dateString} · ${timeString}`,
        venue: e._embedded?.venues?.[0]?.name || 'TBA',
        city: e._embedded?.venues?.[0]?.city?.name || 'Unknown',
        image: image,
        tmUrl: e.url, // Direct Ticketmaster link
        priceMin: e.priceRanges?.[0]?.min || null,
        priceMax: e.priceRanges?.[0]?.max || null,
      };
    });

    return NextResponse.json({ events: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}