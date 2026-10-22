'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Tier = {
  slug: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  popular: boolean;
  spotsRemaining: number | null;
};

type Testimonial = {
  author: string;
  tier: string;
  quote: string;
  rating: number;
};

type ClubData = {
  id: string;
  slug: string;
  name: string;
  city: string;
  membership_blurb: string | null;
  member_count: number;
  founder_spots_remaining: number;
  photo_url: string | null;
  tiers: Tier[];
  testimonials: Testimonial[];
};

const FALLBACK_TIERS: Tier[] = [
  {
    slug: 'regular',
    name: 'Regular',
    price: 15,
    popular: false,
    spotsRemaining: null,
    description: 'The essentials, every month',
    perks: [
      'Skip the queue',
      '10% off drinks until 11pm',
      'Early ticket access (24h before public)',
      'Free cloakroom',
      'Members newsletter',
    ],
  },
  {
    slug: 'inner-circle',
    name: 'Inner Circle',
    price: 35,
    popular: true,
    spotsRemaining: null,
    description: 'Best value - most popular',
    perks: [
      'Everything in Regular',
      '1 free ticket per month',
      '15% off drinks all night',
      '+1 guest passes (bring a friend)',
      'Priority table reservations',
      'Secret lineup announcements',
      'Discounted club entry (10 vs 25)',
    ],
  },
  {
    slug: 'founder',
    name: 'Founder',
    price: 75,
    popular: false,
    spotsRemaining: 3,
    description: 'Limited to 50 - lifetime perks',
    perks: [
      'Everything in Inner Circle',
      '2 free tickets per month',
      'Private bar area access',
      '20% off all drinks',
      'Free entry to ALL events',
      'Quarterly exclusive merch drop',
      'Meet-the-artist events',
      'Name on Founders Wall',
    ],
  },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    author: 'Sarah M.',
    tier: 'Inner Circle',
    quote: 'Best 35 I spend each month. The free tickets alone pay for it.',
    rating: 5,
  },
  {
    author: 'James T.',
    tier: 'Founder',
    quote: 'Being a founder is worth every penny. The private bar is incredible.',
    rating: 5,
  },
];

