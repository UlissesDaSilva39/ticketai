'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const EVENTS = [
  { id: 'e1', title: 'Paper Lions Jazz Night', date: 'Tue, 3 Nov', time: '19:16', venue: 'The Blue Note, London', featuring: 'Paper Lions, Nightshift Collective', promoter: 'Nightshift Presents', going: 12, sold: '87% sold', price: 25.00, verified: true, featured: true, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop' },
  { id: 'e2', title: 'Basement Collective Presents', date: 'Mon, 2 Nov', time: '17:16', venue: 'Test 15%, London', featuring: 'DJ Proxy, Analog Dreams', promoter: 'Basement Collective', going: 8, sold: 'Selling fast', price: 20.00, verified: true, featured: true, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=400&auto=format&fit=crop' },
  { id: 'e3', title: 'Analog Dreams Live', date: 'Sat, 24 Oct', time: '18:16', venue: 'Test - First Venue, London', featuring: 'Amelia G, Sam O', promoter: 'Analog Dreams', going: 2, sold: 'Only 15 tickets left', price: 16.00, verified: true, featured: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop' },
  { id: 'e4', title: 'Alice Waves Live', date: 'Tue, 27 Oct', time: '17:16', venue: 'The Blue Note, London', featuring: 'Maya C, Lily M', promoter: 'Nightshift Presents', going: 4, sold: '', price: 14.00, verified: true, featured: false, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop' },
  { id: 'e5', title: 'Voice Records Crew Live', date: 'Thu, 29 Oct', time: '17:16', venue: 'Test 15%, London', featuring: '', promoter: 'Voice Records Crew', going: 4, sold: '', price: 12.00, verified: false, featured: false, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop' },
  { id: 'e6', title: 'Concrete Garden Live', date: 'Thu, 29 Oct', time: '17:16', venue: 'Test 15%, London', featuring: 'Alex M', promoter: 'Concrete Garden', going: 1, sold: '', price: 16.00, verified: true, featured: false, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop' },
  { id: 'e7', title: 'Bobby Beats Garage Night', date: 'Sat, 31 Oct', time: '17:16', venue: 'Test - First Venue, London', featuring: '', promoter: 'Bobby Beats', going: 0, sold: '', price: 15.00, verified: false, featured: false, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=400&auto=format&fit=crop' },
  { id: 'e8', title: 'Ulisses Da Silva Live', date: 'Fri, 6 Nov', time: '17:16', venue: 'Test 15%, London', featuring: 'Amelia G', promoter: 'Nightshift Presents', going: 4, sold: '', price: 22.00, verified: true, featured: false, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop' },
  { id: 'e9', title: 'Warehouse Sessions 12', date: 'Sat, 15 Nov', time: '22:00', venue: 'Basement 44, London', featuring: 'Sam O, Maya C', promoter: 'Warehouse Sessions', going: 10, sold: 'SOLD OUT', price: 0, verified: false, featured: false, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop' },
];

const WHEN_OPTIONS = ['All', 'Tonight', 'This Weekend', 'This Week', 'This Month'];
const CITIES = ['All', 'London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York'];
const GENRES = ['All', 'House', 'Techno', 'Hip-Hop', 'Jazz', 'Electronic', 'Afrobeats'];
const PRICES = ['All', 'Free', 'Under £20', '£20-£50', '£50+'];

export default function DiscoverEventsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWhen, setSelectedWhen] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [sortBy, setSortBy] = useState('Popular');

  const [events, setEvents] = useState<typeof EVENTS>(EVENTS);
  const [liveLoading, setLiveLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/events')
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.events) && data.events.length > 0) {
          const normalised = data.events.map((ev: any) => {
            const start = ev.start_date ? new Date(ev.start_date) : null;
            const dateStr = start
              ? start.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
              : 'TBA';
            const timeStr = start
              ? start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
              : '';
            const priceMin = ev.price_min != null ? Number(ev.price_min) : 0;
            const priceMax = ev.price_max != null ? Number(ev.price_max) : 0;
            const hasRealPrice = priceMin > 0 || priceMax > 0;
            const ticketUrl = ev.ticket_url || null;
            return {
              id: ev.id,
              title: ev.title,
              date: dateStr,
              time: timeStr,
              image: ev.hero_image || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=400&auto=format&fit=crop',
              venue: ev.venues?.name || ev.venue_name || 'Venue TBA',
              city: ev.venues?.city || ev.venue_city || '',
              genre: ev.event_type || 'Event',
              price: priceMin,
              priceMin,
              priceMax,
              hasRealPrice,
              ticketUrl,
              promoter: ev.venues?.name || 'TicketAI',
              featured: !!ev.featured_until || !!ev.featured_tier,
            };
          });
          setEvents(normalised);
        }
      })
      .catch((err) => console.warn('events fetch failed, using mock fallback', err))
      .finally(() => { if (!cancelled) setLiveLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredEvents = events.filter(e => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!e.title.toLowerCase().includes(q) && !e.venue.toLowerCase().includes(q)) return false;
    }
    if (selectedCity !== 'All' && !e.venue.toLowerCase().includes(selectedCity.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, flex: 1, paddingTop: 64, width: 'calc(100% - 260px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Discover events</h1>
              <p style={{ margin: 0, fontSize: 16, color: '#6b7280' }}>Find your next live experience. Filter by date, city, genre, and price.</p>
            </div>
            <button onClick={() => router.push('/advertise')} style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>
               Advertise
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' }} placeholder="Search by event, artist, or venue..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button style={{ padding: '8px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Search</button>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>When</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{WHEN_OPTIONS.map(w => <button key={w} onClick={() => setSelectedWhen(w)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedWhen === w ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedWhen === w ? '#ffffff' : '#374151' }}>{w}</button>)}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Cities</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{CITIES.map(c => <button key={c} onClick={() => setSelectedCity(c)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedCity === c ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedCity === c ? '#ffffff' : '#374151' }}>{c}</button>)}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Genres</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{GENRES.map(g => <button key={g} onClick={() => setSelectedGenre(g)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedGenre === g ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedGenre === g ? '#ffffff' : '#374151' }}>{g}</button>)}</div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>Price & Sort</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {PRICES.map(p => <button key={p} onClick={() => setSelectedPrice(p)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedPrice === p ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedPrice === p ? '#ffffff' : '#374151' }}>{p}</button>)}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Sort:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, cursor: 'pointer' }}>
                  <option>Popular</option>
                  <option>Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' }}>Featured this week</h2>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, margin: 0 }}>Premium events</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
              {events.filter(e => e.featured).map(e => (
                <div key={e.id} style={{ background: '#ffffff', border: '2px solid #7c5cff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(124,92,255,0.15)' }}>
                  <div style={{ position: 'relative', height: 180, width: '100%', background: '#e5e7eb' }}>
                    <img src={e.image} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    {e.verified && <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.95)', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>VERIFIED</div>}
                  </div>
                  <div style={{ padding: 20 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#111827' }}>{e.title}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 12px' }}>{e.date} · {e.time} · {e.venue}</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#f0fdf4', color: '#10b981' }}> {e.going} going</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#fef2f2', color: '#dc2626' }}>{e.sold}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>From £{e.price.toFixed(2)}</span>
                      <button onClick={() => router.push('/events/' + e.id)} style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Get Tickets</button>
                    </div>
                    <button onClick={() => router.push('/promoters/' + e.promoter.toLowerCase().replace(/\s+/g, '-') + '/join')} style={{ width: '100%', padding: '8px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}> Join {e.promoter} Club</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: '#111827' }}>All events</h2>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, margin: 0 }}>{filteredEvents.length} events found</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {filteredEvents.map(e => (
                <div key={e.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <img src={e.image} alt={e.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>{e.title}</h3>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 8px' }}>{e.date} · {e.time}</p>
                    <p style={{ fontSize: 13, color: '#374151', margin: '0 0 12px' }}>{e.venue}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>
                        {e.hasRealPrice
                          ? (e.priceMin === e.priceMax
                              ? 'From £' + e.priceMin.toFixed(2)
                              : 'From £' + e.priceMin.toFixed(2) + ' – £' + e.priceMax.toFixed(2))
                          : (e.ticketUrl ? 'See price on Ticketmaster' : 'Tickets TBA')}
                      </span>
                      {e.ticketUrl ? (
                        <a
                          href={e.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: '8px 16px', borderRadius: 6, background: '#111827', color: '#ffffff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                        >
                          Get Tickets ↗
                        </a>
                      ) : (
                        <button onClick={() => router.push('/events/' + e.id)} style={{ padding: '8px 16px', borderRadius: 6, background: '#111827', color: '#ffffff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Details</button>
                      )}
                    </div>
                    <button onClick={() => router.push('/promoters/' + e.promoter.toLowerCase().replace(/\s+/g, '-') + '/join')} style={{ width: '100%', padding: '8px 0', borderRadius: 8, background: '#f3f4f6', color: '#111827', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginTop: 12 }}> Join Club</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


