import { VocalistCard } from './VocalistCard';
import type { Vocalist } from '@/lib/vocalists';

export function VocalistGrid({ vocalists }: { vocalists: Vocalist[] }) {
  return (
    <section id="vocalists" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {vocalists.length} vocalists ·{' '}
        {vocalists.reduce((n, v) => n + v.bookingCount, 0)} bookings available
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {vocalists.map((v) => <VocalistCard key={v.slug} vocalist={v} />)}
      </div>
    </section>
  );
}