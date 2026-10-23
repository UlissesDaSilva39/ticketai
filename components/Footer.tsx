'use client';

import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();

  return (
    <footer style={{ background: '#f9fafb', paddingBottom: 40, marginTop: 64 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* SPONSORED BANNER (DISCRETO) */}
        <div style={{ 
          background: 'white', 
          border: '1px solid #e5e7eb', 
          borderRadius: 16, 
          padding: '24px 32px', 
          marginBottom: 32, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              📢
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#111827' }}>Promote your event here</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Reach thousands of promoters and artists on GRID.</p>
            </div>
          </div>
          <button onClick={() => router.push('/advertise')} style={{ padding: '10px 24px', borderRadius: 8, background: '#111827', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
            Advertise Now
          </button>
        </div>

        {/* RUNNING AN EVENT CTA */}
        <div style={{ 
          background: 'linear-gradient(135deg, #111827, #1f2937)', 
          borderRadius: 24, 
          padding: '64px 32px', 
          textAlign: 'center', 
          color: 'white',
          marginBottom: 24
        }}>
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
        <div style={{ 
          background: 'linear-gradient(135deg, #111827, #1f2937)', 
          borderRadius: 24, 
          padding: '64px 32px', 
          textAlign: 'center', 
          color: 'white',
          marginBottom: 64
        }}>
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