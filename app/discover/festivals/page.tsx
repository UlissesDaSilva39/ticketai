'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Festival = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  city: string | null;
  start_date: string | null;
  end_date: string | null;
  capacity: number | null;
  genres: string[] | null;
  hero_image: string | null;
  verified: boolean;
};

export default function FestivalsPage() {
  const router = useRouter();
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/festivals')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.festivals)) setFestivals(data.festivals);
      })
      .catch((err) => console.warn('festivals fetch failed', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const cities = ['All', ...Array.from(new Set(festivals.map((f) => f.city).filter(Boolean) as string[]))];
  const filtered = festivals.filter((f) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${f.name} ${f.city ?? ''} ${f.description ?? ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (selectedCity !== 'All' && f.city !== selectedCity) return false;
    return true;
  });

  const formatDates = (start: string | null, end: string | null) => {
    if (!start) return 'Dates TBA';
    const s = new Date(start).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (!end) return s;
    const e = new Date(end).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${s} – ${e}`;
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Festivals</h1>
        <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 24px' }}>Browse UK and international festivals.</p>
        <input
          placeholder="Search festivals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: 'white', fontSize: 15, marginBottom: 16 }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
          {cities.map((c) => (
            <button key={c} onClick={() => setSelectedCity(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedCity === c ? '#111827' : 'white', border: '1px solid #d1d5db', color: selectedCity === c ? 'white' : '#374151' }}>{c}</button>
          ))}
        </div>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>{loading ? 'Loading...' : `${filtered.length} festivals found`}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((f) => (
            <div key={f.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>{f.name}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 8px' }}>{formatDates(f.start_date, f.end_date)} · {f.city ?? 'TBA'}</p>
              <p style={{ fontSize: 13, color: '#374151', margin: '0 0 12px' }}>{f.description ?? ''}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {(f.genres ?? []).map((g) => (<span key={g} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#eff6ff', color: '#2563eb' }}>{g}</span>))}
              </div>
              {f.capacity && (<p style={{ fontSize: 12, color: '#10b981', fontWeight: 700, margin: 0 }}>{f.capacity.toLocaleString()} capacity</p>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
