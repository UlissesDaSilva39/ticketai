'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

const OPPORTUNITIES = [
  { id: 'o1', poster: 'XYZ Events', posterVerified: true, title: 'DJ WANTED', type: 'Gig', location: 'London, UK', pay: '£500 - £1,000', genre: 'House / Techno', deadline: 'Nov 20', description: 'Looking for a resident DJ for our new Saturday night party series at a 300-cap venue.', featured: false },
  { id: 'o2', poster: 'Independent', posterVerified: false, title: 'PRODUCER COLLABORATION', type: 'Collaboration', location: 'Remote', pay: 'Paid (Split)', genre: 'R&B / Soul', deadline: 'Ongoing', description: 'Need a producer for a 5-track EP. Reference: SZA, Frank Ocean.', featured: false },
  { id: 'o3', poster: 'Berlin House Festival', posterVerified: true, title: 'FESTIVAL APPLICATIONS OPEN', type: 'Festival', location: 'Berlin', pay: 'TBC', genre: 'House / Minimal', deadline: 'Dec 01', description: 'Now accepting demo submissions for the 2027 edition. 12,000 capacity, 3 stages.', featured: true },
  { id: 'o4', poster: 'XYZ Records', posterVerified: true, title: 'MUSIC MARKETING MANAGER', type: 'Job', location: 'London', pay: 'Full-time', genre: 'All genres', deadline: 'Nov 30', description: 'Running campaigns for our top artists. 3+ years experience required.', featured: true },
  { id: 'o5', poster: 'Sound Sync Co.', posterVerified: true, title: 'SYNC LICENSING NEEDED', type: 'Sync', location: 'Global', pay: '£2,000 - £5,000', genre: 'Ambient / Cinematic', deadline: 'Nov 25', description: 'TV commercial campaign needs original score. 60-second spot.', featured: true },
  { id: 'o6', poster: 'Tech Brand', posterVerified: true, title: 'BRAND DEAL: TECH HEADPHONES', type: 'Brand Deal', location: 'Global', pay: '£3,000 + Free Product', genre: 'Electronic', deadline: 'Dec 10', description: 'Looking for a DJ/producer for a new headphone campaign. Product placement + cash.', featured: true },
];

const TYPES = ['All', 'Gigs', 'Jobs', 'Bookings', 'Collabs', 'Festivals', 'Sync', 'Deals'];

const TYPE_MAP: Record<string, string> = {
  'Gigs': 'Gig',
  'Jobs': 'Job',
  'Bookings': 'Booking',
  'Collabs': 'Collaboration',
  'Festivals': 'Festival',
  'Sync': 'Sync',
  'Deals': 'Brand Deal'
};

export default function OpportunitiesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filteredOpportunities = OPPORTUNITIES.filter(o => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!o.title.toLowerCase().includes(q) && !o.poster.toLowerCase().includes(q)) return false;
    }
    if (selectedType !== 'All' && o.type !== TYPE_MAP[selectedType]) return false;
    if (verifiedOnly && !o.posterVerified) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar />
      <main style={{ marginLeft: 260, flex: 1, paddingTop: 64, width: 'calc(100% - 260px)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
          
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Find your next opportunity</h1>
            <p style={{ margin: 0, fontSize: 16, color: '#6b7280' }}>Gigs, jobs, collaborations, festivals, and more.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input style={{ border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' }} placeholder="Search gigs, jobs, or keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TYPES.map(t => (
                <button key={t} onClick={() => setSelectedType(t)} style={{ padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: selectedType === t ? '#111827' : '#ffffff', border: '1px solid #d1d5db', color: selectedType === t ? '#ffffff' : '#374151' }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151', cursor: 'pointer' }}>
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} />
              Verified posters only
            </label>
            <span style={{ fontSize: 14, color: '#6b7280' }}>{filteredOpportunities.length} opportunities</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {filteredOpportunities.map(o => (
              <div key={o.id} style={{ background: '#ffffff', border: o.featured ? '2px solid #7c5cff' : '1px solid #e5e7eb', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: o.featured ? '0 4px 12px rgba(124,92,255,0.15)' : '0 1px 3px rgba(0,0,0,0.05)' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#374151' }}>{o.poster}</span>
                    {o.posterVerified && <span style={{ color: '#10b981', fontSize: 12 }}>✓</span>}
                  </div>
                  {o.featured && <span style={{ padding: '2px 8px', borderRadius: 4, background: '#fef2f2', color: '#dc2626', fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>FEATURED</span>}
                </div>

                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>{o.title}</h3>
                  <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280' }}>
                    <span>{o.type}</span>
                    <span>·</span>
                    <span>{o.location}</span>
                  </div>
                </div>

                <p style={{ fontSize: 14, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>{o.description}</p>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, marginTop: 4 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: '#f3f4f6', color: '#374151', fontWeight: 600 }}>{o.pay}</span>
                  <span style={{ padding: '4px 10px', borderRadius: 999, background: '#f3f4f6', color: '#374151', fontWeight: 600 }}>{o.genre}</span>
                </div>

                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                  Apply by {o.deadline}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #f3f4f6' }}>
                  <button onClick={() => alert('Applying for ' + o.title)} style={{ flex: 2, padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Apply Now
                  </button>
                  <button style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* GRID PRO UPSELL */}
          <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 24, padding: '64px 32px', marginTop: 64, textAlign: 'center', color: 'white' }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>Want early access?</h2>
            <p style={{ fontSize: 16, color: '#9ca3af', margin: '0 0 24px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
              Pro artists see new gigs and brand deals 24 hours before everyone else. They also get a Verified badge on applications.
            </p>
            <button onClick={() => router.push('/upgrade')} style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
              Upgrade to GRID Pro — £9/month
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}