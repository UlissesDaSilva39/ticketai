'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: any) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <footer style={{ background: '#f9fafb', paddingBottom: 40, marginTop: 64 }}>
      
      {/* NEWSLETTER BAR (LEAD GENERATION) */}
      <div style={{ background: '#111827', color: 'white', padding: '40px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Don't miss a beat.</h3>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Get the best events, gigs, and opportunities in your inbox weekly.</p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 400 }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: 'none', fontSize: 14, color: '#111827' }}
            />
            <button type="submit" style={{ padding: '12px 24px', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {subscribed ? '✓ Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 0' }}>
        
        {/* GRID PRO UPSELL (B2C MONETIZATION) */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1f2937, #111827)', 
          borderRadius: 24, 
          padding: '48px 32px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          gap: 24,
          marginBottom: 32,
          border: '1px solid #374151'
        }}>
          <div style={{ maxWidth: 600 }}>
            <div style={{ display: 'inline-block', background: '#7c5cff', color: 'white', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, marginBottom: 16 }}>
              GRID PRO
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: 'white', margin: '0 0 12px' }}>
              Get ahead of the competition.
            </h2>
            <p style={{ fontSize: 16, color: '#9ca3af', margin: 0 }}>
              Unlock early access to opportunities, get a verified badge, and see who's viewing your profile.
            </p>
          </div>
          <button onClick={() => router.push('/upgrade')} style={{ padding: '16px 32px', borderRadius: 12, background: 'white', color: '#111827', fontSize: 16, fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}>
            Upgrade for £9/month
          </button>
        </div>

        {/* RUNNING AN EVENT CTA */}
        <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 24, padding: '64px 32px', textAlign: 'center', color: 'white', marginBottom: 24 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>🎪</span> Running an event?
          </h2>
          <p style={{ fontSize: 16, color: '#9ca3af', margin: '0 0 32px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
            Sell tickets on GRID. Reach thousands of artists and fans. From £25 to feature your event.
          </p>
          <button onClick={() => router.push('/events/create')} style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(124,92,255,0.3)' }}>
            List Your Event &rarr;
          </button>
        </div>

        {/* POST OPPORTUNITY CTA */}
        <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 24, padding: '64px 32px', textAlign: 'center', color: 'white', marginBottom: 64 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 12px' }}>Can't find who you need?</h2>
          <p style={{ fontSize: 16, color: '#9ca3af', margin: '0 0 32px' }}>
            Post an opportunity and artists will apply.
          </p>
          <button onClick={() => router.push('/opportunities')} style={{ padding: '16px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', fontSize: 16, fontWeight: 700, cursor: 'pointer', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 20px rgba(124,92,255,0.3)' }}>
            Post opportunity &rarr;
          </button>
        </div>
      </div>

      {/* LEGAL */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', borderTop: '1px solid #e5e7eb', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/terms" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Terms of Service</a>
          <a href="/privacy" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="/refund" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Refund Policy</a>
          <a href="/contact" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Contact</a>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, fontWeight: 600 }}>Discover · Connect · Create · Book · Grow</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: '4px 0 0' }}>© 2026 GRID. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}