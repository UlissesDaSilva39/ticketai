import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CartProvider }         from '@/components/merch/CartProvider';
import { ArtistProfileHeader }   from '@/components/artists/ArtistProfileHeader';
import { ArtistLatestDrop }      from '@/components/artists/ArtistLatestDrop';
import { ArtistTracksList }      from '@/components/artists/ArtistTracksList';
import { ArtistCredits }         from '@/components/artists/ArtistCredits';
import { ArtistServicesPanel }   from '@/components/artists/ArtistServicesPanel';
import { ArtistMerch }           from '@/components/artists/ArtistMerch';
import { ArtistBundle }          from '@/components/artists/ArtistBundle';
import { ArtistMembership }      from '@/components/artists/ArtistMembership';
import { WhyGridBlock }          from '@/components/artists/WhyGridBlock';
import { ArtistReviews }         from '@/components/artists/ArtistReviews';
import { ArtistMerchReviews }    from '@/components/artists/ArtistMerchReviews';
import { MetaSalesBlock }        from '@/components/artists/MetaSalesBlock';
import { ArtistRelated }         from '@/components/artists/ArtistRelated';
import { ArtistBottomCTA }       from '@/components/artists/ArtistBottomCTA';
import { getArtistBySlug, getRelatedArtists, getProfileByUsername } from '@/lib/artists';

type Params = { params: Promise<{ slug: string }> };

export default async function ArtistProfilePage({ params }: Params) {
  const { slug } = await params;
  
  // 1. Tenta buscar no array fixo (artistas de exemplo)
  let artist = await getArtistBySlug(slug);

  // 2. Fallback: busca na tabela 'profiles' do Supabase
  if (!artist) {
    artist = await getProfileByUsername(slug);
  }

  // 3. Se não encontrar em nenhum dos dois, retorna 404
  if (!artist) notFound();

  const related = await getRelatedArtists(slug);

  const stats = [
    { label: 'Tracks', value: artist.trackCount ?? 0 },
  ];

  return (
    <div>
      <ArtistProfileHeader
        name={artist.name || "Artist"}
        handle={artist.slug || artist.username || ""}
        city={artist.city || "Unknown"}
        timezone={(artist as any).timezone}
        role={artist.role || "Artist"}
        bio={artist.bio || ""}
        genres={artist.genres || []}
        verified={artist.verified || false}
        available={(artist as any).available || false}
        followers={(artist as any).followers || 0}
        responseTime={(artist as any).responseTime}
        memberSince={(artist as any).memberSince}
        photo={(artist as any).photo || (artist.photos && artist.photos[0])}
        supportUrl={(artist as any).supportUrl}
        social={(artist as any).social}
      />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ArtistLatestDrop artist={artist} />
            <ArtistTracksList artist={artist} />
            <ArtistCredits artist={artist} />
            <ArtistServicesPanel artist={artist} />
            <ArtistMerch artist={artist} />
            <ArtistBundle artist={artist} />
            <ArtistMembership artist={artist} />
            <WhyGridBlock />
            <ArtistReviews artist={artist} />
            <ArtistMerchReviews artist={artist} />
            <MetaSalesBlock />
          </div>
          <div className="space-y-8">
            <ArtistRelated artists={related} />
            <ArtistBottomCTA />
          </div>
        </div>
      </main>
    </div>
  );
}