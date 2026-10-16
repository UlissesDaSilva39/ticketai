import { VenueCard } from './VenueCard';
import type { Venue } from '@/lib/venues';

export function VenueGrid({ venues }: { venues: Venue[] }) {
  return (
    <section id="venues" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {venues.length} venues ·{' '}
        {venues.reduce((n, v) => n + v.eventCount, 0)} events booked
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((v) => <VenueCard key={v.slug} venue={v} />)}
      </div>
    </section>
  );
}