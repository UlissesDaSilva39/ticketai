import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'London';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  try {
    // Fetch top 4 results for each category to show in the overview
    const [artistsRes, venuesRes, eventsRes] = await Promise.all([
      fetch(`https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${query}&classificationName=music&size=4`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${API_KEY}&keyword=${query}&size=4`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${query}&size=4&sort=date,asc`, { next: { revalidate: 3600 } })
    ]);

    const [artistsData, venuesData, eventsData] = await Promise.all([
      artistsRes.json(), venuesRes.json(), eventsRes.json()
    ]);

    const artists = (artistsData._embedded?.attractions || []).map((a: any) => ({
      id: a.id, name: a.name,
      image: a.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
      genre: a.classifications?.[0]?.genre?.name || 'Music'
    }));

    const venues = (venuesData._embedded?.venues || []).map((v: any) => ({
      id: v.id, name: v.name, city: v.city?.name || 'Global',
      image: v.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80'
    }));

    const events = (eventsData._embedded?.events || []).map((e: any) => ({
      id: e.id, name: e.name,
      image: e.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80',
      date: new Date(e.dates.start.localDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      venue: e._embedded?.venues?.[0]?.name || 'Venue TBA', tmUrl: e.url
    }));

    return NextResponse.json({ artists, venues, events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}