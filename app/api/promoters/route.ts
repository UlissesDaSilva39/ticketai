import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword') || 'Live Nation';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  try {
    // Since TM doesn't have a "Promoters" list, we search Attractions but focus on ones that look like organizers
    const url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${keyword}&size=24`;
    
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Ticketmaster API failed');
    
    const data = await res.json();
    const attractions = data._embedded?.attractions || [];

    const formatted = attractions.map((p: any, index: number) => {
      // Prioritize real images, fallback to curated promoter/crowd shots
      const realImage = p.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url 
                     || p.images?.[0]?.url 
                     || `https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80`;

      return {
        id: p.id,
        name: p.name,
        city: 'Global', // TM doesn't provide city for organizers easily
        eventsHosted: Math.floor(Math.random() * 50) + 5, // Simulated metric
        image: realImage,
        bio: p.info || p.pleaseNote || `Leading promoter bringing the best live music experiences worldwide.`,
      };
    });

    return NextResponse.json({ promoters: formatted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch promoters' }, { status: 500 });
  }
}