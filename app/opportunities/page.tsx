'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

type Opportunity = {
  id: string;
  title: string;
  org: string;
  category: string;
  location: string | null;
  remote: boolean | null;
  compensation: string | null;
  description: string | null;
  deadline: string | null;
  created_at: string;
};

const TYPES = [
  { label: 'All', value: 'All' },
  { label: 'Gigs', value: 'gig' },
  { label: 'Jobs', value: 'job' },
  { label: 'Bookings', value: 'booking' },
  { label: 'Collabs', value: 'collab' },
  { label: 'Festivals', value: 'festival' },
  { label: 'Remixes', value: 'remix' },
  { label: 'Sync', value: 'sync' },
  { label: 'Brand', value: 'brand' },
];

const LABELS: Record<string, string> = {
  gig: 'Gig',
  job: 'Job',
  booking: 'Booking',
  collab: 'Collab',
  festival: 'Festival',
  remix: 'Remix',
  sync: 'Sync',
  brand: 'Brand',
};

export default function OpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/opportunities')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.opportunities)) setOpportunities(data.opportunities);
      })
      .catch((err) => console.warn('opportunities fetch failed', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = opportunities.filter((o) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = (o.title + ' ' + o.org + ' ' + (o.description ?? '')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (selectedType !== 'All' && o.category !== selectedType) return false;
    return true;
  });

  const formatDeadline = (d: string | null) => {
    if (!d) return 'No deadline';
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, flex: 1, paddingTop: 64, width: 'calc(100% - 260px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Opportunities</h1>
          <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 24px' }}>Gigs, jobs, bookings, collabs and more from the music industry.</p>

          <input
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: 'white', fontSize: 15, marginBottom: 16, boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedType === t.value ? '#111827' : 'white', border: '1px solid #d1d5db', color: selectedType === t.value ? 'white' : '#374151' }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
            {loading ? 'Loading...' : filtered.length + ' opportunities found'}
          </p>

          {!loading && filtered.length === 0 ? (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, textAlign: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No opportunities found</h2>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0 }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {filtered.map((o) => (
                <div key={o.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#eff6ff', color: '#2563eb' }}>
                          {LABELS[o.category] ?? o.category}
                        </span>
                        {o.remote && (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#f0fdf4', color: '#10b981' }}>
                            Remote
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>{o.title}</h3>
                      <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 12px' }}>
                        {o.org} · {o.location ?? 'Location TBA'}
                      </p>
                      <p style={{ fontSize: 14, color: '#374151', margin: '0 0 12px' }}>{o.description ?? ''}</p>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#6b7280' }}>
                        {o.compensation && <span><strong style={{ color: '#111827' }}>Pay:</strong> {o.compensation}</span>}
                        <span><strong style={{ color: '#111827' }}>Deadline:</strong> {formatDeadline(o.deadline)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => router.push('/messages')}
                      style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: 'white', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Contact poster
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
