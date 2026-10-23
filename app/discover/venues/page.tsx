'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

// ============ SVG ICONS ============
const IconLocation = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconStar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconCalendar = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconUsers = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconTrophy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

// ============ MOCK DATA ============
const FALLBACK_VENUES = [
  { id: 'v1', name: 'The Blue Note Venue', type: 'Jazz Club', city: 'Shoreditch, London', capacity: 500, rating: 4.9, reviews: 12, bookings: 8, verified: true, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { id: 'v2', name: 'Fabric', type: 'Nightclub', city: 'Farringdon, London', capacity: 1600, rating: 4.8, reviews: 45, bookings: 22, verified: true, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop' },
  { id: 'v3', name: 'The Warehouse Project', type: 'Warehouse', city: 'Manchester', capacity: 10000, rating: 4.7, reviews: 89, bookings: 15, verified: true, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop' },
  { id: 'v4', name: 'Village Underground', type: 'Warehouse', city: 'Shoreditch, London', capacity: 700, rating: 4.6, reviews: 34, bookings: 12, verified: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
];

const TYPES = ['All', 'Nightclubs', 'Warehouses', 'Theatres', 'Pubs', 'Bars'];
const CAPACITIES = ['All', 'Under 200', '200-500', '500-1500', '1500+'];
const CITIES = ['All', 'London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York', 'Glasgow', 'Brighton', 'Bristol', 'Amsterdam', 'Barcelona', 'Dublin', 'Leeds'];

const s: Record<string, React.CSSProperties> = {
  page: { background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 },
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  header: { marginBottom: 32 },
  h1: { margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' },
  subtitle: { margin: 0, fontSize: 16, color: '#6b7280' },
  
  searchRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' },
  searchInput: { border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' },
  searchBtn: { padding: '8px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  filterSection: { marginBottom: 24 },
  filterLabel: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 8 },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  pill: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151', transition: 'all 0.2s' },
  pillActive: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#111827', border: '1px solid #111827', color: '#ffffff' },

  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' },
  availableToggle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' },
  countText: { fontSize: 14, color: '#6b7280' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 },
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
  const [venues, setVenues] = useState<any[]>(FALLBACK_VENUES);
  const [clubMembers, setClubMembers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);

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

  const filteredVenues = venues.filter(v => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = v.name.toLowerCase().includes(q);
      const matchCity = v.city.toLowerCase().includes(q);
      const matchType = v.type.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchType) return false;
    }
    if (selectedType !== 'All') {
      if (!v.type.toLowerCase().includes(selectedType.toLowerCase().replace(/s$/, ''))) return false;
    }
    if (selectedCapacity !== 'All') {
      if (selectedCapacity === 'Under 200' && v.capacity >= 200) return false;
      if (selectedCapacity === '200-500' && (v.capacity < 200 || v.capacity > 500)) return false;
      if (selectedCapacity === '500-1500' && (v.capacity < 500 || v.capacity > 1500)) return false;
      if (selectedCapacity === '1500+' && v.capacity < 1500) return false;
    }
    if (selectedCity !== 'All' && !v.city.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, flex: 1, paddingTop: 64, width: 'calc(100% - 260px)' }}>
        <div style={s.container}>
          <div style={s.header}>
            <h1 style={s.h1}>Discover venues</h1>
            <p style={s.subtitle}>Browse every venue on GRID. Filter by city, capacity, and venue type. Find the perfect space for your next event.</p>
          </div>

          {/* SEARCH BAR */}
          <div style={s.searchRow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              style={s.searchInput} 
              placeholder="Search by name, city, or type..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button style={s.searchBtn}>Search</button>
          </div>

          {/* FILTERS */}
          <div style={s.filterSection}>
            <div style={s.filterLabel}>Venue Type</div>
            <div style={s.pillRow}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setSelectedType(t)} style={selectedType === t ? s.pillActive : s.pill}>{t}</button>
              ))}
            </div>
          </div>

          <div style={s.filterSection}>
            <div style={s.filterLabel}>Capacity</div>
            <div style={s.pillRow}>
              {CAPACITIES.map(c => (
                <button key={c} onClick={() => setSelectedCapacity(c)} style={selectedCapacity === c ? s.pillActive : s.pill}>{c}</button>
              ))}
            </div>
          </div>

          <div style={s.filterSection}>
            <div style={s.filterLabel}>Cities</div>
            <div style={s.pillRow}>
              {CITIES.map(c => (
                <button key={c} onClick={() => setSelectedCity(c)} style={selectedCity === c ? s.pillActive : s.pill}>{c}</button>
              ))}
            </div>
          </div>

          <div style={s.filterRow}>
            <label style={s.availableToggle}>
              <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)}/>
              Available for booking
            </label>
            <span style={s.countText}>{filteredVenues.length} venues found</span>
          </div>

          {/* VENUE GRID */}
          <div style={s.grid}>
            {filteredVenues.map((v: any) => {
              const isMember = clubMembers.includes(v.id);
              const slug = v.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={v.id} style={s.card}>
                  <div style={s.cardImageContainer}>
                    <img src={v.image || ''} alt={v.name} style={s.cardImage} />
                    {v.verified && (
                      <div style={s.verifiedBadge}>
                        <IconCheck /> VERIFIED
                      </div>
                    )}
                  </div>
                  
                  <div style={s.cardBody}>
                    <div>
                      <h3 style={s.cardTitle}>{v.name}</h3>
                      <div style={s.cardMeta}>
                        <IconLocation /> {v.type} &middot; {v.city}
                      </div>
                    </div>

                    <div style={s.statRow}>
                      <span style={s.statItem}><IconUsers /> {v.capacity} cap</span>
                      <span style={s.statItem}><IconStar /> {v.rating} ({v.reviews})</span>
                    </div>
                    
                    <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconCalendar /> Booked {v.bookings} times this month
                    </div>

                    {isMounted && (
                      isMember ? (
                        <div style={s.btnClubActive}>
                          <IconTrophy /> Venue Club Member
                        </div>
                      ) : (
                        <button onClick={() => router.push('/venues/' + slug + '/join')} style={s.btnClub}>
                          <IconTrophy /> Join Venue Club
                        </button>
                      )
                    )}

                    <div style={s.actionRow}>
                      <button onClick={() => router.push('/venues/' + slug)} style={s.btnView}>View</button>
                      <button style={s.btnEnquire}>Enquire &rarr;</button>
                    </div>
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