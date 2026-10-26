import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'London';
  const genre = searchParams.get('genre') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  let baseParams = `apikey=${API_KEY}&size=10`;
  if (query) baseParams += `&keyword=${query}`;
  if (genre) baseParams += `&classificationName=${genre}`;
  if (maxPrice) baseParams += `&maxPrice=${maxPrice}`;

  try {
    const [artistsRes, eventsRes, venuesRes, promotersRes, festivalsRes, labelsRes] = await Promise.all([
      fetch(`https://app.ticketmaster.com/discovery/v2/attractions.json?${baseParams}`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${baseParams}&sort=date,asc`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/venues.json?${baseParams}`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/attractions.json?${baseParams}&keyword=${query}%20promoter`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${baseParams}&keyword=${query}%20festival`, { next: { revalidate: 3600 } }),
      fetch(`https://app.ticketmaster.com/discovery/v2/attractions.json?${baseParams}&keyword=${query}%20records`, { next: { revalidate: 3600 } })
    ]);

    const [artistsData, eventsData, venuesData, promotersData, festivalsData, labelsData] = await Promise.all([
      artistsRes.json(), eventsRes.json(), venuesRes.json(), promotersRes.json(), festivalsRes.json(), labelsRes.json()
    ]);

    const formatImage = (imgArray: any[], fallback: string) => 
      imgArray?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url 
      || imgArray?.[0]?.url 
      || fallback;

    // Add simulated urgency logic (In real app, compare dates to today)
    const isUrgent = (dateStr: string) => {
        if (!dateStr) return false;
        const eventDate = new Date(dateStr).getTime();
        const today = new Date().getTime();
        const days = (eventDate - today) / (1000 * 3600 * 24);
        return days > 0 && days < 14; // Events in the next 2 weeks
    };

    const artists = (artistsData._embedded?.attractions || []).map((a: any) => ({
      id: a.id, name: a.name, genre: a.classifications?.[0]?.genre?.name || 'Music',
      image: formatImage(a.images, 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80')
    }));

    const events = (eventsData._embedded?.events || []).map((e: any) => ({
      id: e.id, name: e.name,
      image: formatImage(e.images, 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80'),
      date: new Date(e.dates.start.localDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      venue: e._embedded?.venues?.[0]?.name || 'Venue TBA', tmUrl: e.url,
      price: e.priceRanges?.[0]?.min,
      isUrgent: isUrgent(e.dates.start.localDate),
      status: e.dates.status?.code || 'onsale' // onsale, offsale, cancelled
    }));

    const venues = (venuesData._embedded?.venues || []).map((v: any) => ({
      id: v.id, name: v.name, city: v.city?.name || 'Global',
      image: formatImage(v.images, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80')
    }));

    const promoters = (promotersData._embedded?.attractions || []).map((p: any) => ({
      id: p.id, name: p.name, city: 'Global',
      image: formatImage(p.images, 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80'),
      verified: true // We mark these as verified because they come from TM
    }));

    const festivals = (festivalsData._embedded?.events || []).map((f: any) => ({
      id: f.id, name: f.name,
      image: formatImage(f.images, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80'),
      date: new Date(f.dates.start.localDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      venue: f._embedded?.venues?.[0]?.name || 'Festival TBA', tmUrl: f.url
    }));

    const labels = (labelsData._embedded?.attractions || []).map((l: any) => ({
      id: l.id, name: l.name, city: 'Global',
      image: formatImage(l.images, 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80')
    }));

    return NextResponse.json({ artists, events, venues, promoters, festivals, labels });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}