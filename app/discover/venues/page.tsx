'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const s: Record<string, React.CSSProperties> = {
  page: { background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 32 },
  h1: { margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' },
  subtitle: { margin: 0, fontSize: 16, color: '#6b7280' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginTop: 32 },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' as const, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  cardImageContainer: { position: 'relative' as const, height: 200, width: '100%', background: '#e5e7eb' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover' as const },
  verifiedBadge: { position: 'absolute' as const, top: 12, left: 12, background: 'rgba(16,185,129,0.95)', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 },
  cardBody: { padding: 20, display: 'flex', flexDirection: 'column' as const, gap: 12, flex: 1 },
  cardTitle: { fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' },
  cardMeta: { fontSize: 14, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 },
  statRow: { display: 'flex', gap: 16, padding: '12px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', margin: '4px 0' },
  statItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#374151', fontWeight: 500 },
  btnClub: { width: '100%', padding: '12px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnClubActive: { width: '100%', padding: '12px 0', borderRadius: 8, background: '#f0fdf4', color: '#065f46', border: '1px solid #10b981', fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  actionRow: { display: 'flex', gap: 12, marginTop: 'auto' },
  btnView: { flex: 1, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center' as const },
  btnEnquire: { flex: 2, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'center' as const },
};

export default function DiscoverVenuesPage() {
  const router = useRouter();
  const [venues, setVenues] = useState<any[]>([]);
  const [clubMembers, setClubMembers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedClubs = JSON.parse(localStorage.getItem('venue_club_members') || '[]');
      setClubMembers(savedClubs);
    } catch {}

    fetch('/api/venues')
      .then(res => res.json())
      .then(data => { if (data && data.length > 0) setVenues(data); })
      .catch(err => console.error(err));
  }, []);

    const resetTestState = () => {
    localStorage.removeItem('venue_club_members');
    setClubMembers([]);
    window.location.reload();
  };

  return (
    <main style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.h1}>Discover venues</h1>
          <p style={s.subtitle}>Browse every venue on GRID. Filter by city, capacity, and venue type. Find the perfect space for your next event.</p>
        </div>

        <div style={s.grid}>
          {venues.map((v: any) => {
            const isMember = clubMembers.includes(v.id);
            const slug = v.name.toLowerCase().replace(/\s+/g, '-');
              const resetTestState = () => {
    localStorage.removeItem('venue_club_members');
    setClubMembers([]);
    window.location.reload();
  };

  return (
              <div key={v.id} style={s.card}>
                <div style={s.cardImageContainer}>
                  <img src={v.image || ''} alt={v.name} style={s.cardImage} />
                  {v.verified && (
                    <div style={s.verifiedBadge}>
                      <span style={{ fontSize: 14 }}>{String.fromCharCode(10003)}</span> VERIFIED
                    </div>
                  )}
                </div>
                <div style={s.cardBody}>
                  <div>
                    <h3 style={s.cardTitle}>{v.name}</h3>
                    <div style={s.cardMeta}>
                      <span>{String.fromCharCode(128205)}</span> {v.type} · {v.city}
                    </div>
                  </div>
                  <div style={s.statRow}>
                    <span style={s.statItem}><span>{String.fromCharCode(128101)}</span> {v.capacity} cap</span>
                    <span style={s.statItem}><span style={{ color: '#f59e0b' }}>{String.fromCharCode(9733)}</span> {v.rating} ({v.reviews})</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>{String.fromCharCode(128197)}</span> Booked {v.bookings} times this month
                  </div>
                  {isMounted && (
                    isMember ? (
                      <div style={s.btnClubActive}>
                        <span>{String.fromCharCode(127942)}</span> Venue Club Member
                      </div>
                    ) : (
                      <button onClick={() => router.push('/venues/' + slug + '/join')} style={s.btnClub}>
                        <span>{String.fromCharCode(127942)}</span> Join Venue Club
                      </button>
                    )
                  )}
                  <div style={s.actionRow}>
                    <button style={s.btnView}>View</button>
                    <button style={s.btnEnquire}>Enquire →</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
              <div style={{ textAlign: 'center', marginTop: 64 }}>
          <button onClick={resetTestState} style={{ background: 'none', border: '1px dashed #9ca3af', color: '#6b7280', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>
            (Dev Only) Reset Venue Club Test Data
          </button>
        </div>
      </div>
    </main>
  );
}