import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const keyword = searchParams.get('keyword') || 'London';
  
  const API_KEY = process.env.TICKETMASTER_API_KEY || 'YOUR_API_KEY_HERE'; 

  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
      console.error("MISSING API KEY: Please add TICKETMASTER_API_KEY to your .env.local file");
      return NextResponse.json({ error: 'API Key missing' }, { status: 401 });
  }

  try {
    let url = '';
    if (id) {
      url = `https://app.ticketmaster.com/discovery/v2/attractions/${id}.json?apikey=${API_KEY}`;
    } else {
      url = `https://app.ticketmaster.com/discovery/v2/attractions.json?apikey=${API_KEY}&keyword=${keyword}&classificationName=music&size=24`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    // Log the status to the terminal so we can see it
    console.log(`Ticketmaster API Response: ${res.status} for URL: ${url}`);

    if (!res.ok) {
        const errText = await res.text();
        console.error("Ticketmaster API Error:", errText);
        throw new Error(`Ticketmaster API failed with status ${res.status}`);
    }

    const data = await res.json();

    if (id) {
      if (!data || !data.name) {
          console.error("Ticketmaster returned no data for ID:", id);
          throw new Error("Artist data empty");
      }

      const artist = data;
      const image = artist.images?.find((img: any) => img.ratio === '16_9' && img.width > 800)?.url 
                 || artist.images?.[0]?.url 
                 || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80';

      return NextResponse.json({
        id: artist.id,
        name: artist.name,
        genre: artist.classifications?.[0]?.genre?.name || 'Music',
        bio: artist.info || artist.pleaseNote || `Upcoming shows and tours for ${artist.name}.`,
        image: image,
        tmUrl: artist.url || `https://www.ticketmaster.com/artist/${artist.id}`,
        verified: true
      });
    } else {
      const attractions = data._embedded?.attractions || [];
      const formattedArtists = attractions.map((artist: any) => {
        const image = artist.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url 
                   || artist.images?.[0]?.url 
                   || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80';

        return {
          id: artist.id,
          name: artist.name,
          genre: artist.classifications?.[0]?.genre?.name || 'Music',
          followers: Math.floor(Math.random() * 50000) + 1000, 
          image: image,
          verified: true, 
        };
      });
      return NextResponse.json({ artists: formattedArtists });
    }
  } catch (error: any) {
    console.error("API Route Catch Block Error:", error.message);
    return NextResponse.json({ error: error.message || 'Failed to fetch' }, { status: 500 });
  }
}