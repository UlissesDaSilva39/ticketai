import { createClient } from '@supabase/supabase-js';
import { ClaimButton } from '@/components/claims/ClaimButton';
import { FullBleedHeader } from '@/components/artists/FullBleedHeader';

export const dynamic = 'force-dynamic';

async function getArtist(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('artists')
    .select('id, slug, name, handle, artist_type, genre, secondary_genres, city, country, bio, website, spotify, instagram, avatar_url, cover_image, verified')
    .eq('slug', slug)
    .maybeSingle();
  return data;
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);

  if (!artist) {
    return (
      <div style={{ maxWidth: 800, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Artist not found</h1>
        <p style={{ color: '#6b7280', margin: '0 0 24px' }}>This profile does not exist yet.</p>
        <a href='/discover/artists' style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: '#111827', color: 'white', textDecoration: 'none', fontWeight: 700 }}>Back to artists</a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
              <FullBleedHeader
        name={artist.name}
        genre={artist.genre}
        city={artist.city}
        headerImage={artist.cover_image ?? null}
      />      <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>{artist.name}</h1>
          <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 16px' }}>
            {[artist.artist_type, artist.genre, artist.city].filter(Boolean).join('  -  ')}
          </p>
          <div style={{ marginBottom: 24 }}>
            <ClaimButton targetType="artist" targetId={artist.id} targetName={artist.name} />
          </div>
          {artist.bio && (
            <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.6, margin: '0 0 24px' }}>{artist.bio}</p>
          )}
          <a href={'/artists/' + params.slug + '/join'} style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
            Join Club
          </a>
        </div>
      </div>
    </div>
  );
}



