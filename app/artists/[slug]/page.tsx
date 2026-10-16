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
import { getArtistBySlug, getRelatedArtists } from '@/lib/artists';

type Params = { params: Promise<{ slug: string }> };

export default async function ArtistProfilePage({ params }: Params) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const related = await getRelatedArtists(slug);

  const stats = [
    { label: 'Tracks', value: artist.trackCount ?? 0 },
    { label: 'Plays', value: artist.playCount ?? 0 },
    { label: 'Bookings', value: artist.bookingCount ?? 0 },
    { label: 'Earned', value: artist.earnedTotal ?? '—' },
  ];

  return (
    <CartProvider>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/artists" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
          ← Back to artists
        </Link>

        <div className="mt-6">
          <ArtistProfileHeader
            name={artist.name}
            handle={artist.slug}
            city={artist.city}
            timezone={artist.timezone}
            role={artist.role}
            bio={artist.bio}
            genres={artist.genres ?? [artist.role]}
            verified={artist.verified}
            available={artist.available ?? true}
            followers={artist.followers ?? 0}
            responseTime={artist.responseTime}
            memberSince={artist.memberSince}
            photo={artist.photos?.[0]}
            supportUrl={artist.membership?.url}
            social={artist.social}
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-y border-neutral-200 py-5 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-xl font-black tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">{s.label}</p>
            </div>
          ))}
        </div>

        {artist.latestDrop && (
          <div className="mt-8">
            <ArtistLatestDrop drop={artist.latestDrop} />
          </div>
        )}

        <div className="mt-10">
          <ArtistTracksList tracks={artist.tracks} />
        </div>

        {artist.longBio && (
          <section className="mt-10">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">About</h2>
            <div className="mt-3 max-w-3xl space-y-3 text-base leading-relaxed text-neutral-700">
              {artist.longBio.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10"><ArtistCredits credits={artist.credits} /></div>
        <div className="mt-10"><ArtistServicesPanel services={artist.services} slug={artist.slug} /></div>
        <div className="mt-10"><ArtistMerch items={artist.merch} /></div>
        <div className="mt-10"><ArtistBundle bundle={artist.bundle} /></div>
        <div className="mt-10"><ArtistMembership membership={artist.membership} /></div>
        <div className="mt-10"><WhyGridBlock /></div>
        <div className="mt-10"><ArtistReviews reviews={artist.reviews} /></div>
        <div className="mt-10"><ArtistMerchReviews reviews={artist.reviews} /></div>
        <div className="mt-10"><MetaSalesBlock role={artist.role || 'artist'} /></div>

        {related.length > 0 && (
          <div className="mt-10">
            <ArtistRelated
              artists={related.map((r) => ({
                slug: r.slug, name: r.name, city: r.city, role: r.role, photo: r.photos?.[0],
              }))}
            />
          </div>
        )}

        <div className="mt-10">
          <ArtistBottomCTA handle={artist.slug} name={artist.name} />
        </div>
      </div>
    </CartProvider>
  );
}