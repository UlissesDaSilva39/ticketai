'use client';

import { useRouter } from 'next/navigation';

export default function TopAdBanner() {
  const router = useRouter();

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '16px 24px 0' 
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #111827, #1f2937)', 
        borderRadius: 12, 
        padding: '16px 24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: 12,
        color: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
            📢
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 2px', color: '#ffffff' }}>Promote your event here</p>
            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Reach thousands of promoters and artists on GRID.</p>
          </div>
        </div>
        <button 
          onClick={() => router.push('/advertise')} 
          style={{ 
            padding: '8px 20px', 
            borderRadius: 8, 
            background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', 
            color: 'white', 
            border: 'none', 
            fontSize: 13, 
            fontWeight: 700, 
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Advertise Now
        </button>
      </div>
    </div>
  );
}