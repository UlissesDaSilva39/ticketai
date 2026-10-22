'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function GenericClubPage() {
  const params = useParams();
  const entityType = params?.entityType as string;
  const slug = params?.slug as string;
  const [data, setData] = useState<any>(null);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !entityType) return;
    fetch(`/api/clubs/${entityType}/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => null);
  }, [slug, entityType]);

  async function joinClub(tierId: string) {
    setJoining(tierId);
    try {
      const res = await fetch(`/api/clubs/${entityType}/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });
      if (res.ok) alert('Welcome to the club! Check your email.');
      else if (res.status === 401) window.location.href = `/login?next=/clubs/${entityType}/${slug}`;
      else alert('Could not join - try again');
    } catch {
      alert('Error joining');
    } finally {
      setJoining(null);
    }
  }

  const FALLBACK_TIERS = [
    { id: '1', name: 'Regular', price_monthly: 15, description: 'The essentials', perks: ['Skip the queue', '10% off drinks', 'Members newsletter'], is_popular: false },
    { id: '2', name: 'Inner Circle', price_monthly: 35, description: 'Best value', perks: ['Everything in Regular', '1 free ticket/month', '15% off drinks', '+1 guest passes'], is_popular: true },
    { id: '3', name: 'Founder', price_monthly: 75, description: 'Limited to 50', perks: ['Everything in Inner Circle', '2 free tickets/month', 'Private bar area', 'Free entry to ALL events'], is_popular: false }
  ];

  const tiers = (data?.tiers && data.tiers.length > 0) ? data.tiers : FALLBACK_TIERS;
  const memberCount = data?.memberCount || 128;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: 80 }}>
      <section style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Link href={`/${entityType}/${slug}`} style={{ color: '#9ca3af', fontSize: 13, textDecoration: 'none' }}>← Back to profile</Link>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, margin: '20px 0 16px' }}>
            Join the {slug.replace(/-/g, ' ')} Club
          </h1>
          <p style={{ fontSize: 18, color: '#d1d5db', maxWidth: 600, margin: '0 auto 32px' }}>
            Trusted by {memberCount}+ members. Get exclusive access, perks, and save money every month.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '-40px auto 0', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {tiers.map((tier: any) => (
          <div key={tier.id} style={{
            background: tier.is_popular ? '#111827' : '#fff',
            color: tier.is_popular ? '#fff' : '#111827',
            border: tier.is_popular ? '2px solid #00FF87' : '1px solid #e5e7eb',
            borderRadius: 20, padding: 32, position: 'relative',
            transform: tier.is_popular ? 'translateY(-8px)' : 'none',
          }}>
            {tier.is_popular && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#00FF87', color: '#000', padding: '6px 20px', borderRadius: 20, fontSize: 11, fontWeight: 800 }}>
                MOST POPULAR
              </div>
            )}
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', textTransform: 'uppercase' }}>{tier.name}</h3>
            <p style={{ fontSize: 13, color: tier.is_popular ? '#9ca3af' : '#6b7280', margin: '0 0 20px', minHeight: 36 }}>{tier.description}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span style={{ fontSize: 48, fontWeight: 900 }}>£{tier.price_monthly}</span>
              <span style={{ fontSize: 14, color: tier.is_popular ? '#9ca3af' : '#6b7280' }}>/mo</span>
            </div>
            <button onClick={() => joinClub(tier.id)} disabled={joining === tier.id} style={{
              width: '100%', padding: '14px 24px', background: tier.is_popular ? '#00FF87' : '#111827', color: tier.is_popular ? '#000' : '#fff',
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 24,
            }}>
              {joining === tier.id ? 'Joining...' : `Join ${tier.name}`}
            </button>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tier.perks.map((perk: string, i: number) => (
                <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 13, color: tier.is_popular ? '#e5e7eb' : '#374151' }}>
                  <span style={{ color: '#00FF87', fontWeight: 700 }}>✓</span> {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}