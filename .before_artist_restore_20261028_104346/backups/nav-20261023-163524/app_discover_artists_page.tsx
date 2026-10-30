'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const FEATURED_ARTISTS = [
  { id: 'f1', name: 'Paper Lions', role: 'Band', genre: 'Jazz Fusion', city: 'Paris', followers: '45k', verified: true, price: 2500, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop', pastShows: '12 sold-out shows' },
  { id: 'f2', name: 'DJ Poxy', role: 'DJ', genre: 'House', city: 'London', followers: '150k', verified: true, price: 1500, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=400&auto=format&fit=crop', pastShows: '28 sold-out shows' },
];

const ARTISTS = [
  { id: '1', name: 'Basement Collective', role: 'Band', genre: 'Techno', city: 'London', followers: '12k', verified: true, price: 800, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', pastShows: '5 sold-out shows' },
  { id: '3', name: 'Frost and Fire', role: 'Band', genre: 'Post-Rock', city: 'Glasgow', followers: '5k', verified: true, price: 600, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200&auto=format&fit=crop', pastShows: '2 shows' },
  { id: '4', name: 'Paper Lions', role: 'Band', genre: 'Jazz Fusion', city: 'Paris', followers: '45k', verified: true, price: 2500, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop', pastShows: '12 sold-out shows' },
  { id: '5', name: 'Ulisses Da Silva', role: 'Singer', genre: 'MPB', city: 'London', followers: '22k', verified: true, price: 1200, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop', pastShows: '8 shows' },
  { id: '6', name: 'Voice Records Crew', role: 'Group', genre: 'Hip Hop', city: 'Manchester', followers: '18k', verified: true, price: 1000, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop', pastShows: '6 shows' },
  { id: '7', name: 'Alex Morgan', role: 'A&R', genre: 'electronic', city: 'London', followers: '35k', verified: false, price: 500, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', pastShows: '1 show' },
  { id: '8', name: 'Alice Waves', role: 'Singer', genre: 'Synth Pop', city: 'Manchester', followers: '28k', verified: false, price: 900, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop', pastShows: '4 shows' },
  { id: '9', name: 'Analog Dreams', role: 'Band', genre: 'Drum & Bass', city: 'Bristol', followers: '15k', verified: false, price: 700, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', pastShows: '3 shows' },
  { id: '10', name: 'Bobby Beats', role: 'Producer', genre: 'UK Garage', city: 'London', followers: '9k', verified: false, price: 450, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop', pastShows: '2 shows' },
  { id: '11', name: 'Charlie Sounds', role: 'Singer', genre: 'Indie', city: 'Brighton', followers: '11k', verified: false, price: 550, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200&auto=format&fit=crop', pastShows: '0 shows' },
  { id: '12', name: 'Concrete Garden', role: 'Band', genre: 'Industrial', city: 'Berlin', followers: '20k', verified: false, price: 1100, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop', pastShows: '5 shows' },
  { id: '13', name: 'DJ Poxy', role: 'DJ', genre: 'House', city: 'London', followers: '150k', verified: true,price: 1500, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', pastShows: '28 sold-out shows' },
  { id: '15', name: 'Electric Tide', role: 'Band', genre: 'House', city: 'Brighton', followers: '14k', verified: false, price: 650, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', pastShows: '2 shows' },
  { id: '16', name: 'Midnight Arcade', role: 'Producer', genre: 'Retro Wave', city: 'London', followers: '22k', verified: false, price: 850, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop', pastShows: '7 shows' },
  { id: '17', name: 'Moonlit Roads', role: 'Singer', genre: 'Folk', city: 'Leeds', followers: '7k', verified:false, price: 350, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', pastShows: '0 shows' },
  { id: '18', name: 'Neon Circuit', role: 'Band', genre: 'Techno', city: 'Amsterdam', followers: '32k', verified: false, price: 1300, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop', pastShows: '9 shows' },
  { id: '19', name: 'Pomoer Odyssey', role: 'Producer', genre: 'Ambient', city: 'Berlin', followers: '11k', verified: false, price: 500, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=200&auto=format&fit=crop', pastShows: '3 shows' },
  { id: '20', name: 'Rooftop Sunsets', role: 'Band', genre: 'Balearic', city: 'Barcelona', followers: '19k', verified: false, price: 950, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop', pastShows: '4 shows' },
  { id: '21', name: 'Signal Lost', role: 'Band', genre: 'Electronic', city: 'Dublin', followers: '6k', verified: false, price: 400, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop', pastShows: '1 show' },
  { id: '22', name: 'Static Bloom', role: 'Band', genre: 'Shoegaze', city: 'Birmingham', followers: '8k', verified: false, price: 450, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', pastShows: '2 shows' },
  { id: '23', name: 'Sugarplum Trio', role: 'Band', genre: 'Jazz', city: 'Bristol', followers: '13k', verified: false, price: 700, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop', pastShows: '5 shows' },
];

const TYPES = ['All', 'DJs', 'Producers', 'Vocalists', 'Bands'];
const GENRES = ['All', 'House', 'Techno', 'Hip-Hop', 'Jazz', 'Electronic', 'Afrobeats'];
const CITIES = ['All', 'London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York', 'Glasgow', 'Brighton', 'Bristol', 'Amsterdam', 'Barcelona', 'Dublin', 'Leeds'];

export default function ArtistsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  const filteredArtists = ARTISTS.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.city.toLowerCase().includes(q) && !a.genre.toLowerCase().includes(q)) return false;
    }
    if (selectedType !== 'All') {
      const typeMap: Record<string, string[]> = { 'DJs': ['DJ'], 'Producers': ['Producer'], 'Vocalists': ['Singer'], 'Bands': ['Band', 'Group'] };
      if (!typeMap[selectedType]?.includes(a.role)) return false;
    }
    if (selectedGenre !== 'All' && a.genre !== selectedGenre) return false;
    if (selectedCity !== 'All' && a.city !== selectedCity) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, flex: 1, paddingTop: 64, width: 'calc(100% - 260px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Discover artists</h1>
              <p style={{ margin: 0, fontSize: 16, color: '#6b7280' }}>Browse every artist on GRID. Filter by genre, city, and availability.</p>
            </div>
            <button onClick={() => router.push('/advertise')} style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>
              📢 Advertise
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' }} placeholder="Search by name, genre, or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Type</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setSelectedType(t)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedType === t ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedType === t ? '#ffffff' : '#374151' }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Genres</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {GENRES.map(g => (
                <button key={g} onClick={() => setSelectedGenre(g)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedGenre === g ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedGenre === g ? '#ffffff' : '#374151' }}>{g}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Cities</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CITIES.map(c => (
                <button key={c} onClick={() => setSelectedCity(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedCity === c ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedCity === c ? '#ffffff' : '#374151' }}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{filteredArtists.length} artists found</span>
          </div>

          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' }}>Featured artists</h2>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, margin: 0 }}>Verified & available for booking</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {FEATURED_ARTISTS.map((f) => (
                <div key={f.id} style={{ background: '#ffffff', border: '2px solid #7c5cff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(124,92,255,0.15)' }}>
                  <div style={{ position: 'relative', height: 180, width: '100%', background: '#e5e7eb' }}>
                    <img src={f.image} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {f.verified && <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.95)', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>VERIFIED</div>}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#111827' }}>{f.name}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>{f.role} · {f.genre} · {f.city}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#f0fdf4', color: '#10b981' }}>👥 {f.followers} followers</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#f0fdf4', color: '#10b981' }}>🏆 {f.pastShows}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>From £{f.price}</span>
                      <button onClick={() => router.push('/artist/' + f.name.toLowerCase().replace(/\s+/g, '-'))} style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View Profile &rarr;</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' }}>All artists</h2>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, margin: 0 }}>{filteredArtists.length} found</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filteredArtists.map(a => {
                return (
                  <div key={a.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={a.image} alt={a.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>{a.name}</h3>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0' }}>{a.role} · {a.genre}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: '#6b7280' }}>
                      <span>📍 {a.city} · From £{a.price}</span>
                      <span style={{ color: '#10b981', fontWeight: 600 }}>👥 {a.followers} followers · {a.pastShows}</span>
                    </div>
                    <button onClick={() => router.push('/artists/' + a.name.toLowerCase().replace(/\s+/g, '-') + '/join')} style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>🏆 Join Club — £5/mo</button>
                    <div style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                      <button onClick={() => router.push('/artist/' + a.name.toLowerCase().replace(/\s+/g, '-'))} style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>View</button>
                      <button style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Book</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📢</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>Promote your event here</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Reach thousands of promoters and artists on GRID.</p>
              </div>
            </div>
            <button onClick={() => window.location.href = '/advertise'} style={{ padding: '10px 24px', borderRadius: 8, background: '#111827', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none' }}>Advertise Now</button>
          </div>

        </div>
      </main>
    </div>
  );
}