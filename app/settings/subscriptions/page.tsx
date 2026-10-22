'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me/subscriptions')
      .then(r => r.ok ? r.json() : { subscriptions: [] })
      .then(d => setSubs(d.subscriptions || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 8 }}>My Memberships</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>Manage the clubs and creators you support directly.</p>
      
      {loading ? <p>Loading...</p> : subs.length === 0 ? (
        <div style={{ background: '#f9fafb', padding: 40, borderRadius: 16, textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 600 }}>You haven't joined any clubs yet.</p>
          <Link href="/discover/events" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', background: '#111827', color: '#fff', borderRadius: 8, textDecoration: 'none' }}>
            Discover Clubs
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {subs.map((sub) => (
            <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24, border: '1px solid #e5e7eb', borderRadius: 12, background: '#fff' }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>{sub.entity_type}</p>
                <h3 style={{ fontSize: 18, fontWeight: 800, textTransform: 'capitalize', margin: 0 }}>{sub.entity_id.replace(/-/g, ' ')}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>{sub.tier.name}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>£{sub.tier.price_monthly}/mo</p>
                <span style={{ fontSize: 12, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Active</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}