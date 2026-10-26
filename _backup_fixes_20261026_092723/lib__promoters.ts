import { createServerSupabase } from "@/lib/supabase/server";

export async function getPromoterBySlug(slug: string) {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('promoters')
    .select('id, display_name, slug, bio, city, verified, event_count, tickets_sold, next_event, photos')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    slug: data.slug ?? slug,
    name: data.display_name ?? 'Unnamed promoter',
    city: data.city ?? '',
    bio: data.bio ?? '',
    longBio: data.bio ?? '',
    verified: !!data.verified,
    eventCount: data.event_count ?? 0,
    ticketsSold: data.tickets_sold ?? 0,
    avgFill: 0,
    timezone: 'GMT',
    responseTime: '~4 hours',
    runningSince: '2019',
    genres: [],
    photos: data.photos ?? [],
    nextEvent: data.next_event ?? null,
    upcomingEvents: [],
    venuesWorked: [],
    residentDjs: [],
    reviews: [],
  };
}

export async function getAllPromoters() {
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from('promoters')
    .select('id, display_name, slug, bio, city, verified, event_count, tickets_sold, next_event, photos')
    .order('verified', { ascending: false });

  if (!data) return [];

  return data.map((p) => ({
    id: p.id,
    slug: p.slug ?? p.id.slice(0, 8),
    name: p.display_name ?? 'Unnamed promoter',
    city: p.city ?? '',
    bio: p.bio ?? '',
    longBio: p.bio ?? '',
    verified: !!p.verified,
    eventCount: p.event_count ?? 0,
    ticketsSold: p.tickets_sold ?? 0,
    avgFill: 0,
    timezone: 'GMT',
    responseTime: '~4 hours',
    runningSince: '2019',
    genres: [],
    photos: p.photos ?? [],
    nextEvent: p.next_event ?? null,
    upcomingEvents: [],
    venuesWorked: [],
    residentDjs: [],
    reviews: [],
  }));
}