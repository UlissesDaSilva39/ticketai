import { ProducerHero }             from '@/components/producers/ProducerHero';
import { ProducerOS }               from '@/components/producers/ProducerOS';
import { LiveBeatDrops }            from '@/components/producers/LiveBeatDrops';
import { Economics }                from '@/components/promoters/Economics';
import { ProducerFilters }          from '@/components/producers/ProducerFilters';
import { ProducerGrid }             from '@/components/producers/ProducerGrid';
import { ProducerDistribution }     from '@/components/producers/ProducerDistribution';
import { ProducerWorkspacePreview } from '@/components/producers/ProducerWorkspacePreview';
import { ProducerProof }            from '@/components/producers/ProducerProof';
import { ProducerFaq }              from '@/components/producers/ProducerFaq';
import { ProducerDualCTA }          from '@/components/producers/ProducerDualCTA';
import { getProducers }             from '@/lib/producers';

export const metadata = {
  title: 'Producers — GRID',
  description:
    'Discover the producers behind the records you love — or sell your own beats, land placements, and get paid the same day.',
};

export default async function ProducersPage() {
  const producers = await getProducers();

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24">
      <ProducerHero />
      <ProducerOS />
      <LiveBeatDrops />
      <Economics />
      <ProducerFilters />
      <ProducerGrid producers={producers} />
      <ProducerDistribution />
      <ProducerWorkspacePreview />
      <ProducerProof />
      <ProducerFaq />
      <ProducerDualCTA />
    </main>
  );
}