import { VocalistHero }             from '@/components/vocalists/VocalistHero';
import { VocalistOS }               from '@/components/vocalists/VocalistOS';
import { LiveVocalShowcase }        from '@/components/vocalists/LiveVocalShowcase';
import { Economics }                from '@/components/promoters/Economics';
import { VocalistFilters }          from '@/components/vocalists/VocalistFilters';
import { VocalistGrid }             from '@/components/vocalists/VocalistGrid';
import { VocalistDistribution }     from '@/components/vocalists/VocalistDistribution';
import { VocalistWorkspacePreview } from '@/components/vocalists/VocalistWorkspacePreview';
import { VocalistProof }            from '@/components/vocalists/VocalistProof';
import { VocalistFaq }              from '@/components/vocalists/VocalistFaq';
import { VocalistDualCTA }          from '@/components/vocalists/VocalistDualCTA';
import { getVocalists }             from '@/lib/vocalists';

export const metadata = {
  title: 'Vocalists — GRID',
  description:
    'Discover the voices behind the records you love — or book sessions, sell features, and get paid the same day.',
};

export default async function VocalistsPage() {
  const vocalists = await getVocalists();

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24">
      <VocalistHero />
      <VocalistOS />
      <LiveVocalShowcase />
      <Economics />
      <VocalistFilters />
      <VocalistGrid vocalists={vocalists} />
      <VocalistDistribution />
      <VocalistWorkspacePreview />
      <VocalistProof />
      <VocalistFaq />
      <VocalistDualCTA />
    </main>
  );
}