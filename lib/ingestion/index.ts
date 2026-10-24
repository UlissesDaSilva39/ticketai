import { createAdminClient } from '@/lib/supabase/admin';
import { fetchTicketmasterEvents } from './sources/ticketmaster';
import { findExistingRecord, recordExternal } from './deduplicate';
import { IngestionResult } from './types';

export async function runTicketmasterSync(maxResults = 20): Promise<IngestionResult> {
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