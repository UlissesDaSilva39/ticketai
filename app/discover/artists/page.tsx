'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarIcon, MapPinIcon, UsersIcon, DollarIcon, TagIcon,
  MusicIcon, GiftIcon, XIcon, TrophyIcon, ClockIcon, PlayIcon, ChartIcon, BookmarkIcon, ShareIcon
} from '@/components/people/Icons';

// ============ MOCK DATA ============
const FEATURED_ARTISTS = [
  {
    id: 'f1', name: 'Paper Lions', role: 'Band', genre: 'Jazz Fusion', city: 'Paris',
    followers: '45k', verified: true, price: 2500,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    pastShows: '12 sold-out shows',
  },
  {
    id: 'f2', name: 'DJ Poxy', role: 'DJ', genre: 'House', city: 'London',
    followers: '150k', verified: true, price: 1500,
    image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=400&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop',
    pastShows: '28 sold-out shows',
  },
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
const BUDGETS = ['All', 'Under £500', '£500 - £1,000', '£1,000 - £2,000', '£2,000+'];

// ============ STYLES ============
const s: Record<string, React.CSSProperties> = {
  page: { background: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 },  
  container: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  
  header: { marginBottom: 32 },
  h1: { margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' },
  subtitle: { margin: 0, fontSize: 16, color: '#6b7280' },

  searchRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' },
  searchInput: { border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' },
  searchBtn: { padding: '8px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none',fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  filterSection: { marginBottom: 24 },
  filterLabel: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 8 },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  pill: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151' },
  pillActive: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#111827', border: '1px solid #111827', color: '#ffffff' },

  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' },
  availableToggle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' },
  countText: { fontSize: 14, color: '#6b7280' },

  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 40 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8, margin: 0 },
  sectionSub: { fontSize: 14, color: '#6b7280', margin: 0 },

  featuredGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
  featuredCard: { background: '#ffffff', border: '2px solid #7c5cff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(124,92,255,0.15)' },
  featuredImg: { width: '100%', height: 200, objectFit: 'cover' as const, background: '#f3f4f6' },
  featuredBody: { padding: 20 },
  featuredTitle: { fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#111827' },
  featuredMeta: { fontSize: 13, color: '#6b7280', margin: '0 0 12px' },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 12 },
  badge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#f3f0ff', color: '#7c5cff', display: 'inline-flex', alignItems: 'center', gap: 4 },
  badgeGreen: { background: '#f0fdf4', color: '#10b981' },
  badgeRed: { background: '#fef2f2', color: '#dc2626' },
  featuredPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' },
  featuredPrice: { fontSize: 16, fontWeight: 800, color: '#111827' },
  featuredCta: { padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, display: 'flex',flexDirection: 'column' as const, gap: 12 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' as const, flexShrink: 0 },
  cardName: { fontSize: 16, fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: 6 },
  verifiedIcon: { width: 16, height: 16, color: '#10b981' },
  cardRole: { fontSize: 12, color: '#6b7280', margin: '2px 0 0' },
  cardMeta: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b7280' },
  followersRow: { display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10b981', fontWeight: 600 },
  
  actionRow: { display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f3f4f6', flexWrap: 'wrap' as const },
  btnView: { flex: 1, minWidth: 80, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center' as const, textDecoration: 'none' },
  btnBook: { flex: 1, minWidth: 80, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnFollow: { padding: '10px 14px', borderRadius: 8, background: '#ffffff', border: '1px solid #7c5cff', color: '#7c5cff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnClub: { width: '100%', padding: '10px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff,#ff5c8a)', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  btnClubActive: { width: '100%', padding: '10px 0', borderRadius: 8, background: '#f0fdf4', color: '#065f46', border: '1px solid #10b981', fontSize: 13, fontWeight: 700, cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },

  // Club modal
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display:'grid', placeItems: 'center', zIndex: 100, padding: 24 },
  modal: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' as const, position: 'relative' },
  modalTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 800 },
  modalSub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 },
  
  clubTier: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 12 },
  clubTierFeatured: { border: '2px solid #7c5cff', borderRadius: 12, padding: 20, marginBottom: 12, background: '#faf9ff' },
  clubTierVIP: { border: '1px solid #111827', borderRadius: 12, padding: 20, marginBottom: 12, background: '#111827', color: '#ffffff' },
  clubHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  clubName: { fontSize: 15, fontWeight: 700 },
  clubPrice: { fontSize: 18, fontWeight: 800 },
  clubFeature: { fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 },
  clubBtn: { width: '100%', padding: '12px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 12 },
  clubBtnFeatured: { width: '100%', padding: '12px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 12 },
  clubBtnVIP: { width: '100%', padding: '12px 0', borderRadius: 8, background: '#ffffff', color: '#111827', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 12 },

  // Toast
  toast: { position: 'fixed', bottom: 24, right: 24, background: '#10b981', color: '#ffffff', padding: '14px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600, boxShadow: '0 10px 30px rgba(16,185,129,0.4)', zIndex:200, display: 'flex', alignItems: 'center', gap: 10 },
};

export default function DiscoverArtistsPage() {
  const [type, setType] = useState('All');
  const [genre, setGenre] = useState('All');
  const [city, setCity] = useState('All');
  const [budget, setBudget] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [followed, setFollowed] = useState<string[]>([]);
  const [clubMembers, setClubMembers] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Restore followed + club members from localStorage
    try {
      const savedFollowed = JSON.parse(localStorage.getItem('followed_artists') || '[]');
      const savedClubs = JSON.parse(localStorage.getItem('club_members') || '[]');
      setFollowed(savedFollowed);
      setClubMembers(savedClubs);
    } catch {}
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFollow = (id: string) => {
    const next = followed.includes(id) ? followed.filter(x => x !== id) : [...followed, id];
    setFollowed(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('followed_artists', JSON.stringify(next));
    }
    showToast(followed.includes(id) ? 'Unfollowed' : 'Now following');
  };

  const joinClub = (artist: any, tier: string) => {
    if (!clubMembers.includes(artist.id)) {
      const next = [...clubMembers, artist.id];
      setClubMembers(next);
      if (typeof window !== 'undefined') {
        localStorage.setItem('club_members', JSON.stringify(next));
      }
      showToast(`✓ Joined ${artist.name}'s ${tier}!`);
    }
    setSelectedArtist(null);
  };

  const filtered = ARTISTS.filter(a => {
    if (type !== 'All') {
      const typeMap: Record<string, string[]> = { 'DJs': ['DJ'], 'Producers': ['Producer'], 'Vocalists': ['Singer'], 'Bands': ['Band', 'Group'] };
      if (!typeMap[type]?.includes(a.role)) return false;
    }
    if (genre !== 'All' && a.genre !== genre) return false;
    if (city !== 'All' && a.city !== city) return false;
    if (budget !== 'All') {
      if (budget === 'Under £500' && a.price >= 500) return false;
      if (budget === '£500 - £1,000' && (a.price < 500 || a.price > 1000)) return false;
      if (budget === '£1,000 - £2,000' && (a.price < 1000 || a.price > 2000)) return false;
      if (budget === '£2,000+' && a.price < 2000) return false;
    }
    return true;
  });

  return (
    <main style={s.page}>
      <div style={s.container}>

        <div style={s.header}>
          <h1 style={s.h1}>Discover artists</h1>
          <p style={s.subtitle}>Browse every artist on GRID. Filter by genre, city, and availability. Book DJs, producers, vocalists, and bands for your next event.</p>
        </div>

        <div style={s.searchRow}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65"y2="16.65"></line></svg>
          <input style={s.searchInput} placeholder="Search by name, genre, or city..." />
          <button style={s.searchBtn}>Search</button>
        </div>

        <div style={s.filterSection}>
          <div style={s.filterLabel}>Type</div>
          <div style={s.pillRow}>{TYPES.map(t => (<button key={t} onClick={() => setType(t)} style={type === t ? s.pillActive : s.pill}>{t}</button>))}</div>
        </div>
        
        <div style={s.filterSection}>
          <div style={s.filterLabel}>Genres</div>
          <div style={s.pillRow}>{GENRES.map(g => (<button key={g} onClick={() => setGenre(g)} style={genre === g ? s.pillActive : s.pill}>{g}</button>))}</div>
        </div>

        <div style={s.filterSection}>
          <div style={s.filterLabel}>Cities</div>
          <div style={s.pillRow}>{CITIES.map(c => (<button key={c} onClick={() => setCity(c)} style={city ===c ? s.pillActive : s.pill}>{c}</button>))}</div>
        </div>

        <div style={s.filterSection}>
          <div style={s.filterLabel}>Budget</div>
          <div style={s.pillRow}>{BUDGETS.map(b => (<button key={b} onClick={() => setBudget(b)} style={budget === b ? s.pillActive : s.pill}>{b}</button>))}</div>
        </div>

        <div style={s.filterRow}>
          <label style={s.availableToggle}>
            <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)}/>
            Available for booking
          </label>
          <span style={s.countText}>{filtered.length} artists found</span>
        </div>

        {/* FEATURED */}
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}><TrophyIcon width={20} height={20} /> Featured artists</h2>
          <p style={s.sectionSub}>Verified &amp; available for booking</p>
        </div>
        <div style={s.featuredGrid}>
          {FEATURED_ARTISTS.map(f => (
            <div key={f.id} style={s.featuredCard}>
              <div style={{ position: 'relative' }}>
                <img src={f.banner} alt={f.name} style={s.featuredImg} />
                {f.verified && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.95)',color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    VERIFIED
                  </div>
                )}
              </div>
              <div style={s.featuredBody}>
                <h3 style={s.featuredTitle}>{f.name}</h3>
                <p style={s.featuredMeta}>{f.role} · {f.genre} · {f.city}</p>
                <div style={s.badgeRow}>
                  <span style={{ ...s.badge, ...s.badgeGreen }}><UsersIcon width={12} height={12} /> {f.followers} followers</span>
                  <span style={{ ...s.badge, ...s.badgeGreen }}><TrophyIcon width={12} height={12} /> {f.pastShows}</span>
                </div>
                <div style={s.featuredPriceRow}>
                  <span style={s.featuredPrice}>From £{f.price}</span>
                  <Link href={"/artist/" + f.name.toLowerCase().replace(/\s+/g, "-")} style={s.featuredCta}>View Profile →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>All artists</h2>
          <p style={s.sectionSub}>{filtered.length} found</p>
        </div>
        <div style={s.grid}>
          {filtered.map(a => {
            const isMember = clubMembers.includes(a.id);
            const isFollowed = followed.includes(a.id);
            
            return (
              <div key={a.id} style={s.card}>
                <div style={s.cardHeader}>
                  <img src={a.image} alt={a.name} style={s.avatar} />
                  <div style={{ flex: 1 }}>
                    <h3 style={s.cardName}>
                      {a.name}
                      {a.verified && (<svg style={s.verifiedIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>)}
                    </h3>
                    <p style={s.cardRole}>{a.role} · {a.genre}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: '#6b7280' }}>
                  <span style={s.cardMeta}><MapPinIcon width={12} height={12} /> {a.city} · From £{a.price}</span>
                  <span style={s.followersRow}><UsersIcon width={12} height={12} /> {a.followers} followers · <TrophyIcon width={12} height={12} /> {a.pastShows}</span>
                </div>

                {/* JOIN CLUB BUTTON (primary upsell) */}
                {isMounted && (
                  isMember ? (
                    <div style={s.btnClubActive}>
                      <TrophyIcon width={14} height={14} /> Superfan Member
                    </div>
                  ) : (
                    <button onClick={() => setSelectedArtist(a)} style={s.btnClub}>
                      <TrophyIcon width={14} height={14} /> Join Club — £5/mo
                    </button>
                  )
                )}

                <div style={s.actionRow}>
                  <Link href={"/artist/" + a.name.toLowerCase().replace(/\s+/g, "-")} style={s.btnView}>View</Link>
                  <button onClick={() => showToast("Booking request sent to " + a.name)} style={s.btnBook}>Book</button>
                  {isMounted && !isMember && (
                    <button onClick={() => toggleFollow(a.id)} style={{ ...s.btnFollow, background: isFollowed ? '#7c5cff' : '#ffffff', color: isFollowed ? '#ffffff' : '#7c5cff' }}>
                      {isFollowed ? '✓' : '+ Follow'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* POST CTA */}
        <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 20, padding: 48,marginTop: 64, textAlign: 'center', color: '#ffffff' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>Can't find who you need?</h2>
          <p style={{ fontSize: 16, color: '#9ca3af', margin: '0 0 24px' }}>Post an opportunity and artists will apply.</p>
          <Link href="/opportunities" style={{ padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', fontSize: 15, fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>Post opportunity →</Link>
        </div>

      </div>

      {/* ===== CLUB MODAL ===== */}
      {selectedArtist && (
        <div style={s.overlay} onClick={() => setSelectedArtist(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setSelectedArtist(null)}>
              <XIcon width={20} height={20} />
            </button>
            <h2 style={s.modalTitle}>Join the {selectedArtist.name} Club</h2>
            <p style={s.modalSub}>Get closer to the music. Cancel anytime.</p>

            {/* Free Tier */}
            <div style={s.clubTier}>
              <div style={s.clubHeader}>
                <span style={s.clubName}>Supporter</span>
                <span style={{ ...s.clubPrice, color: '#10b981' }}>FREE</span>
              </div>
              <div style={s.clubFeature}><UsersIcon width={14} height={14} /> Follow {selectedArtist.name}</div>
              <div style={s.clubFeature}><CalendarIcon width={14} height={14} /> Event notifications</div>
              <button onClick={() => joinClub(selectedArtist, 'Supporter')} style={s.clubBtn}>
                Follow for Free
              </button>
            </div>

            {/* Superfan Tier */}
            <div style={s.clubTierFeatured}>
              <div style={s.clubHeader}>
                <span style={s.clubName}>Superfan Club ⭐</span>
                <span style={{ ...s.clubPrice, color: '#7c5cff' }}>£5/mo</span>
              </div>
              <div style={s.clubFeature}><ClockIcon width={14} height={14} /> Early ticket access (24h)</div>
              <div style={s.clubFeature}><MusicIcon width={14} height={14} /> Exclusive unreleased mixes</div>              
              <div style={s.clubFeature}><GiftIcon width={14} height={14} /> 10% off merch</div>
              <div style={s.clubFeature}><ChartIcon width={14} height={14} /> Monthly Q&amp;A</div>
              <button onClick={() => joinClub(selectedArtist, 'Superfan Club')} style={s.clubBtnFeatured}>
                Join Club — £5/mo
              </button>
            </div>

            {/* Stage VIP */}
            <div style={s.clubTierVIP}>
              <div style={s.clubHeader}>
                <span style={s.clubName}>Stage Access</span>
                <span style={s.clubPrice}>£75</span>
              </div>
              <div style={{ ...s.clubFeature, color: '#d1d5db' }}><TrophyIcon width={14} height={14} /> Watchfrom the stage</div>
              <div style={{ ...s.clubFeature, color: '#d1d5db' }}><UsersIcon width={14} height={14} /> Meet {selectedArtist.name} after</div>
              <div style={{ ...s.clubFeature, color: '#d1d5db' }}><GiftIcon width={14} height={14} /> Signed setlist + photo</div>
              <button onClick={() => joinClub(selectedArtist, 'Stage Access')} style={s.clubBtnVIP}>
                Buy Stage Access — £75
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={s.toast}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {toast}
        </div>
      )}
    </main>
  );
}