import { BandHero }             from '@/components/bands/BandHero';
import { BandOS }               from '@/components/bands/BandOS';
import { LiveGigBoard }         from '@/components/bands/LiveGigBoard';
import { Economics }            from '@/components/promoters/Economics';
import { BandFilters }          from '@/components/bands/BandFilters';
import { BandGrid }             from '@/components/bands/BandGrid';
import { BandDistribution }     from '@/components/bands/BandDistribution';
import { BandWorkspacePreview } from '@/components/bands/BandWorkspacePreview';
import { BandProof }            from '@/components/bands/BandProof';
import { BandFaq }              from '@/components/bands/BandFaq';
import { BandDualCTA }          from '@/components/bands/BandDualCTA';
import { getBands }             from '@/lib/bands';

export const metadata = {
  title: 'Bands — GRID',
  description:
    "Discover the bands behind the nights you'll never forget — or book gigs, sell tickets, and get paid the same day.",
};

export default async function BandsPage() {
  const bands = await getBands();

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24">
      <BandHero />
      <BandOS />
      <LiveGigBoard />
      <Economics />
      <BandFilters />
      <BandGrid bands={bands} />
      <BandDistribution />
      <BandWorkspacePreview />
      <BandProof />
      <BandFaq />
      <BandDualCTA />
    </main>
  );
}