import { NormalisedEvent } from '@/lib/ingestion/types';

const API_KEY = process.env.TICKETMASTER_API_KEY;
const BASE = 'https://app.ticketmaster.com/discovery/v2';

export async function fetchTicketmasterEvents(
  countryCode = 'GB',
  size = 20
): Promise<NormalisedEvent[]> {
  if (!API_KEY) throw new Error('TICKETMASTER_API_KEY not set');
  const now = new Date().toISOString().split('.')[0] + 'Z';
  const url = BASE + '/events.json?apikey=' + API_KEY + '&countryCode=' + countryCode + '&size=' + size + '&sort=date,asc&startDateTime=' + now + '&classificationName=Music';
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Ticketmaster ' + res.status + ': ' + (await res.text()));
  const json = await res.json();
  const events = json._embedded?.events ?? [];
  return events.map((e: any) => normalise(e));
}

function normalise(e: any): NormalisedEvent {
  const venue = e._embedded?.venues?.[0];
  const start = e.dates?.start;
  const startDate = start?.dateTime
    ?? (start?.localDate ? start.localDate + 'T' + (start.localTime ?? '00:00:00') : new Date().toISOString());
  const priceRange = e.priceRanges?.[0];
  return {
    provider_id: e.id,
    title: e.name,
    description: e.info ?? e.pleaseNote ?? null,
    start_date: startDate,
    end_date: null,
    timezone: start?.timezone ?? 'Europe/London',
    event_type: e.classifications?.[0]?.segment?.name?.toLowerCase() ?? null,
    status: 'published',
    hero_image: e.images?.[0]?.url ?? null,
    venue_name: venue?.name ?? null,
    venue_city: venue?.city?.name ?? null,
    venue_address: venue?.address?.line1 ?? null,
    ticket_url: e.url ?? null,
    price_min: priceRange?.min ?? null,
    price_max: priceRange?.max ?? null,
    currency: priceRange?.currency ?? 'GBP',
    source_url: e.url ?? ('https://ticketmaster.co.uk/event/' + e.id),
  };
}