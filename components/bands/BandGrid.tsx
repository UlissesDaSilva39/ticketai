import { BandCard } from './BandCard';
import type { Band } from '@/lib/bands';

export function BandGrid({ bands }: { bands: Band[] }) {
  return (
    <section id="bands" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {bands.length} bands ·{' '}
        {bands.reduce((n, b) => n + b.gigCount, 0)} upcoming gigs
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {bands.map((b) => <BandCard key={b.slug} band={b} />)}
      </div>
    </section>
  );
}