export default function VenueClubPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const [club, setClub] = useState<ClubData | null>(null);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/venues/${slug}/club`)
      .then(r => r.ok ? r.json() : { club: null })
      .then(d => setClub(d.club))
      .catch(() => setClub(null));
  }, [slug]);

  async function joinClub(tierSlug: string) {
    setJoining(tierSlug);
    try {
      const res = await fetch(`/api/venues/${slug}/club`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tierSlug }),
      });
      if (res.ok) {
        alert('Welcome to the club! Check your email for your membership card.');
      } else if (res.status === 401) {
        window.location.href = `/login?next=/venues/${slug}/club`;
      } else {
        alert('Could not join - try again');
      }
    } catch {
      alert('Could not join - try again');
    } finally {
      setJoining(null);
    }
  }

  const tiers = club?.tiers && club.tiers.length > 0 ? club.tiers : FALLBACK_TIERS;
  const testimonials = club?.testimonials && club.testimonials.length > 0 ? club.testimonials : FALLBACK_TESTIMONIALS;
  const venueName = club?.name || 'this venue';
  const memberCount = club?.member_count || 128;
  const founderSpots = club?.founder_spots_remaining ?? 3;
  const blurb = club?.membership_blurb || 'Skip the queue. Get priority tickets. Save money every visit. Be part of the family.';

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <section style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#ffffff', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <Link href={`/venue/${slug}`} style={{ color: '#9ca3af', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
            ← Back to {venueName}
          </Link>
          <div style={{ display: 'inline-block', background: 'rgba(251,191,36,0.2)', color: '#fbbf24', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 20 }}>
            ⭐ {memberCount} MEMBERS AND COUNTING
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -1, lineHeight: 1.05 }}>
            Join the {venueName} Club
          </h1>
          <p style={{ fontSize: 18, color: '#d1d5db', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.6 }}>
            {blurb}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 32 }}>
            <div style={{ display: 'flex' }}>
              {['S', 'J', 'A', 'M', 'R'].map((letter, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: ['#7c5cff', '#ff5c8a', '#10b981', '#f59e0b', '#3b82f6'][i], color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, border: '2px solid #1f2937', marginLeft: i === 0 ? 0 : -8 }}>
                  {letter}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 14, color: '#d1d5db', margin: 0 }}>
              Trusted by {memberCount}+ members · Rated 4.9/5
            </p>
          </div>
          <a href="#tiers" style={{ display: 'inline-block', padding: '16px 40px', background: 'linear-gradient(135deg, #00FF87, #00cc6d)', color: '#000', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,255,135,0.3)' }}>
            See Membership Options ↓
          </a>
        </div>
      </section>

      <section id="tiers" style={{ padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 900, margin: '0 0 12px', letterSpacing: -0.5 }}>
            Pick your tier
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>
            Every tier unlocks real perks you will use every visit. Cancel anytime.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {tiers.map((tier) => (
            <div
              key={tier.slug}
              style={{
                background: tier.popular ? 'linear-gradient(180deg, #111827 0%, #1f2937 100%)' : '#ffffff',
                color: tier.popular ? '#ffffff' : '#111827',
                border: tier.popular ? '2px solid #00FF87' : '1px solid #e5e7eb',
                borderRadius: 20,
                padding: 32,
                position: 'relative',
                transform: tier.popular ? 'translateY(-8px)' : 'none',
                boxShadow: tier.popular ? '0 20px 50px rgba(0,255,135,0.2)' : '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              {tier.popular && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#00FF87', color: '#000', padding: '6px 20px', borderRadius: 20, fontSize: 11, fontWeight: 800, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                  MOST POPULAR
                </div>
              )}
              {tier.spotsRemaining !== null && tier.spotsRemaining <= 10 && tier.spotsRemaining > 0 && (
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: 12, fontSize: 10, fontWeight: 700 }}>
                  ONLY {tier.spotsRemaining} LEFT
                </div>
              )}

              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {tier.name}
              </h3>
              <p style={{ fontSize: 13, color: tier.popular ? '#9ca3af' : '#6b7280', margin: '0 0 20px', minHeight: 36 }}>
                {tier.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                <span style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, letterSpacing: -2 }}>£{tier.price}</span>
                <span style={{ fontSize: 14, color: tier.popular ? '#9ca3af' : '#6b7280' }}>/month</span>
              </div>

              <button
                onClick={() => joinClub(tier.slug)}
                disabled={joining === tier.slug}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  background: tier.popular ? 'linear-gradient(135deg, #00FF87, #00cc6d)' : '#111827',
                  color: tier.popular ? '#000' : '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 800,
                  cursor: joining === tier.slug ? 'wait' : 'pointer',
                  opacity: joining === tier.slug ? 0.6 : 1,
                  marginBottom: 24,
                }}
              >
                {joining === tier.slug ? 'Joining...' : `Join ${tier.name}`}
              </button>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {tier.perks.map((perk, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12, fontSize: 13, color: tier.popular ? '#e5e7eb' : '#374151' }}>
                    <span style={{ color: '#00FF87', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: '#6b7280' }}>
          <p style={{ margin: 0 }}>Cancel anytime. No lock-in. 30-day money-back guarantee.</p>
          <p style={{ margin: '8px 0 0' }}>Founders tier: {founderSpots} spots remaining</p>
        </div>
      </section>

      <section style={{ padding: '60px 24px', background: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, textAlign: 'center', margin: '0 0 12px', letterSpacing: -0.5 }}>
            What members actually save
          </h2>
          <p style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', margin: '0 0 40px' }}>
            If you attend 2+ times per month, memberships pay for themselves.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { label: 'Regular member', savings: '22/mo', desc: 'Save 7 vs non-member at 2 visits/month' },
              { label: 'Inner Circle', savings: '75/mo', desc: 'Free ticket + guest + drinks savings' },
              { label: 'Founder', savings: '180/mo', desc: '2 tickets + private bar + all events free' },
            ].map((item) => (
              <div key={item.label} style={{ background: '#fafafa', padding: 24, borderRadius: 16, textAlign: 'center', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 12px' }}>{item.label}</p>
                <p style={{ fontSize: 40, fontWeight: 900, color: '#00FF87', margin: '0 0 8px', letterSpacing: -1 }}>£{item.savings}</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 24px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, textAlign: 'center', margin: '0 0 40px', letterSpacing: -0.5 }}>
          Why members love it
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: '#ffffff', padding: 28, borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
              <div style={{ color: '#fbbf24', fontSize: 16, marginBottom: 12 }}>{'★'.repeat(t.rating)}</div>
              <p style={{ fontSize: 15, color: '#111827', lineHeight: 1.6, margin: '0 0 20px', fontStyle: 'italic' }}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{t.author}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{t.tier} member</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, margin: '0 0 16px', letterSpacing: -1 }}>
            Ready to skip the queue?
          </h2>
          <p style={{ fontSize: 17, color: '#d1d5db', margin: '0 0 32px', lineHeight: 1.6 }}>
            Join {memberCount}+ members who save money, get priority access, and feel like family every time they walk in.
          </p>
          <a href="#tiers" style={{ display: 'inline-block', padding: '18px 48px', background: 'linear-gradient(135deg, #00FF87, #00cc6d)', color: '#000', borderRadius: 12, fontSize: 16, fontWeight: 800, textDecoration: 'none', boxShadow: '0 10px 30px rgba(0,255,135,0.3)' }}>
            Choose Your Tier ↑
          </a>
          <p style={{ fontSize: 13, color: '#9ca3af', margin: '20px 0 0' }}>
            30-day money-back guarantee · Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}