import { createAdminClient } from '@/lib/supabase/admin';
import { fetchTicketmasterEvents } from './sources/ticketmaster';
import { findExistingRecord, recordExternal } from './deduplicate';
import { IngestionResult } from './types';

export async function runTicketmasterSync(maxResults = 500): Promise<IngestionResult> {
  const supabase = createAdminClient();
  const { data: source } = await supabase
    .from('data_sources')
    .select('id')
    .eq('name', 'ticketmaster')
    .maybeSingle();

  const { data: run } = await supabase
    .from('ingestion_runs')
    .insert({ source_id: source?.id, status: 'running' })
    .select('id')
    .single();

  let seen = 0, inserted = 0, updated = 0, rejected = 0;
  let error: string | null = null;

  try {
    const events = await fetchTicketmasterEvents('GB', maxResults);
    seen = events.length;

    for (const e of events) {
      const existingId = await findExistingRecord('ticketmaster', 'event', e.provider_id);
      const record = {
        title: e.title,
        description: e.description,
        start_date: e.start_date,
        end_date: e.end_date,
        timezone: e.timezone,
        event_type: e.event_type,
        status: 'published',
        hero_image: e.hero_image,
        venue_name: e.venue_name,
        venue_city: e.venue_city,
        price_min: e.price_min,
        price_max: e.price_max,
        currency: e.currency,
        ticket_url: e.ticket_url,
        is_test: false,
      };
      if (existingId) {
        await supabase.from('events').update(record).eq('id', existingId);
        updated++;
      } else {
        const { data: created } = await supabase
          .from('events')
          .insert(record)
          .select('id')
          .single();
        if (created) {
          await recordExternal('ticketmaster', 'event', e.provider_id, created.id);
          inserted++;
        } else {
          rejected++;
        }
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  if (run) {
    await supabase.from('ingestion_runs').update({
      finished_at: new Date().toISOString(),
      status: error ? 'error' : 'success',
      records_seen: seen,
      records_inserted: inserted,
      records_updated: updated,
      records_rejected: rejected,
      error,
    }).eq('id', run.id);
  }

  return { source: 'ticketmaster', seen, inserted, updated, rejected, error };
}

const RSS_FEEDS: { url: string; name: string }[] = [
  { url: 'https://www.nme.com/feed', name: 'NME' },
  { url: 'https://www.thelineofbestfit.com/feed', name: 'The Line of Best Fit' },
  { url: 'https://www.clashmusic.com/feed/', name: 'Clash' },
  { url: 'https://crackmagazine.net/feed/', name: 'Crack Magazine' },
  { url: 'https://pitchfork.com/feed/feed-news/rss', name: 'Pitchfork' },
];

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/â\u0080\u0099/g, "'")
    .replace(/â\u0080\u009c/g, '"')
    .replace(/â\u0080\u009d/g, '"')
    .replace(/â\u0080\u0093/g, '-')
    .replace(/â\u0080\u0094/g, '-');
}

export async function runRssSync(): Promise<IngestionResult> {
  const supabase = createAdminClient();
  const { data: source } = await supabase
    .from('data_sources')
    .select('id')
    .eq('name', 'rss')
    .maybeSingle();

  const { data: run } = await supabase
    .from('ingestion_runs')
    .insert({ source_id: source?.id, status: 'running' })
    .select('id')
    .single();

  let seen = 0, inserted = 0, updated = 0, rejected = 0;
  let error: string | null = null;

  try {
    const { fetchRssFeed } = await import('./sources/rss');
    for (const feed of RSS_FEEDS) {
      try {
        const items = await fetchRssFeed(feed.url, feed.name);
        seen += items.length;
        for (const item of items) {
          const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : null;
          const cleanTitle = decodeHtmlEntities(item.title);
          const { error: insertError } = await supabase
            .from('rss_items')
            .upsert(
              { source_name: item.source_name, title: cleanTitle, link: item.link, pub_date: pubDate },
              { onConflict: 'link' }
            );
          if (insertError) rejected++;
          else inserted++;
        }
      } catch (feedErr) {
        console.warn('RSS feed failed: ' + feed.url, feedErr);
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  if (run) {
    await supabase.from('ingestion_runs').update({
      finished_at: new Date().toISOString(),
      status: error ? 'error' : 'success',
      records_seen: seen,
      records_inserted: inserted,
      records_updated: updated,
      records_rejected: rejected,
      error,
    }).eq('id', run.id);
  }

  return { source: 'rss', seen, inserted, updated, rejected, error };
}