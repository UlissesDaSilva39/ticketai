import { DjCard } from './DjCard';
import type { DJ } from '@/lib/djs';

export function DjGrid({ djs }: { djs: DJ[] }) {
  return (
    <section id="djs" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {djs.length} DJs ·{' '}
        {djs.reduce((n, d) => n + d.gigCount, 0)} upcoming gigs
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {djs.map((d) => <DjCard key={d.slug} dj={d} />)}
      </div>
    </section>
  );
}