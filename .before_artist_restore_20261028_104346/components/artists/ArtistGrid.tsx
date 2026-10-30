import { ArtistCard } from './ArtistCard';
import type { Artist } from '@/lib/artists';

export function ArtistGrid({ artists }: { artists: Artist[] }) {
  return (
    <section id="artists" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {artists.length} artists ·{' '}
        {artists.reduce((n, a) => n + a.bookingCount, 0)} bookings available
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {artists.map((a) => <ArtistCard key={a.slug} artist={a} />)}
      </div>
    </section>
  );
}