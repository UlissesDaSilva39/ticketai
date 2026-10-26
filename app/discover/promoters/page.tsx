'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopAdBanner from '@/components/TopAdBanner';


// ============ MOCK DATA ============
const PROMOTERS = [
  { id: 'p1', initials: 'AD', name: 'Amsterdam Dance Events', city: 'Amsterdam', memberSince: '2021', description: 'ADE regulars and year-round parties.', events: 12, rating: '4.8', reviews: 12, merch: 'ðŸ›ï¸ Merch', availability: 'Available now', nextEvent: 'Warehouse Â· 15 Nov', verified: true },
  { id: 'p2', initials: 'BB', name: 'Brighton Beats', city: 'Brighton', memberSince: '2022', description: 'Seafront parties and summer festivals.', events: 9, rating: '4.6', reviews: 8, merch: null, availability: 'Fully booked', nextEvent: 'Pier Party Â· 22 Nov', verified: true },
  { id: 'p3', initials: 'BU', name: 'Bristol Underground', city: 'Bristol', memberSince: '2019', description: 'The best of Bristol\'s underground scene.', events: 15, rating: '4.9', reviews: 21, merch: 'ðŸ›ï¸ Merch', availability: 'Available now', nextEvent: 'Basement Â· 8 Nov', verified: true },
  { id: 'p4', initials: 'DA', name: 'Drum and Bass Nation', city: 'Bristol', memberSince: '2018', description: 'The UK\'s largest DnB promoters.', events: 28, rating: '4.7', reviews: 43, merch: 'ðŸ›ï¸ Merch', availability: 'Limited availability', nextEvent: 'DnB Night Â· 12 Nov', verified: true },
  { id: 'p5', initials: 'EE', name: 'East End Promotions', city: 'London', memberSince: '2020', description: 'Shoreditch and Hackney events.', events: 22, rating: '4.5', reviews: 19, merch: null, availability: 'Available now', nextEvent: 'Shoreditch Â· 9 Nov', verified: true },
  { id: 'p6', initials: 'EE', name: 'Electronic Europe', city: 'Amsterdam', memberSince: '2017', description: 'Pan-European electronic events.', events: 19, rating: '4.8', reviews: 31, merch: 'ðŸ›ï¸ Merch', availability: 'Limited availability', nextEvent: 'Euro Tour Â· 20 Nov', verified: true },
  { id: 'p7', initials: 'NP', name: 'Nightshift Presents', city: 'London', memberSince: '2019', description: 'London\'s premiere underground events since 2019.', events: 24, rating: '4.9', reviews: 52, merch: 'ðŸ›ï¸ Merch', availability: 'Available now', nextEvent: 'Nightshift Â· 16 Nov', verified: true },
  { id: 'p8', initials: 'PN', name: 'Paris Nocturne', city: 'Paris', memberSince: '2021', description: 'French electronic music events.', events: 16, rating: '4.6', reviews: 14, merch: null, availability: 'Fully booked', nextEvent: 'Nocturne Â· 14 Nov', verified: true },
  { id: 'p9', initials: 'TN', name: 'Techno Nation', city: 'London', memberSince: '2016', description: 'UK-wide techno events.', events: 31, rating: '4.8', reviews: 67, merch: 'ðŸ›ï¸ Merch', availability: 'Available now', nextEvent: 'Techno All Â· 10 Nov', verified: true },
  { id: 'p10', initials: 'WS', name: 'Warehouse Sessions', city: 'Berlin', memberSince: '2019', description: 'Berlin warehouse parties and industrial raves.', events: 18, rating: '4.7', reviews: 22, merch: null, availability: 'Available now', nextEvent: 'Warehouse Â· 18 Nov', verified: true },
];

const CITIES = ['All', 'London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York'];
const GENRES = ['All', 'Techno', 'House', 'DnB', 'Jazz', 'Indie'];

export default function PromotersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [promoters, setPromoters] = useState<typeof PROMOTERS>(PROMOTERS);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/promoters')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.promoters) && data.promoters.length > 0) {
          const normalised = data.promoters.map((p: any) => {
            const name = p.display_name || 'Unnamed promoter';
            const initials = name
              .split(' ')
              .filter(Boolean)
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);
            return {
              id: p.id,
              name,
              initials,
              city: p.city || '',
              description: p.bio || '',
              verified: !!p.verified,
              events: (typeof p.event_count === 'number' ? p.event_count : (Array.isArray(p.events) ? p.events.length : 0)),
              ticketsSold: p.tickets_sold || 0,
              rating: 0,
              reviews: 0,
              merch: false,
              available: true,
              nextEvent: p.next_event || null,
              instagram: p.instagram || '',
              tiktok: p.tiktok || '',
              youtube: p.youtube || '',
              image: Array.isArray(p.photos) && p.photos[0]
                ? p.photos[0]
                : 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop',
            };
          });
          setPromoters(normalised);
        }
      })
      .catch((err) => console.warn('promoters fetch failed, using mock fallback', err))
      .finally(() => { if (!cancelled) setLiveLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredPromoters = promoters.filter(p => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q)) return false;
    }
    if (selectedCity !== 'All' && p.city !== selectedCity) return false;
    if (verifiedOnly && !p.verified) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      
      <main style={{ flex: 1, paddingTop: 64, width: '100%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>`n          <TopAdBanner />
          
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Discover promoters</h1>
            <p style={{ margin: 0, fontSize: 16, color: '#6b7280' }}>Browse every promoter on GRID. Filter by city and discover who's actively booking artists and running events.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' }} placeholder="Search by name, city, or event focus..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Cities</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => setSelectedCity(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedCity === c ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedCity === c ? '#ffffff' : '#374151' }}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Genres</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GENRES.map(g => (
                <button key={g} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151' }}>{g}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
              Verified promoters only
            </label>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{filteredPromoters.length} promoters found</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filteredPromoters.map(p => {
              const slug = p.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={p.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#7c5cff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
                      {p.initials}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {p.name}
                        {p.verified && <span style={{ color: '#10b981', fontSize: 14 }}>âœ“</span>}
                      </h3>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>{p.city} Â· Member since {p.memberSince}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: 14, color: '#4b5563', margin: 0 }}>{p.description}</p>

                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#374151' }}>
                    <span>ðŸ“… {typeof p.events === 'number' ? p.events : (Array.isArray(p.events) ? p.events.length : 0)} events</span>
                    <span>â­ {p.rating} ({p.reviews})</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                    {p.merch && <span style={{ padding: '4px 10px', borderRadius: 999, background: '#f3f4f6', color: '#374151', fontWeight: 600 }}>{p.merch}</span>}
                    <span style={{ padding: '4px 10px', borderRadius: 999, background: p.availability === 'Fully booked' ? '#fef2f2' : '#f0fdf4', color: p.availability === 'Fully booked' ? '#dc2626' : '#10b981', fontWeight: 600 }}>{p.availability}</span>
                  </div>

                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
                    Next: {p.nextEvent}
                  </div>

                  <button 
                    onClick={() => router.push('/promoters/' + slug + '/join')} 
                    style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    ðŸ† Join Club â€” Â£5/mo
                  </button>

                  <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                    <button onClick={() => router.push('/promoters/' + slug)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      View
                    </button>
                    <button style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                      âœ‰ Book
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

