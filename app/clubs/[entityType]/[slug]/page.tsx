'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const FALLBACK_TIERS = [
  {
    id: 'f1', name: 'Regular', price_monthly: 15, description: 'The essentials, every month',
    perks: ['Skip the queue', '10% off drinks until 11pm', 'Early ticket access (24h)', 'Free cloakroom', 'Members newsletter'],
    is_popular: false
  },
  {
    id: 'f2', name: 'Inner Circle', price_monthly: 35, description: 'Best value - most popular',
    perks: ['Everything in Regular', '1 free ticket per month', '15% off drinks all night', '+1 guest passes', 'Priority table reservations', 'Secret lineup announcements'],
    is_popular: true
  },
  {
    id: 'f3', name: 'Founder', price_monthly: 75, description: 'Limited to 50 - lifetime perks',
    perks: ['Everything in Inner Circle', '2 free tickets per month', 'Private bar area access', '20% off all drinks', 'Free entry to ALL events', 'Quarterly exclusive merch'],
    is_popular: false
  }
];

// SVG Icon Components
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF87" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);
const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);
const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
);

export default function GenericClubPage() {
  const params = useParams();
  const entityType = params?.entityType as string;
  const slug = params?.slug as string;
  const [data, setData] = useState<any>(null);
  const [joining, setJoining] = useState<string | null>(null);
  const [visits, setVisits] = useState(2);

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
      const res = await fetch(`/api/clubs/${entityType}/${slug}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierId }),
      });

      if (res.status === 401) {
        window.location.href = `/login?next=/clubs/${entityType}/${slug}`;
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Could not start checkout - try again');
        return;
      }

      const data = await res.json();

      if (data.checkout_url) {
        // Redirect to Stripe Checkout (or fallback success page in dev)
        window.location.href = data.checkout_url;
      } else {
        alert('No checkout URL returned');
      }
    } catch (err: any) {
      alert('Error starting checkout: ' + (err.message || 'unknown'));
    } finally {
      setJoining(null);
    }
  }

  const tiers = (data?.tiers && data.tiers.length > 0) ? data.tiers : FALLBACK_TIERS;
  const memberCount = data?.memberCount || 128;
  const displayName = slug ? slug.replace(/-/g, ' ') : 'this club';
  
  // Calculator logic (Example: saves £15 per visit on average)
  const monthlySavings = visits * 15; 

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: 80 }}>
      {/* 1. HERO SECTION */}
      <section style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#fff', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Link href={`/${entityType}/${slug}`} style={{ color: '#9ca3af', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
            ← Back to profile
          </Link>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(251,191,36,0.2)', color: '#fbbf24', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 20 }}>
            <StarIcon /> {memberCount} MEMBERS AND COUNTING
          </div>
          
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.05, textTransform: 'capitalize' }}>
            Join the {displayName} Club
          </h1>
          
          <p style={{ fontSize: 18, color: '#d1d5db', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
            Skip the queue. Get exclusive access, perks, and save money every visit. Be part of the family.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ display: 'flex' }}>
              {['S', 'J', 'A', 'M', 'R'].map((letter, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: ['#7c5cff', '#ff5c8a', '#10b981', '#f59e0b', '#3b82f6'][i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, border: '2px solid #1f2937', marginLeft: i === 0 ? 0 : -8 }}>
                  {letter}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
              <span style={{ fontSize: 14, color: '#d1d5db', marginLeft: 4 }}>Rated 4.9/5</span>
            </div>
          </div>

          <a href="#tiers" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 40px', background: 'linear-gradient(135deg, #00FF87, #00cc6d)', color: '#000', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,255,135,0.3)' }}>
            See Membership Options ↓
          </a>
        </div>
      </section>

      {/* 2. STICKY CTA BAR */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(17,24,39,0.95)', backdropFilter: 'blur(10px)', color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div>
          <p style={{ fontSize: 12, margin: 0, color: '#9ca3af', textTransform: 'capitalize' }}>Join {displayName}</p>
          <p style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>From £15/mo · Cancel anytime</p>
        </div>
        <a href="#tiers" style={{ background: '#00FF87', color: '#000', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>See Tiers</a>
      </div>

      {/* 3. SOCIAL PROOF */}
      <section style={{ maxWidth: 900, margin: '40px auto 0', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#6b7280', background: '#f3f4f6', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', borderRadius: 20, fontWeight: 600 }}>
          <BoltIcon /> Join 12+ members who joined this week
        </p>
      </section>

      {/* 4. PRICING TIERS */}
      <section id="tiers" style={{ maxWidth: 1200, margin: '20px auto 0', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {tiers.map((tier: any) => (
          <div key={tier.id} style={{
            background: tier.is_popular ? '#111827' : '#fff',
            color: tier.is_popular ? '#fff' : '#111827',
            border: tier.is_popular ? '2px solid #00FF87' : '1px solid #e5e7eb',
            borderRadius: 20, padding: 32, position: 'relative',
            transform: tier.is_popular ? 'translateY(-8px)' : 'none',
            boxShadow: tier.is_popular ? '0 20px 50px rgba(0,255,135,0.2)' : '0 4px 12px rgba(0,0,0,0.05)'
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
              border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: joining === tier.id ? 'wait' : 'pointer', marginBottom: 24,
            }}>
              {joining === tier.id ? 'Joining...' : `Join ${tier.name}`}
            </button>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {tier.perks.map((perk: string, i: number) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13, color: tier.is_popular ? '#e5e7eb' : '#374151' }}>
                  <CheckIcon /> {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* 5. TRUST BADGES */}
      <section style={{ maxWidth: 900, margin: '40px auto', padding: '0 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: '#059669', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <ShieldIcon /> 30-Day Money-Back Guarantee
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, fontSize: 12, color: '#9ca3af' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LockIcon /> Secured by Stripe</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><XIcon /> Cancel Anytime</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MailIcon /> Instant Confirmation</span>
        </div>
      </section>

      {/* 6. INTERACTIVE SAVINGS CALCULATOR */}
      <section style={{ maxWidth: 600, margin: '0 auto 60px', padding: 32, background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
        <h3 style={{ fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>How much would you save?</h3>
        <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 32 }}>Move the slider to see your monthly savings as a member.</p>
        
        <input 
          type="range" 
          min="1" 
          max="8" 
          value={visits} 
          onChange={(e) => setVisits(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#00FF87', cursor: 'pointer' }} 
        />
        
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ fontSize: 48, fontWeight: 900, color: '#00FF87', margin: 0, letterSpacing: -2 }}>£{monthlySavings}</p>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>saved per month</p>
        </div>
      </section>
    </div>
  );
}