'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const VENUES = [
  { id: 'v1', name: 'The Blue Note Venue', type: 'Jazz Club', city: 'Shoreditch, London', capacity: 500, rating: 4.9, reviews: 12, bookings: 8, verified: true, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop' },
  { id: 'v2', name: 'Fabric', type: 'Nightclub', city: 'Farringdon, London', capacity: 1600, rating: 4.8, reviews: 45, bookings: 22, verified: true, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop' },
  { id: 'v3', name: 'The Warehouse Project', type: 'Warehouse', city: 'Manchester', capacity: 10000, rating: 4.7, reviews: 89, bookings: 15, verified: true, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop' },
  { id: 'v4', name: 'Village Underground', type: 'Warehouse', city: 'Shoreditch, London', capacity: 700, rating: 4.6, reviews: 34, bookings: 12, verified: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop' },
];

const TYPES = ['All', 'Nightclubs', 'Warehouses', 'Theatres', 'Pubs', 'Bars'];
const CAPACITIES = ['All', 'Under 200', '200-500', '500-1500', '1500+'];
const CITIES = ['All', 'London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York', 'Glasgow', 'Brighton', 'Bristol', 'Amsterdam', 'Barcelona', 'Dublin', 'Leeds'];

export default function DiscoverVenuesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCapacity, setSelectedCapacity] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredVenues = VENUES.filter(v => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !v.city.toLowerCase().includes(q) && !v.type.toLowerCase().includes(q)) return false;
    }
    if (selectedType !== 'All' && !v.type.toLowerCase().includes(selectedType.toLowerCase().replace(/s$/, ''))) return false;
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
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Discover venues</h1>
              <p style={{ margin: 0, fontSize: 16, color: '#6b7280' }}>Browse every venue on GRID. Filter by city, capacity, and venue type. Find the perfect space for your next event.</p>
            </div>
            <button onClick={() => router.push('/advertise')} style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>
              📢 Advertise
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' }} placeholder="Search by name, city, or type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Venue Type</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TYPES.map(t => <button key={t} onClick={() => setSelectedType(t)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedType === t ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedType === t ? '#ffffff' : '#374151' }}>{t}</button>)}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Capacity</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CAPACITIES.map(c => <button key={c} onClick={() => setSelectedCapacity(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedCapacity === c ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedCapacity === c ? '#ffffff' : '#374151' }}>{c}</button>)}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Cities</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CITIES.map(c => <button key={c} onClick={() => setSelectedCity(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedCity === c ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedCity === c ? '#ffffff' : '#374151' }}>{c}</button>)}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
              <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} />
              Available for booking
            </label>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{filteredVenues.length} venues found</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {filteredVenues.map(v => {
              const slug = v.name.toLowerCase().replace(/\s+/g, '-');
              return (
                <div key={v.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ position: 'relative', height: 200, width: '100%', background: '#e5e7eb' }}>
                    <img src={v.image} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {v.verified && <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.95)', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>VERIFIED</div>}
                  </div>
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: '#111827' }}>{v.name}</h3>
                      <p style={{ fontSize: 14, color: '#6b7280', margin: '2px 0 0' }}>{v.type} · {v.city}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 16, padding: '12px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>👥 {v.capacity} cap</span>
                      <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>⭐ {v.rating} ({v.reviews})</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#10b981', fontWeight: 600 }}>📅 Booked {v.bookings} times this month</div>
                    <button onClick={() => router.push('/venues/' + slug + '/join')} style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>🏆 Join Venue Club</button>
                    <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                      <button onClick={() => router.push('/venues/' + slug)} style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View</button>
                      <button style={{ flex: 2, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Enquire →</button>
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