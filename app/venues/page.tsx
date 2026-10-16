import { VenueHero }             from '@/components/venues/VenueHero';
import { VenueOS }               from '@/components/venues/VenueOS';
import { LiveAvailability }      from '@/components/venues/LiveAvailability';
import { Economics }             from '@/components/promoters/Economics';
import { VenueFilters }          from '@/components/venues/VenueFilters';
import { VenueGrid }             from '@/components/venues/VenueGrid';
import { VenueDistribution }     from '@/components/venues/VenueDistribution';
import { VenueWorkspacePreview } from '@/components/venues/VenueWorkspacePreview';
import { VenueProof }            from '@/components/venues/VenueProof';
import { VenueFaq }              from '@/components/venues/VenueFaq';
import { VenueDualCTA }          from '@/components/venues/VenueDualCTA';
import { getVenues }             from '@/lib/venues';

export const metadata = {
  title: 'Venues — GRID',
  description:
    "Discover the rooms behind the nights you'll never forget — or list your venue, fill empty nights, and get paid the same day.",
};

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24">
      <VenueHero />
      <VenueOS />
      <LiveAvailability />
      <Economics />
      <VenueFilters />
      <VenueGrid venues={venues} />
      <VenueDistribution />
      <VenueWorkspacePreview />
      <VenueProof />
      <VenueFaq />
      <VenueDualCTA />
    </main>
  );
}