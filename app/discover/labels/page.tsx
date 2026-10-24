'use client';

import { useState, useEffect } from 'react';

type Label = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  city: string | null;
  country: string | null;
  genres: string[] | null;
  hero_image: string | null;
  verified: boolean;
};

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/labels')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.labels)) setLabels(data.labels);
      })
      .catch((err) => console.warn('labels fetch failed', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = labels.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const hay = `${l.name} ${l.city ?? ''} ${l.description ?? ''} ${(l.genres ?? []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Labels</h1>
        <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 24px' }}>Discover record labels and their rosters.</p>

        <input
          placeholder="Search labels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: 'white', fontSize: 15, marginBottom: 24, boxSizing: 'border-box' }}
        />

        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
          {loading ? 'Loading...' : `${filtered.length} labels found`}
        </p>

        {!loading && filtered.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, textAlign: 'center' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No labels found</h2>
            <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>Try adjusting your search.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtered.map((l) => (
              <div key={l.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, position: 'relative' }}>
                {l.verified && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>VERIFIED</div>
                )}
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>{l.name}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>{l.city ?? 'Location TBA'}</p>
                <p style={{ fontSize: 13, color: '#374151', margin: '0 0 12px' }}>{l.description ?? ''}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {(l.genres ?? []).map((g) => (
                    <span key={g} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#fef3c7', color: '#92400e' }}>{g}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
