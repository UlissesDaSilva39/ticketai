import { NextResponse } from 'next/server';

// Expanded pool of REAL venue photos (clubs, warehouses, theatres, bars)
const FALLBACK_IMAGES = [
  // Club / Nightclub interiors
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
  'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
  'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800&q=80',
  'https://images.unsplash.com/photo-1571266028243-d220bc9c8a1a?w=800&q=80',
  
  // Live music / concerts
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
  'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
  
  // Theatres / Concert halls
  'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=80',
  
  // Warehouse / Industrial spaces
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
  
  // Bars / Pubs with stages
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80',
  'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=800&q=80',
  
  // Festival / Outdoor stages
  'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const keyword = searchParams.get('keyword') || 'London';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  try {
    let url = '';
    if (id) {
      url = `https://app.ticketmaster.com/discovery/v2/venues/${id}.json?apikey=${API_KEY}`;
    } else {
      url = `https://app.ticketmaster.com/discovery/v2/venues.json?apikey=${API_KEY}&keyword=${keyword}&size=24`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Ticketmaster API failed');
    const data = await res.json();

    if (id) {
      const venue = data;
      
      // Check if image is a fallback
      const img = venue.images?.find((i: any) => i.ratio === '16_9' && i.width > 500);
      let realImage = img?.url;
      
      // If no image OR it's marked as fallback, use our curated photo
      if (!realImage || img?.fallback === true) {
          realImage = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      }

      return NextResponse.json({
        id: venue.id,
        name: venue.name,
        city: venue.city?.name || 'Unknown City',
        address: venue.address?.line1 || 'Address unavailable',
        image: realImage,
        tmUrl: venue.url,
      });
    } else {
      const venues = data._embedded?.venues || [];
      
      const formatted = venues.map((v: any, index: number) => {
        const img = v.images?.find((i: any) => i.ratio === '16_9' && i.width > 500);
        let image = img?.url;
        
        // Replace fallbacks with unique curated images
        if (!image || img?.fallback === true) {
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
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}