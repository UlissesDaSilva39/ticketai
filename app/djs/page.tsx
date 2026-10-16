import { DjHero }             from '@/components/djs/DjHero';
import { DjOS }               from '@/components/djs/DjOS';
import { LiveSetBoard }       from '@/components/djs/LiveSetBoard';
import { Economics }          from '@/components/promoters/Economics';
import { DjFilters }          from '@/components/djs/DjFilters';
import { DjGrid }             from '@/components/djs/DjGrid';
import { DjDistribution }     from '@/components/djs/DjDistribution';
import { DjWorkspacePreview } from '@/components/djs/DjWorkspacePreview';
import { DjProof }            from '@/components/djs/DjProof';
import { DjFaq }              from '@/components/djs/DjFaq';
import { DjDualCTA }          from '@/components/djs/DjDualCTA';
import { getDJs }             from '@/lib/djs';

export const metadata = {
  title: 'DJs — GRID',
  description:
    "Discover the DJs behind the sets you'll never forget — or get booked for gigs, sell tickets, and get paid the same day.",
};

export default async function DJsPage() {
  const djs = await getDJs();

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24">
      <DjHero />
      <DjOS />
      <LiveSetBoard />
      <Economics />
      <DjFilters />
      <DjGrid djs={djs} />
      <DjDistribution />
      <DjWorkspacePreview />
      <DjProof />
      <DjFaq />
      <DjDualCTA />
    </main>
  );
}