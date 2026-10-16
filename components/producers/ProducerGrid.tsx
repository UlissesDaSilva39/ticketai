import { ProducerCard } from './ProducerCard';
import type { Producer } from '@/lib/producers';

export function ProducerGrid({ producers }: { producers: Producer[] }) {
  return (
    <section id="producers" className="scroll-mt-32">
      <p className="mb-5 text-sm text-neutral-500">
        {producers.length} producers ·{' '}
        {producers.reduce((n, p) => n + p.beatCount, 0)} beats for sale
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {producers.map((p) => <ProducerCard key={p.slug} producer={p} />)}
      </div>
    </section>
  );
}