'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PromoterJoinPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const [promoter, setPromoter] = useState<any>(null);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    // Mock data lookup (in a real app, this would be a fetch to /api/promoters)
    const PROMOTERS = [
      { id: 'p1', name: 'Amsterdam Dance Events' },
      { id: 'p2', name: 'Brighton Beats' },
      { id: 'p3', name: 'Bristol Underground' },
      { id: 'p4', name: 'Drum and Bass Nation' },
      { id: 'p5', name: 'East End Promotions' },
      { id: 'p6', name: 'Electronic Europe' },
      { id: 'p7', name: 'Nightshift Presents' },
      { id: 'p8', name: 'Paris Nocturne' },
      { id: 'p9', name: 'Techno Nation' },
      { id: 'p10', name: 'Warehouse Sessions' },
    ];
    const found = PROMOTERS.find((p: any) => p.name.toLowerCase().replace(/\s+/g, '-') === slug);
    if (found) setPromoter(found);
  }, [slug]);

  const handleJoin = (tierName: string, price: number) => {
    setLoadingTier(tierName);
    // Simulate a redirect to Stripe after a short delay
    setTimeout(() => {
      alert('Redirecting to Stripe for ' + tierName + ' membership (£' + price + '/mo)');
      setLoadingTier(null);
    }, 1500);
  };

  if (!promoter) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '40px 24px', fontFamily: 'system-ui' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <button onClick={() => router.push('/discover/events')} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, fontSize: 14, color: '#6b7280' }}>
          ← Back to events
        </button>
        
        <h1 style={{ fontSize: 40, fontWeight: 800, textAlign: 'center', margin: '0 0 8px' }}>
          Join the {promoter.name} Club
        </h1>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: 18, margin: '0 0 48px' }}>
          Get exclusive access to pre-sales, merch drops, and VIP events.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {/* TIER 1: FREE */}
          <div style={{ background: 'white', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Supporter</h3>
            <p style={{ fontSize: 40, fontWeight: 800, margin: '16px 0 0' }}>Free</p>
            <p style={{ color: '#6b7280', margin: '4px 0 24px' }}>Forever</p>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Follow promoter updates</p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Basic event alerts</p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Access to public info</p>
            </div>
            <button onClick={() => handleJoin('Supporter', 0)} disabled={loadingTier === 'Supporter'} style={{ background: '#111827', color: 'white', padding: '14px 0', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
              {loadingTier === 'Supporter' ? 'Processing...' : 'Join for Free'}
            </button>
          </div>

          {/* TIER 2: PRO */}
          <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '2px solid #7c5cff', boxShadow: '0 20px 40px -10px rgba(124,92,255,0.3)', transform: 'scale(1.05)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#7c5cff', color: 'white', padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>MOST POPULAR</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Superfan</h3>
            <p style={{ fontSize: 40, fontWeight: 800, margin: '16px 0 0' }}>£5<span style={{ fontSize: 16, fontWeight: 600 }}>/mo</span></p>
            <p style={{ color: '#6b7280', margin: '4px 0 24px' }}>Cancel anytime</p>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ <strong>24h early ticket access</strong></p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ <strong>Exclusive merch drops</strong></p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Priority entry at events</p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Monthly Q&A with the team</p>
            </div>
            <button onClick={() => handleJoin('Superfan', 5)} disabled={loadingTier === 'Superfan'} style={{ background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', padding: '14px 0', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
              {loadingTier === 'Superfan' ? 'Redirecting to Stripe...' : 'Join Superfan — £5/mo'}
            </button>
          </div>

          {/* TIER 3: VIP */}
          <div style={{ background: 'white', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>VIP</h3>
            <p style={{ fontSize: 40, fontWeight: 800, margin: '16px 0 0' }}>£25<span style={{ fontSize: 16, fontWeight: 600 }}>/mo</span></p>
            <p style={{ color: '#6b7280', margin: '4px 0 24px' }}>For the ultimate fan</p>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Everything in Superfan</p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Backstage meet & greet</p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Free entry to 1 event/year</p>
              <p style={{ fontSize: 14, color: '#374151' }}>✓ Signed poster annually</p>
            </div>
            <button onClick={() => handleJoin('VIP', 25)} disabled={loadingTier === 'VIP'} style={{ background: '#111827', color: 'white', padding: '14px 0', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
              {loadingTier === 'VIP' ? 'Redirecting to Stripe...' : 'Join VIP'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}