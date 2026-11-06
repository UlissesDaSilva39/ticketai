'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

const s: Record<string, CSSProperties> = {
  layout: { display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '24px', gap: '32px', maxWidth: '1440px', margin: '0 auto' },
  
  // Sidebar (Exact match to attachment)
  sidebar: { display: 'flex', flexDirection: 'column', gap: '24px' },
  sidebarCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' },
  libTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px' },
  libList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
  libItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' },
  libItemActive: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#111827', fontWeight: 600, background: '#f3f4f6', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer' },
  divider: { height: '1px', background: '#f3f4f6', margin: '8px 0' },
  
  // Promo Card
  promoCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' },
  promoTitleRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  promoTitle: { margin: 0, fontSize: '15px', fontWeight: 600, color: '#111827' },
  promoDesc: { margin: '0 0 16px', fontSize: '13px', color: '#6b7280', lineHeight: 1.5 },
  promoBtn: { width: '100%', padding: '10px 0', borderRadius: '999px', background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: '14px', fontWeight: 500, cursor: 'pointer' },

  // Main Content
  main: { paddingBottom: 100 },
  
  // Banner
  banner: { height: 280, backgroundImage: 'url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', borderRadius: '24px', overflow: 'hidden' },
  bannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' },
  bannerContent: { position: 'absolute', bottom: 32, left: '40px', right: '40px', display: 'flex', alignItems: 'flex-end', gap: 24 },
  avatar: { width: 96, height: 96, borderRadius: '50%', background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: 32, fontWeight: 700, border: '4px solid #ffffff', flexShrink: 0 },
  artistName: { margin: 0, fontSize: 36, fontWeight: 800, color: '#ffffff' },
  artistMeta: { margin: '4px 0 0', fontSize: 15, color: '#e5e7eb' },
  availability: { margin: '4px 0 0', fontSize: 13, color: '#10b981', fontWeight: 500 },
  
  // Actions in Banner
  actionRow: { display: 'flex', gap: 12, paddingBottom: 8 },
  btnBook: { padding: '12px 28px', borderRadius: 999, background: '#ffffff', color: '#111827', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' },
  btnFollow: { padding: '12px 28px', borderRadius: 999, background: 'transparent', color: '#ffffff', border: '1px solid #ffffff', fontSize: 15, fontWeight: 700, cursor: 'pointer' },

  // Content Body
  contentWrap: { padding: '32px 0' },
  
  // Profile Song Player
  playerCard: { background: '#111827', borderRadius: 16, padding: 24, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 },
  playBtn: { width: 56, height: 56, borderRadius: '50%', background: '#ef4444', border: 'none', color: '#ffffff', fontSize: 24, cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 },
  progressBar: { flex: 1, height: 6, background: '#374151', borderRadius: 3, marginTop: 12, position: 'relative' },
  progressFill: { position: 'absolute', left: 0, top: 0, height: '100%', width: '40%', background: '#ffffff', borderRadius: 3 },

  // Tabs
  tabRow: { display: 'flex', gap: 24, borderBottom: '1px solid #e5e7eb', marginBottom: 24, overflowX: 'auto' },
  tabActive: { paddingBottom: 12, fontSize: 15, cursor: 'pointer', borderBottom: '2px solid #111827', fontWeight: 600, color: '#111827', whiteSpace: 'nowrap' },
  tabInactive: { paddingBottom: 12, fontSize: 15, cursor: 'pointer', color: '#6b7280', whiteSpace: 'nowrap' },

  section: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 },
  sectionTitle: { margin: '0 0 16px', fontSize: 20, fontWeight: 600, color: '#111827' },
  trackRow: { display: 'flex', alignItems: 'center', padding: '12px 16px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 },
  
  // Top 8
  top8Grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  top8Card: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  top8Avatar: { width: 56, height: 56, borderRadius: '50%', background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 18 },

  // Merch
  merchGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 },
  merchCard: { border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: '#ffffff' },
  merchImg: { width: '100%', height: 200, objectFit: 'cover', background: '#f3f4f6' },
  merchBody: { padding: 16 },
  
  // About
  aboutText: { fontSize: 15, color: '#374151', lineHeight: 1.6 },
};

