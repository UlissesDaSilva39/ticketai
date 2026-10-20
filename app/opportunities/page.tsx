'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TagIcon,
  FlameIcon,
  CalendarIcon,
  ChartIcon,
  MusicIcon,
  MailIcon,
  GiftIcon,
  UsersIcon,
  MapPinIcon,
  DollarIcon,
  ShareIcon,
  BookmarkIcon,
} from '@/components/people/Icons';

const OPPORTUNITIES = [
  {
    id: '1',
    poster: 'XYZ Events',
    verified: true,
    title: 'DJ WANTED',
    type: 'Gig',
    location: 'London, UK',
    pay: '£500 - £1,000',
    genre: 'House / Techno',
    deadline: 'Nov 20',
    desc: 'Looking for a resident DJ for our new Saturday night party series at a 300-cap venue.',
    featured: false,
  },
  {
    id: '2',
    poster: 'Independent',
    verified: false,
    title: 'PRODUCER COLLABORATION',
    type: 'Collaboration',
    location: 'Remote',
    pay: 'Paid (Split)',
    genre: 'R&B / Soul',
    deadline: 'Ongoing',
    desc: 'Need a producer for a 5-track EP. Reference: SZA, Frank Ocean.',
    featured: false,
  },
  {
    id: '3',
    poster: 'Berlin House Festival',
    verified: true,
    title: 'FESTIVAL APPLICATIONS OPEN',
    type: 'Festival',
    location: 'Berlin',
    pay: 'TBC',
    genre: 'House / Minimal',
    deadline: 'Dec 01',
    desc: 'Now accepting demo submissions for the 2027 edition. 12,000 capacity, 3 stages.',
    featured: true,
  },
  {
    id: '4',
    poster: 'XYZ Records',
    verified: true,
    title: 'MUSIC MARKETING MANAGER',
    type: 'Job',
    location: 'London',
    pay: 'Full-time',
    genre: 'All genres',
    deadline: 'Nov 30',
    desc: 'Running campaigns for our top artists. 3+ years experience required.',
    featured: true,
  },
  {
    id: '5',
    poster: 'Sound Sync Co.',
    verified: true,
    title: 'SYNC LICENSING NEEDED',
    type: 'Sync',
    location: 'Global',
    pay: '£2,000 - £5,000',
    genre: 'Ambient / Cinematic',
    deadline: 'Nov 25',
    desc: 'TV commercial campaign needs original score. 60-second spot.',
    featured: true,
  },
  {
    id: '6',
    poster: 'Tech Brand',
    verified: true,
    title: 'BRAND DEAL: TECH HEADPHONES',
    type: 'Brand Deal',
    location: 'Global',
    pay: '£3,000 + Free Product',
    genre: 'Electronic',
    deadline: 'Dec 10',
    desc: 'Looking for a DJ/producer for a new headphone campaign. Product placement + cash.',
    featured: true,
  },
];

const FILTERS = [
  { label: 'All', count: 120 },
  { label: 'Gigs', count: 45 },
  { label: 'Jobs', count: 20 },
  { label: 'Bookings', count: 15 },
  { label: 'Collabs', count: 12 },
  { label: 'Festivals', count: 8 },
  { label: 'Sync', count: 5 },
  { label: 'Deals', count: 5 },
];

