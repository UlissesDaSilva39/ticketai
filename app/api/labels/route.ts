import { NextResponse } from 'next/server';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80'
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const keyword = searchParams.get('keyword') || 'Records';
  
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
      const label = data;
      
      let image = label.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url
               || label.images?.find((img: any) => img.ratio === '16_9')?.url
               || label.images?.[0]?.url;

      if (!image || image.includes('ticketmaster.com')) {
          image = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
      }

      return NextResponse.json({
        id: label.id,
        name: label.name,
        city: 'Global',
        bio: label.info || label.pleaseNote || `${label.name} is an independent record label shaping the sound of the underground.`,
        image: image,
        tmUrl: label.url,
        verified: true
      });
    } else {
      const attractions = data._embedded?.attractions || [];
      const formatted = attractions.map((label: any, index: number) => {
        let image = label.images?.find((img: any) => img.ratio === '16_9' && img.width > 500)?.url
                 || label.images?.find((img: any) => img.ratio === '16_9')?.url
                 || label.images?.[0]?.url;

        if (!image || image.includes('ticketmaster.com')) {
            image = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
        }

        return {
          id: label.id,
          name: label.name,
          city: 'Global', 
          bio: label.info || label.pleaseNote || `Independent record label.`,
          tags: ['Music', 'Records'],
          image: image,
          verified: index % 2 === 0,
        };
      });
      return NextResponse.json({ labels: formatted });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}