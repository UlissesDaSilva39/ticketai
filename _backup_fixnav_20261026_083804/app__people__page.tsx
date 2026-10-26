'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TagIcon, UsersIcon, FlameIcon, MailIcon } from '@/components/people/Icons';

// --- Mock Data ---
const PEOPLE = [
  { id: 'echo', initials: 'ER', name: 'Echo Chamber Records', handle: '@echochamber', role: 'Label', city: 'London', desc: 'Independent electronic label.', followers: 0, lookingFor: ['House', 'Techno', 'Deep House'] },
  { id: 'north', initials: 'NM', name: 'Northlight Music', handle: '@northlight', role: 'Label', city: 'Manchester', desc: 'Northern UK independent label.', followers: 0, lookingFor: ['Indie', 'Alt-Rock', 'Ambient'] },
  { id: 'blue', initials: 'BR', name: 'Blue Tower Records', handle: '@bluetower', role: 'Label', city: 'Paris', desc: 'Jazz and soul label.', followers: 0, lookingFor: ['Jazz', 'Soul', 'Neo-Soul'] },
  { id: 'voltage', initials: 'VS', name: 'Voltage Sound', handle: '@voltagesound', role: 'Label', city: 'Berlin', desc: 'Techno and house label.', followers: 0, lookingFor: ['Techno', 'House', 'Minimal'] },
  { id: 'paper', initials: 'PR', name: 'Paper Boat Records', handle: '@paperboat', role: 'Label', city: 'Bristol', desc: 'Indie and folk label.', followers: 0, lookingFor: ['Indie', 'Folk', 'Acoustic'] },
  { id: 'tide', initials: 'TT', name: 'Tide & Time', handle: '@tideandtime', role: 'Label', city: 'Amsterdam', desc: 'Ambient label.', followers: 0, lookingFor: ['Ambient', 'Downtempo'] },
  { id: 'hex', initials: 'HM', name: 'Hexagon Music', handle: '@hexagonmusic', role: 'Label', city: 'London', desc: 'Hip hop and R&B label.', followers: 0, lookingFor: ['Hip-Hop', 'R&B', 'Rap'] },
  { id: 'cathedral', initials: 'CS', name: 'Cathedral Sound', handle: '@cathedralsound', role: 'Label', city: 'Glasgow', desc: 'Post-rock and shoegaze label.', followers: 0, lookingFor: ['Post-Rock', 'Shoegaze'] },
  { id: 'marble', initials: 'MR', name: 'Marble Records', handle: '@marblesrecords', role: 'Label', city: 'Bristol', desc: 'Drum and bass label.', followers: 0, lookingFor: ['DnB', 'Jungle', 'Liquid'] },
  { id: 'kin', initials: 'KR', name: 'Kinfolk Records', handle: '@kinfolkrecords', role: 'Label', city: 'Dublin', desc: 'Folk and acoustic label.', followers: 0, lookingFor: ['Folk', 'Acoustic'] },
];

const FILTERS = [
  { label: 'All', count: 55 },
  { label: 'Fans', count: 23 },
  { label: 'A&R', count: 20 },
  { label: 'Labels', count: 10 },
  { label: 'Newest', count: null },
  { label: 'Most followers', count: null },
  { label: 'Recently joined', count: null },
];

