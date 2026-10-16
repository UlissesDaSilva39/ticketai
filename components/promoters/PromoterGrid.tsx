import { PromoterCard } from './PromoterCard';
import type { Promoter } from '@/lib/promoters';

export function PromoterGrid({
  promoters,
  currentUserId,
}: {
  promoters: Promoter[];
  currentUserId?: string | null;
}) {
  return (
    <section id="promoters" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {promoters.length} promoters ·{' '}
        {promoters.reduce((n, p) => n + p.eventCount, 0)} upcoming events
      </p>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {promoters.map((p) => (
          <PromoterCard key={p.slug} promoter={p} currentUserId={currentUserId} />
        ))}
      </div>
    </section>
  );
}