'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function VenueJoinPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [venue, setVenue] = useState<any>(null);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch('/api/venues')
      .then(r => r.json())
      .then(data => {
        const found = data.find((v: any) => v.name.toLowerCase().replace(/\s+/g, '-') === slug);
        if (found) setVenue(found);
      });
  }, [slug]);

  const handleJoin = async (tierName: string, price: number) => {
    setLoadingTier(tierName);
    const res = await fetch('/api/venues/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId: venue.id, venueName: venue.name, tierName, price }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert(data.error || 'Error'); setLoadingTier(null); }
  };

  if (!venue) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 24px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, fontSize: 14, color: '#6b7280' }}>← Voltar</button>
        <h1 style={{ fontSize: 40, fontWeight: 800, textAlign: 'center', margin: '0 0 8px' }}>Join the {venue.name} Club</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 18, margin: '0 0 48px' }}>Unlock exclusive perks, skip the queue, and save money on your next event.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {['Supporter', 'Pro-Promoter', 'Venue Partner'].map((tier, i) => {
            const prices = [0, 15, 99];
            const features = [
              ['Follow updates', 'Basic alerts', 'Public info'],
              ['Skip the queue', '10% off bar', 'Early access', 'Priority support'],
              ['Free hire waiver', 'Direct line mgr', '20% off bar', 'Guestlist (20 pax)']
            ];
            const isPro = tier === 'Pro-Promoter';
            return (
              <div key={tier} style={{
                background: 'white', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column',
                border: isPro ? '2px solid #7c5cff' : '1px solid #e5e7eb',
                boxShadow: isPro ? '0 20px 40px -10px rgba(124,92,255,0.3)' : 'none',
                transform: isPro ? 'scale(1.05)' : 'none',
                position: 'relative'
              }}>
                {isPro && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#7c5cff', color: 'white', padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>MOST POPULAR</div>}
                <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{tier}</h3>
                <p style={{ fontSize: 40, fontWeight: 800, margin: '16px 0 0' }}>{prices[i] === 0 ? 'Free' : '£' + prices[i]}<span style={{ fontSize: 16 }}>{prices[i] > 0 ? '/mo' : ''}</span></p>
                <p style={{ color: '#6b7280', margin: '4px 0 24px' }}>{prices[i] === 0 ? 'Forever' : 'Cancel anytime'}</p>
                <div style={{ flex: 1 }}>
                  {features[i].map(f => <p key={f} style={{ fontSize: 14, color: '#374151' }}>✓ {f}</p>)}
                </div>
                <button onClick={() => handleJoin(tier, prices[i])} disabled={loadingTier === tier}
                  style={{ background: isPro ? 'linear-gradient(135deg, #7c5cff, #ff5c8a)' : '#111827', color: 'white', padding: '14px 0', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
                  {loadingTier === tier ? 'Redirecting...' : (prices[i] === 0 ? 'Join for Free' : 'Join ' + tier)}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}