// --- Styles ---
const s: Record<string, React.CSSProperties> = {
  // Layout wrapper
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
  
  // Sidebar styles (matching Your Library)
  sidebar: { background: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 },
  libTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 },
  libList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  libItem: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151', padding: '10px 12px', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s' },
  divider: { height: 1, background: '#f3f4f6', margin: '8px 0' },
  
  promoCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 },
  promoTitleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  promoTitle: { margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' },
  promoDesc: { margin: '0 0 12px', fontSize: 12, color: '#6b7280', lineHeight: 1.4 },
  promoBtn: { width: '100%', padding: '8px 0', borderRadius: 999, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 500, cursor: 'pointer' },

  // Main content styles
  main: { padding: '32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' },
  h1: { margin: '0 0 8px', fontSize: 28, fontWeight: 700, color: '#111827' },
  subtitle: { margin: '0 0 24px', fontSize: 15, color: '#6b7280' },
  
  searchBox: { width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 15, outline: 'none', marginBottom: 24 },
  
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  pill: { padding: '6px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151', display: 'flex', gap: 6, alignItems: 'center' },
  pillActive: { padding: '6px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#111827', border: '1px solid #111827', color: '#ffffff', display: 'flex', gap: 6, alignItems: 'center' },
  pillCount: { fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 999 },
  
  countLabel: { fontSize: 13, color: '#6b7280', marginBottom: 16 },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  
  cardHead: { display: 'flex', gap: 16, alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: '50%', background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  name: { margin: 0, fontSize: 16, fontWeight: 600, color: '#111827' },
  handle: { margin: '2px 0 0', fontSize: 13, color: '#6b7280' },
  meta: { margin: '2px 0 0', fontSize: 13, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 },
  
  desc: { margin: '8px 0', fontSize: 14, color: '#4b5563', lineHeight: 1.5 },
  followerRow: { fontSize: 13, color: '#6b7280', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 },
  
  lookingForBox: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', marginBottom: 16 },
  lookingForTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 },
  lookingForText: { fontSize: 13, color: '#111827', fontWeight: 500 },
  
  actionRow: { display: 'flex', gap: 8, marginTop: 'auto' },
  btnView: { flex: 1, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  btnMessage: { flex: 1, padding: '10px 0', borderRadius: 8, background: '#111827', border: '1px solid #111827', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 },
};

export default function PeopleDirectory() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div style={s.layout}>
      
      {/* ================= LEFT SIDEBAR ================= */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.libTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Your Library
          </div>
          <ul style={s.libList}>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Home
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              Artists
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search
            </li>
            
            <div style={s.divider}></div>
            
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>
              My Tickets
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Friends
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Messages
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              Following
            </li>
            
            <div style={s.divider}></div>
            
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Network
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Opportunities
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Dashboard
            </li>
          </ul>
        </div>

        <div style={s.promoCard}>
          <div style={s.promoTitleRow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <h4 style={s.promoTitle}>Find events near you</h4>
          </div>
          <p style={s.promoDesc}>Browse by city, genre, and date.</p>
          <button style={s.promoBtn}>Explore</button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main style={s.main}>
        <h1 style={s.h1}>People</h1>
        <p style={s.subtitle}>Find artists, promoters, venues, labels, and A&R scouts on GRID.</p>

        <input style={s.searchBox} placeholder="Search by name, @username, city, or genre..." />

        <div style={s.pillRow}>
          {FILTERS.map(f => (
            <button 
              key={f.label} 
              onClick={() => setActiveFilter(f.label)}
              style={activeFilter === f.label ? s.pillActive : s.pill}
            >
              {f.label}
              {f.count !== null && <span style={s.pillCount}>{f.count}</span>}
            </button>
          ))}
        </div>

        <div style={s.countLabel}>10 people found</div>

        <div style={s.grid}>
          {PEOPLE.map(p => (
            <div key={p.id} style={s.card}>
              <div style={s.cardHead}>
                <div style={s.avatar}>{p.initials}</div>
                <div>
                  <h3 style={s.name}>{p.name}</h3>
                  <p style={s.handle}>{p.handle}</p>
                  <p style={s.meta}>
                    <TagIcon width={14} height={14} /> {p.role} · {p.city}
                  </p>
                </div>
              </div>
              
              <p style={s.desc}>"{p.desc}"</p>
              
              <div style={s.followerRow}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <UsersIcon width={14} height={14} /> {p.followers} followers
                </span>
                <span style={{ color: '#10b981' }}>● Active</span>
              </div>
              
              <div style={s.lookingForBox}>
                <div style={s.lookingForTitle}>
                  <FlameIcon width={12} height={12} /> Looking for
                </div>
                <div style={s.lookingForText}>{p.lookingFor.join(', ')}</div>
              </div>

              <div style={s.actionRow}>
                <Link href={`/people/${p.id}`} style={s.btnView}>
                  View
                </Link>
                <button style={s.btnMessage}>
                  <MailIcon width={14} height={14} /> Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
