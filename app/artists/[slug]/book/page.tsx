import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookingFlow } from '@/components/artists/BookingFlow';
import { getArtistBySlug } from '@/lib/artists';

type Params = { params: Promise<{ slug: string }> };

export default async function BookArtistPage({ params }: Params) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={`/artists/${artist.slug}`}
        className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black"
      >
        ← Back to {artist.name}
      </Link>

      <header className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          Book a session
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{artist.name}</h1>
        <p className="mt-2 text-base text-neutral-600">{artist.bio}</p>
      </header>

      <div className="mt-10">
        <BookingFlow
          artistSlug={artist.slug}
          artistName={artist.name}
          services={artist.services ?? []}
        />
      </div>
    </div>
  );
}