const s: Record<string, React.CSSProperties> = {
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
  
  // Sidebar
  sidebar: { background: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 },
  libTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 },
  libList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  libItem: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' },
  libItemActive: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#111827', fontWeight: 600, background: '#f3f4f6', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' },
  divider: { height: 1, background: '#f3f4f6', margin: '8px 0' },
  promoCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 },
  promoTitle: { margin: '0 0 4px', fontSize: 14, fontWeight: 600, color: '#111827' },
  promoDesc: { margin: '0 0 12px', fontSize: 12, color: '#6b7280', lineHeight: 1.4 },
  promoBtn: { width: '100%', padding: '8px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 12, fontWeight: 500, cursor: 'pointer' },

  // Main
  main: { padding: '32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' },
  h1: { margin: '0 0 8px', fontSize: 32, fontWeight: 800, color: '#111827' },
  subtitle: { margin: '0 0 24px', fontSize: 15, color: '#6b7280' },
  
  searchRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '14px 16px', borderRadius: 8, border: '1px solid #d1d5db', background: '#ffffff' },
  searchInput: { border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' },
  
  // Filter pills
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  pill: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151', display: 'flex', gap: 6, alignItems: 'center' },
  pillActive: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#111827', border: '1px solid #111827', color: '#ffffff', display: 'flex', gap: 6, alignItems: 'center' },
  pillCount: { fontSize: 11, background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 999 },
  pillCountDark: { fontSize: 11, background: '#f3f4f6', padding: '2px 6px', borderRadius: 999, color: '#6b7280' },
  
  filterRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' },
  verifiedToggle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' },
  countText: { fontSize: 14, color: '#6b7280' },

  // Grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
  
  // Card
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  cardFeatured: { background: '#ffffff', border: '2px solid #7c5cff', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 12 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  posterName: { fontSize: 13, color: '#6b7280', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 },
  verifiedBadge: { fontSize: 11, fontWeight: 700, color: '#10b981', background: '#f0fdf4', padding: '2px 8px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 },
  featuredBadge: { fontSize: 11, fontWeight: 700, color: '#7c5cff', background: '#f3f0ff', padding: '2px 8px', borderRadius: 999, display: 'flex', alignItems: 'center', gap: 4 },
  title: { margin: 0, fontSize: 20, fontWeight: 800, color: '#111827', lineHeight: 1.2 },
  
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: '#4b5563', padding: '4px 0' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 4 },
  
  desc: { margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.5 },
  
  actionRow: { display: 'flex', gap: 8, marginTop: 8 },
  btnApply: { flex: 1, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  btnSave: { padding: '10px 16px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  btnShare: { padding: '10px 16px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontWeight: 500, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },

  // GRID Pro bar
  proBar: { background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: 12, padding: 24, marginTop: 32, marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  proTitle: { margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 },
  proDesc: { margin: 0, fontSize: 14, color: '#9ca3af', lineHeight: 1.5 },
  proBtn: { padding: '12px 24px', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' as const },

  // Post Opportunity button
  postRow: { display: 'flex', justifyContent: 'center', marginTop: 32 },
  postBtn: { padding: '16px 32px', borderRadius: 12, background: '#ffffff', border: '2px solid #111827', color: '#111827', fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },

  // Pricing Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24 },
  modalBox: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto' as const, position: 'relative' },
  modalTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#111827' },
  modalSub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },
  
  tierCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 12 },
  tierCardFeatured: { border: '2px solid #7c5cff', borderRadius: 12, padding: 20, marginBottom: 12, background: '#faf9ff' },
  tierCardPremium: { border: '2px solid #111827', borderRadius: 12, padding: 20, marginBottom: 12, background: '#111827', color: '#ffffff' },
  tierHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tierName: { fontSize: 16, fontWeight: 700 },
  tierPrice: { fontSize: 20, fontWeight: 800 },
  tierPriceFeatured: { fontSize: 20, fontWeight: 800, color: '#7c5cff' },
  tierFeature: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6, color: '#4b5563' },
  tierFeatureDark: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6, color: '#d1d5db' },
  tierCta: { width: '100%', padding: '12px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', marginTop: 12 },
  tierCtaFeatured: { width: '100%', padding: '12px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 12 },
  tierCtaPremium: { width: '100%', padding: '12px 0', borderRadius: 8, background: '#ffffff', color: '#111827', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 12 },

  closeBtn: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default function OpportunitiesPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  const filtered = OPPORTUNITIES.filter(o => {
    if (verifiedOnly && !o.verified) return false;
    if (activeFilter !== 'All' && !o.type.toLowerCase().includes(activeFilter.toLowerCase().replace(/s$/, ''))) return false;
    return true;
  });

  return (
    <div style={s.layout}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.libTitle}>Your Library</div>
          <ul style={s.libList}>
            <li style={s.libItem}>Home</li>
            <li style={s.libItem}>Artists</li>
            <li style={s.libItem}>Search</li>
            <div style={s.divider}></div>
            <li style={s.libItem}>My Tickets</li>
            <li style={s.libItem}>Friends</li>
            <li style={s.libItem}>Messages</li>
            <li style={s.libItem}>Following</li>
            <div style={s.divider}></div>
            <li style={s.libItem}>Network</li>
            <li style={s.libItemActive}>Opportunities</li>
            <li style={s.libItem}>Dashboard</li>
          </ul>
        </div>

        <div style={s.promoCard}>
          <h4 style={s.promoTitle}>Find events near you</h4>
          <p style={s.promoDesc}>Browse by city, genre, and date.</p>
          <button style={s.promoBtn}>Explore</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        <h1 style={s.h1}>Find your next opportunity</h1>
        <p style={s.subtitle}>Gigs, jobs, collaborations, festivals, and more.</p>

        {/* Search Box with Icon */}
        <div style={s.searchRow}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input style={s.searchInput} placeholder="Search gigs, jobs, or keywords..." />
        </div>

        {/* Filter Pills */}
        <div style={s.pillRow}>
          {FILTERS.map(f => (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              style={activeFilter === f.label ? s.pillActive : s.pill}
            >
              {f.label}
              {f.count && <span style={activeFilter === f.label ? s.pillCount : s.pillCountDark}>{f.count}</span>}
            </button>
          ))}
        </div>

        {/* Verified + Count */}
        <div style={s.filterRow}>
          <label style={s.verifiedToggle}>
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
            Verified posters only
          </label>
          <span style={s.countText}>{filtered.length} opportunities</span>
        </div>

        {/* Cards Grid */}
        <div style={s.grid}>
          {filtered.map(o => (
            <div key={o.id} style={o.featured ? s.cardFeatured : s.card}>
              <div style={s.cardHeader}>
                <div style={s.posterName}>
                  {o.poster}
                  {o.verified && (
                    <span style={s.verifiedBadge}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      VERIFIED
                    </span>
                  )}
                </div>
                {o.featured && (
                  <span style={s.featuredBadge}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    FEATURED
                  </span>
                )}
              </div>

              <h3 style={s.title}>{o.title}</h3>

              <div style={s.metaRow}>
                <span style={s.metaItem}><TagIcon width={14} height={14} /> {o.type}</span>
                <span style={s.metaItem}><MapPinIcon width={14} height={14} /> {o.location}</span>
                <span style={s.metaItem}><DollarIcon width={14} height={14} /> {o.pay}</span>
                <span style={s.metaItem}><MusicIcon width={14} height={14} /> {o.genre}</span>
                <span style={s.metaItem}><CalendarIcon width={14} height={14} /> Apply by {o.deadline}</span>
              </div>

              <p style={s.desc}>{o.desc}</p>

              <div style={s.actionRow}>
                <button style={s.btnApply}>Apply Now</button>
                <button style={s.btnSave}>
                  <BookmarkIcon width={14} height={14} /> Save
                </button>
                <button style={s.btnShare}>
                  <ShareIcon width={14} height={14} /> Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GRID Pro Upsell */}
        <div style={s.proBar}>
          <div>
            <h3 style={s.proTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              Want early access?
            </h3>
            <p style={s.proDesc}>
              Pro artists see new gigs and brand deals <strong style={{ color: '#ffffff' }}>24 hours before everyone else</strong>. They also get a Verified badge on applications.
            </p>
          </div>
          <button style={s.proBtn}>Upgrade to GRID Pro — £9/month</button>
        </div>

        {/* Post Opportunity */}
        <div style={s.postRow}>
          <button style={s.postBtn} onClick={() => setPricingOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Post Opportunity
          </button>
        </div>
      </main>

      {/* Pricing Modal */}
      {pricingOpen && (
        <div style={s.modalOverlay} onClick={() => setPricingOpen(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setPricingOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 style={s.modalTitle}>Post an Opportunity</h2>
            <p style={s.modalSub}>Reach thousands of verified artists, producers, and DJs.</p>

            <div style={s.tierCard}>
              <div style={s.tierHeader}>
                <span style={s.tierName}>Standard Listing</span>
                <span style={s.tierPrice}>FREE</span>
              </div>
              <div style={s.tierFeature}>✓ Live for 7 days</div>
              <div style={s.tierFeature}>✓ Standard placement in the feed</div>
              <button style={s.tierCta}>Post Standard</button>
            </div>

            <div style={s.tierCardFeatured}>
              <div style={s.tierHeader}>
                <span style={s.tierName}>Featured Listing</span>
                <span style={s.tierPriceFeatured}>£25</span>
              </div>
              <div style={s.tierFeature}>✓ Live for 30 days</div>
              <div style={s.tierFeature}>✓ Pinned to top of the feed</div>
              <div style={s.tierFeature}>✓ "Verified" badge</div>
              <div style={s.tierFeature}>✓ Email alert sent to matching artists</div>
              <button style={s.tierCtaFeatured}>Post Featured — £25</button>
            </div>

            <div style={s.tierCardPremium}>
              <div style={s.tierHeader}>
                <span style={{ ...s.tierName, color: '#ffffff' }}>Premium (Sync / Brand Deal)</span>
                <span style={{ ...s.tierPrice, color: '#ffffff' }}>£99</span>
              </div>
              <div style={s.tierFeatureDark}>✓ Everything in Featured</div>
              <div style={s.tierFeatureDark}>✓ Highlighted in "Premium Opportunities" carousel</div>
              <div style={s.tierFeatureDark}>✓ Direct outreach to curated Pro artists</div>
              <button style={s.tierCtaPremium}>Post Premium — £99</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