export default function PublicArtistPage() {
  const [activeTab, setActiveTab] = useState<'music' | 'events' | 'merch' | 'top8' | 'about'>('music');
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div style={s.layout}>
      
      {/* Left Sidebar (Matches Attachment Exactly) */}
      <aside style={s.sidebar}>
        <div style={s.sidebarCard}>
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

      {/* Main Content */}
      <main style={s.main}>
        
        {/* Banner */}
        <div style={s.banner}>
          <div style={s.bannerOverlay} />
          <div style={s.bannerContent}>
            <div style={s.avatar}>DP</div>
            <div style={{ flex: 1 }}>
              <h1 style={s.artistName}>DJ Poxy</h1>
              <p style={s.artistMeta}>London · House / Techno · ⭐ 4.9 (42 reviews) · 150k monthly listeners</p>
              <p style={s.availability}>📍 Available for UK/EU Tour (Nov-Dec)</p>
            </div>
            <div style={s.actionRow}>
              <button style={s.btnBook}>✉ Book Me</button>
              <button style={s.btnFollow}>♡ Follow</button>
            </div>
          </div>
        </div>

        <div style={s.contentWrap}>
          
          {/* Profile Song Player */}
          <div style={s.playerCard}>
            <button style={s.playBtn} onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '⏸' : '▶'}
            </button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Spotlight Track</div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Midnight Sessions (Latest)</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <div style={s.progressBar}>
                  <div style={s.progressFill} />
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>2:45 / 5:12</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={s.tabRow}>
            <span onClick={() => setActiveTab('music')} style={activeTab === 'music' ? s.tabActive : s.tabInactive}>Music</span>
            <span onClick={() => setActiveTab('events')} style={activeTab === 'events' ? s.tabActive : s.tabInactive}>Events</span>
            <span onClick={() => setActiveTab('merch')} style={activeTab === 'merch' ? s.tabActive : s.tabInactive}>Merch</span>
            <span onClick={() => setActiveTab('top8')} style={activeTab === 'top8' ? s.tabActive : s.tabInactive}>Trusted By (Top 8)</span>
            <span onClick={() => setActiveTab('about')} style={activeTab === 'about' ? s.tabActive : s.tabInactive}>About</span>
          </div>

          {/* Tab Content */}
          {activeTab === 'music' && (
            <div>
              <h2 style={s.sectionTitle}>Popular Tracks</h2>
              {['Neon London', 'After Hours', 'Static Love'].map((track, i) => (
                <div key={track} style={s.trackRow}>
                  <span style={{ width: 24, color: '#9ca3af', fontSize: 14 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14, color: '#111827' }}>{track}</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>▶</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div>
              <h2 style={s.sectionTitle}>Upcoming Shows</h2>
              <div style={s.section}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>Warehouse Project</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>Nov 15, 2026 · London</div>
                  </div>
                  <button style={{ padding: '8px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Get Tickets</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'merch' && (
            <div>
              <h2 style={s.sectionTitle}>Official Merch</h2>
              <div style={s.merchGrid}>
                {[
                  { name: 'Tour Tee 2026', price: '£25.00', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400&auto=format&fit=crop' },
                  { name: 'Logo Hoodie', price: '£55.00', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=400&auto=format&fit=crop' },
                  { name: 'Signed Vinyl', price: '£30.00', img: 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=400&auto=format&fit=crop' }
                ].map(item => (
                  <div key={item.name} style={s.merchCard}>
                    <img src={item.img} alt={item.name} style={s.merchImg} />
                    <div style={s.merchBody}>
                      <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#111827' }}>{item.name}</h3>
                      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#4b5563' }}>{item.price}</p>
                      <button style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'top8' && (
            <div>
              <h2 style={s.sectionTitle}>Trusted By</h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Promoters DJ Poxy has worked with.</p>
              <div style={s.top8Grid}>
                {[
                  { initials: 'NP', name: 'Nightshift Presents' },
                  { initials: 'TN', name: 'Techno Nation' },
                  { initials: 'WS', name: 'Warehouse Sessions' },
                  { initials: 'AD', name: 'Amsterdam Dance' },
                ].map(p => (
                  <div key={p.name} style={s.top8Card}>
                    <div style={s.top8Avatar}>{p.initials}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <h2 style={s.sectionTitle}>About DJ Poxy</h2>
              <p style={s.aboutText}>
                I'm DJ Poxy. I play House and Techno. Based in London, but I'll travel for the right gig. I've played Basement 44, Warehouse Project, and Printworks. I like long sets and crowds that actually dance. If you're a promoter, hit the Book Me button. I respond within 2h.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
