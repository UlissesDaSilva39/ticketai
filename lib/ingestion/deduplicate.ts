import { createAdminClient } from '@/lib/supabase/admin';

export async function findExistingRecord(
  sourceName: string,
  recordType: string,
  providerId: string
): Promise<string | null> {
  const supabase = createAdminClient();
  const { data: source } = await supabase
    .from('data_sources')
    .select('id')
    .eq('name', sourceName)
    .maybeSingle();
  if (!source) return null;
  const { data: record } = await supabase
    .from('external_records')
    .select('local_id')
    .eq('source_id', source.id)
    .eq('record_type', recordType)
    .eq('provider_id', providerId)
    .maybeSingle();
  return record?.local_id ?? null;
}

export async function recordExternal(
  sourceName: string,
  recordType: string,
  providerId: string,
  localId: string
): Promise<void> {
  const supabase = createAdminClient();
  const { data: source } = await supabase
    .from('data_sources')
    .select('id')
    .eq('name', sourceName)
    .maybeSingle();
  if (!source) return;
  await supabase.from('external_records').upsert(
    {
      source_id: source.id,
      record_type: recordType,
      provider_id: providerId,
      local_id: localId,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: 'source_id,record_type,provider_id' }
  );
}