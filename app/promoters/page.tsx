import { createServerSupabase } from '@/lib/supabase/server';

import { PromoterHero }        from '@/components/promoters/PromoterHero';
import { PromoterOS }          from '@/components/promoters/PromoterOS';
import { VenueAvailability }   from '@/components/promoters/VenueAvailability';
import { Economics }           from '@/components/promoters/Economics';
import { PromoterFilters }     from '@/components/promoters/PromoterFilters';
import { PromoterGrid }        from '@/components/promoters/PromoterGrid';
import { Distribution }        from '@/components/promoters/Distribution';
import { WorkspacePreview }    from '@/components/promoters/WorkspacePreview';
import { Proof }               from '@/components/promoters/Proof';
import { Faq }                 from '@/components/promoters/Faq';
import { DualCTA }             from '@/components/promoters/DualCTA';

import type { Promoter }       from '@/lib/promoters';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Promoters — GRID',
  description:
    'Discover the promoters behind the best nights out — or run your own. Find venues, book artists, sell tickets, message promoters, and get paid the same day.',
};

function rowToPromoter(row: any): Promoter {
  const social = row.social ?? {};

  return {
    id:          row.id          ?? '',
    userId:      row.user_id     ?? '',
    slug:        row.slug        ?? row.id ?? '',
    name:        row.display_name ?? row.name ?? 'Untitled promoter',
    city:        row.city        ?? '',
    bio:         row.bio         ?? '',
    verified:    row.verified    ?? false,
    eventCount:  row.event_count ?? 0,
    ticketsSold: row.tickets_sold ?? 0,
    photos:      Array.isArray(row.photos) ? row.photos : [],
    nextEvent:   row.next_event ?? undefined,
    social: {
      instagram: social.instagram ?? row.instagram ?? undefined,
      tiktok:    social.tiktok    ?? row.tiktok    ?? undefined,
      youtube:   social.youtube   ?? row.youtube   ?? undefined,
    },
  };
}

export default async function PromotersPage() {
  const supabase = await createServerSupabase();

  const { data: rows } = await supabase
    .from('promoters')
    .select('*')
    .order('created_at', { ascending: false });

  const promoters: Promoter[] = (rows ?? []).map(rowToPromoter);

  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-24">
      <PromoterHero />
      <PromoterOS />
      <VenueAvailability />
      <Economics />
      <PromoterFilters />
      <PromoterGrid promoters={promoters} />
      <Distribution />
      <WorkspacePreview />
      <Proof />
      <Faq />
      <DualCTA />
    </main>
  );
}