export type IngestionSource = 'ticketmaster' | 'rss' | 'openstreetmap' | 'manual';

export type NormalisedEvent = {
  provider_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  timezone: string;
  event_type: string | null;
  status: string;
  hero_image: string | null;
  venue_name: string | null;
  venue_city: string | null;
  venue_address: string | null;
  ticket_url: string | null;
  price_min: number | null;
  price_max: number | null;
  currency: string;
  source_url: string;
};

export type IngestionResult = {
  source: IngestionSource;
  seen: number;
  inserted: number;
  updated: number;
  rejected: number;
  error: string | null;
};