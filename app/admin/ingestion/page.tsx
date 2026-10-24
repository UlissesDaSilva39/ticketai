import { createAdminClient } from '@/lib/supabase/admin';
import { SyncButton } from './SyncButton';

export const dynamic = 'force-dynamic';

export default async function IngestionDashboard() {
  const supabase = createAdminClient();

  const { data: sources } = await supabase
    .from('data_sources')
    .select('id, name, kind, enabled, notes, created_at')
    .order('name');

  const { data: runs } = await supabase
    .from('ingestion_runs')
    .select('id, source_id, status, records_seen, records_inserted, records_updated, records_rejected, started_at, finished_at, error')
    .order('started_at', { ascending: false })
    .limit(20);

  const { count: externalCount } = await supabase
    .from('external_records')
    .select('id', { count: 'exact', head: true });

  const { count: eventCount } = await supabase
    .from('events')
    .select('id', { count: 'exact', head: true });

  const sourceName = (id: string | null) => {
    if (!id) return '-';
    return sources?.find((s) => s.id === id)?.name ?? id.slice(0, 8);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Data Ingestion</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 32px' }}>
          Sources, sync history and manual sync triggers. {externalCount ?? 0} external records mapped · {eventCount ?? 0} events in DB.
        </p>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Sources</h2>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', marginBottom: 32 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead style={{ background: '#f9fafb', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Name</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Kind</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Enabled</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Notes</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {(sources ?? []).map((s) => (
                <tr key={s.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280' }}>{s.kind}</td>
                  <td style={{ padding: '10px 16px' }}>{s.enabled ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '10px 16px', color: '#6b7280', fontSize: 12 }}>{s.notes ?? ''}</td>
                  <td style={{ padding: '10px 16px' }}>
                    {s.name === 'ticketmaster' && s.enabled && <SyncButton source="ticketmaster" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Recent runs</h2>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead style={{ background: '#f9fafb', textAlign: 'left' }}>
              <tr>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Started</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Source</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Status</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Seen</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Inserted</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Updated</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Rejected</th>
                <th style={{ padding: '10px 16px', fontWeight: 600, color: '#374151' }}>Error</th>
              </tr>
            </thead>
            <tbody>
              {(runs ?? []).map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px 16px', color: '#6b7280', fontSize: 12 }}>{r.started_at ? new Date(r.started_at).toLocaleString('en-GB') : '-'}</td>
                  <td style={{ padding: '8px 16px' }}>{sourceName(r.source_id)}</td>
                  <td style={{ padding: '8px 16px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: r.status === 'success' ? '#f0fdf4' : r.status === 'error' ? '#fef2f2' : '#fef3c7', color: r.status === 'success' ? '#10b981' : r.status === 'error' ? '#ef4444' : '#92400e' }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: '8px 16px' }}>{r.records_seen}</td>
                  <td style={{ padding: '8px 16px', color: '#10b981', fontWeight: 600 }}>{r.records_inserted}</td>
                  <td style={{ padding: '8px 16px' }}>{r.records_updated}</td>
                  <td style={{ padding: '8px 16px', color: r.records_rejected > 0 ? '#ef4444' : '#6b7280' }}>{r.records_rejected}</td>
                  <td style={{ padding: '8px 16px', color: '#6b7280', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.error ?? ''}>{r.error ?? '-'}</td>
                </tr>
              ))}
              {(!runs || runs.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                    No sync runs yet. Click "Run sync" to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}