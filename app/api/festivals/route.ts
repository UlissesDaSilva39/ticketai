import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'Festival';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  try {
    // We query events but explicitly search for "Festival" to get festival data
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&classificationName=music&size=24&sort=date,asc`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Ticketmaster API failed');
    
    const data = await res.json();
    const events = data._embedded?.events || [];

    const formatted = events.map((e: any) => {
      // 1. Get the best image
      const image = e.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url 
                 || e.images?.[0]?.url 
                 || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80';

      // 2. Safely format the date and time
      let dateString = 'Date TBA';
      if (e.dates?.start?.localDate) {
        const dateObj = new Date(e.dates.start.localDate);
        dateString = dateObj.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
      }

      return {
        id: e.id,
        name: e.name,
        date: dateString,
        venue: e._embedded?.venues?.[0]?.name || 'Location TBA',
        city: e._embedded?.venues?.[0]?.city?.name || 'City TBA',
        image: image,
        tmUrl: e.url, 
        priceMin: e.priceRanges?.[0]?.min || null,
      };
    });

    return NextResponse.json({ festivals: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch festivals' }, { status: 500 });
  }
}