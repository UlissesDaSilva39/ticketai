const [showFilters, setShowFilters] = useState(false);

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

// ============ SVG ICONS ============
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IconTrophy = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const IconLocation = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconMegaphone = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;

// ============ MOCK DATA ============
const EVENTS = [
  { id: 'e1', title: 'Paper Lions Jazz Night', date: 'Tue, 3 Nov', venue: 'The Blue Note, London', price: 25.00, promoter: 'Nightshift Presents', verified: true, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop' },
  { id: 'e2', title: 'Basement Collective Presents', date: 'Mon, 2 Nov', venue: 'Test 15%, London', price: 20.00, promoter: 'Basement Collective', verified: true, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=400&auto=format&fit=crop' },
  { id: 'e3', title: 'Analog Dreams Live', date: 'Sat, 24 Oct', venue: 'Test - First Venue, London', price: 16.00, promoter: 'Analog Dreams', verified: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop' },
  { id: 'e4', title: 'Alice Waves Live', date: 'Tue, 27 Oct', venue: 'The Blue Note, London', price: 14.00, promoter: 'Nightshift Presents', verified: true, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop' },
];

const ARTISTS = [
  { id: 'a1', name: 'Alex Morgan', genre: 'electronic', city: 'London', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { id: 'a2', name: 'Alice Waves', genre: 'Synth Pop', city: 'Manchester', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop' },
  { id: 'a3', name: 'Analog Dreams', genre: 'Drum & Bass', city: 'Bristol', image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop' },
  { id: 'a4', name: 'DJ Poxy', genre: 'House', city: 'London', image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop' },
];

const SUGGESTIONS = ['Fabric', 'Paper Lions', 'Nightshift Presents', 'Techno London', 'Free Tonight'];

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [isMounted, setIsMounted] = useState(false);
  const [clubMembers, setClubMembers] = useState<string[]>([]);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedClubs = JSON.parse(localStorage.getItem('promoter_club_members') || '[]');
      setClubMembers(savedClubs);
    } catch {}
  }, []);

  const toggleClub = (promoter: string) => {
    if (clubMembers.includes(promoter)) return;
    const next = [...clubMembers, promoter];
    setClubMembers(next);
    localStorage.setItem('promoter_club_members', JSON.stringify(next));
  };

  const filteredEvents = EVENTS.filter(e => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q) && !e.promoter.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const filteredArtists = ARTISTS.filter(a => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.city.toLowerCase().includes(q) && !a.genre.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, flex: 1, paddingTop: 64, width: 'calc(100% - 260px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Search</h1>
            <p style={{ margin: 0, fontSize: 16, color: '#6b7280' }}>Find events, artists, and venues on GRID.</p>
          </div>

          {/* PREMIUM SEARCH BAR WITH SUGGESTIONS */}
          <div style={{ marginBottom: 32, position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              padding: '8px 8px 8px 24px', 
              borderRadius: 16, 
              background: '#ffffff', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <span style={{ color: '#7c5cff' }}><IconSearch /></span>
              <input 
                style={{ border: 'none', outline: 'none', fontSize: 18, flex: 1, color: '#111827', background: 'transparent', padding: '12px 0' }} 
                placeholder="Search events, artists, or venues..." 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              <button onClick={() => setShowFilters(!showFilters)} style={{ padding: '12px 16px', borderRadius: 10, background: '#f3f4f6', color: '#374151', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <IconFilter /> Filters
              </button>
              <button onClick={() => { /* search is reactive */ }} style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Search
              </button>
            </div>

            {/* SUGGESTIONS DROPDOWN */}
            {showSuggestions && !searchQuery && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', marginTop: 8, zIndex: 10, padding: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', padding: '8px 12px', margin: 0, textTransform: 'uppercase' }}>Popular Searches</p>
                {SUGGESTIONS.map(term => (
                  <button key={term} onClick={() => { setSearchQuery(term); setShowSuggestions(false); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px', borderRadius: 8, background: 'none', border: 'none', fontSize: 14, color: '#374151', cursor: 'pointer', fontWeight: 500 }}>
                    <span style={{ marginRight: 8, color: '#9ca3af' }}><IconSearch /></span> {term}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* FILTER PILLS */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
            {['All', 'Tonight', 'This Weekend', 'Free', 'Verified'].map(f => (
              <button key={f} style={{ padding: '8px 16px', borderRadius: 999, background: f === 'All' ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: f === 'All' ? 'white' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                {f}
              </button>
            ))}
          </div>

          {/* EVENTS SECTION */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' }}>Events</h2>
              <span style={{ fontSize: 14, color: '#6b7280' }}>{filteredEvents.length} found</span>
            </div>
            
            {filteredEvents.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {filteredEvents.map(e => {
                  const isMember = clubMembers.includes(e.promoter);
                  return (
                    <div key={e.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: 160 }}>
                        <img src={e.image} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {e.verified && <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.95)', color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>VERIFIED</div>}
                      </div>
                      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{e.title}</h3>
                        <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>{e.date} · {e.venue}</p>
                        <p style={{ fontSize: 12, color: '#7c5cff', fontWeight: 600, margin: '0 0 12px' }}>{e.promoter}</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700 }}>From £{e.price.toFixed(2)}</span>
                          <button onClick={() => router.push('/events/' + e.id)} style={{ padding: '8px 16px', borderRadius: 6, background: '#111827', color: 'white', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tickets</button>
                        </div>

                        {/* JOIN CLUB BUTTON WITH SVG */}
                        <button 
                          onClick={() => router.push('/promoters/' + e.promoter.toLowerCase().replace(/\s+/g, '-') + '/join')} 
                          style={{ width: '100%', padding: '8px 0', borderRadius: 6, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        >
                          <IconTrophy /> Join {e.promoter} Club
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 24px', background: '#ffffff', borderRadius: 16, border: '1px dashed #d1d5db' }}>
                <p style={{ fontSize: 18, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>No events match your search.</p>
                <button onClick={() => setSearchQuery('')} style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Clear search</button>
              </div>
            )}
          </div>

          {/* ARTISTS SECTION */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' }}>Artists</h2>
              <span style={{ fontSize: 14, color: '#6b7280' }}>{filteredArtists.length} found</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filteredArtists.map(a => (
                <div key={a.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={a.image} alt={a.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{a.name}</h3>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <IconLocation /> {a.genre} · {a.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADVERTISE BANNER */}
          <div style={{ marginTop: 64, background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: '24px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}><IconMegaphone /></div>
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