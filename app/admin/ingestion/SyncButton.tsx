'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SyncButton({ source }: { source: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ingestion/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, maxResults: 20 }),
      });
      const json = await res.json();
      if (res.ok) {
        setResult('Inserted ' + json.inserted + ', updated ' + json.updated + ', rejected ' + json.rejected);
        router.refresh();
      } else {
        setResult('Error: ' + (json.error ?? 'unknown'));
      }
    } catch (e) {
      setResult('Request failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={run}
        disabled={loading}
        style={{ padding: '8px 16px', borderRadius: 6, background: '#111827', color: 'white', border: 'none', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
      >
        {loading ? 'Running...' : 'Run sync'}
      </button>
      {result && <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>{result}</p>}
    </div>
  );
}