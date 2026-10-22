'use client';

import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { PROMOTERS, CITIES } from './promoters';
import type { Promoter } from './promoters';

const s: Record<string, CSSProperties> = {
  page: {
    padding: 24,
    color: '#e8eaf2',
    background: '#0e0f13',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
  },
  wrap: { maxWidth: 1200, margin: '0 auto' },
  h1: { margin: '0 0 8px', fontSize: 32, fontWeight: 800 },
  subtitle: { color: '#8a90a6', margin: '0 0 24px', fontSize: 15, lineHeight: 1.5, maxWidth: 720 },

  searchRow: { display: 'flex', gap: 12, marginBottom: 20 },
  input: {
    flex: 1, padding: '12px 16px', borderRadius: 12,
    background: '#161821', border: '1px solid #262a3a',
    color: '#e8eaf2', fontSize: 14, outline: 'none',
  },
  searchBtn: {
    padding: '12px 20px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg,#7c5cff,#ff5c8a)',
    color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14,
  },

  label: { fontSize: 11, letterSpacing: '.15em', color: '#8a90a6', marginBottom: 8, fontWeight: 600 },

  cities: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  cityBtn: {
    padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
    background: '#161821', color: '#8a90a6',
    border: '1px solid #262a3a', fontSize: 13,
  },
  cityBtnActive: {
    padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
    background: 'rgba(124,92,255,.18)', color: '#b6a5ff',
    border: '1px solid #7c5cff', fontSize: 13, fontWeight: 600,
  },

  filterRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #262a3a',
  },
  verifiedToggle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#e8eaf2', cursor: 'pointer' },
  count: { fontSize: 14, color: '#8a90a6' },

  // trending
  trendingHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 16,
  },
  trendingTitle: { fontSize: 20, fontWeight: 700, margin: 0 },
  nav: { display: 'flex', gap: 8 },
  navBtn: {
    width: 34, height: 34, borderRadius: 10, cursor: 'pointer',
    background: '#161821', color: '#e8eaf2',
    border: '1px solid #262a3a', fontSize: 18, lineHeight: 1,
  },
  trendingTrack: {
    display: 'flex', gap: 16, overflowX: 'auto',
    scrollBehavior: 'smooth', paddingBottom: 12, marginBottom: 40,
    scrollbarWidth: 'none',
  },

  gridHead: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16,
  },
  gridTitle: { fontSize: 20, fontWeight: 700, margin: 0 },
  sortWrap: { fontSize: 14, color: '#8a90a6' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 20, marginBottom: 48,
  },

  card: {
    background: '#161821', border: '1px solid #262a3a',
    borderRadius: 16, padding: 20,
    transition: 'transform .2s, border-color .2s',
    display: 'flex', flexDirection: 'column', gap: 12,
  },
  cardHead: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  avatar: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'linear-gradient(135deg,#7c5cff,#ff5c8a)',
    display: 'grid', placeItems: 'center',
    fontWeight: 700, fontSize: 15, color: '#fff',
    flexShrink: 0,
  },
  name: { margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 },
  verified: {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    background: 'rgba(124,92,255,.18)', color: '#b6a5ff',
    padding: '2px 8px', borderRadius: 999,
    fontSize: 11, fontWeight: 600,
  },
  meta: { margin: '4px 0 0', fontSize: 12, color: '#8a90a6' },
  desc: { margin: 0, fontSize: 13, color: '#b8bccb', lineHeight: 1.5 },

  stats: {
    display: 'flex', gap: 16, fontSize: 12, color: '#8a90a6',
    paddingTop: 12, borderTop: '1px solid #262a3a',
  },
  nextEvent: {
    background: '#1d2030', borderRadius: 10, padding: '10px 12px',
    fontSize: 12, color: '#b8bccb',
  },
  nextEventLabel: { fontSize: 10, letterSpacing: '.12em', color: '#8a90a6', marginBottom: 4 },

  actions: { display: 'flex', gap: 8, marginTop: 'auto' },
  primaryBtn: {
    flex: 1, padding: '10px 14px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg,#7c5cff,#ff5c8a)',
    color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13,
  },
  secondaryBtn: {
    flex: 1, padding: '10px 14px', borderRadius: 10,
    background: 'transparent', color: '#b6a5ff',
    border: '1px solid #7c5cff', fontWeight: 600, cursor: 'pointer', fontSize: 13,
  },

  // CTA
  cta: {
    background: 'linear-gradient(135deg,#1a0a2e 0%,#0e0f13 100%)',
    border: '1px solid #7c5cff', borderRadius: 20,
    padding: 32, marginBottom: 48,
  },
  ctaTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 800 },
  ctaSub: { margin: '0 0 24px', fontSize: 14, color: '#b8bccb' },
  benefits: {
    display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
    gap: 16, marginBottom: 24,
  },
  benefit: {
    background: 'rgba(255,255,255,.03)', border: '1px solid #262a3a',
    borderRadius: 12, padding: 16,
  },
  benefitTitle: { fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#e8eaf2' },
  benefitDesc: { fontSize: 12, color: '#8a90a6', margin: 0 },
  ctaBtn: {
    padding: '14px 24px', borderRadius: 12, border: 'none',
    background: 'linear-gradient(135deg,#7c5cff,#ff5c8a)',
    color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer',
  },
  ctaNote: { fontSize: 12, color: '#8a90a6', marginTop: 8 },

  empty: {
    background: '#161821', border: '1px dashed #262a3a',
    borderRadius: 16, padding: 40, textAlign: 'center', color: '#8a90a6',
  },
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function PromoterCard({ p, compact }: { p: Promoter; compact?: boolean }) {
  return (
    <div style={s.card}>
      <div style={s.cardHead}>
        <div style={s.avatar}>{p.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={s.name}>
            {p.name}
            {p.verified && <span style={s.verified}>✓ Verified</span>}
          </h3>
          <p style={s.meta}>
            {p.city} · {p.genres.join(' / ')}
          </p>
        </div>
      </div>

      {!compact && <p style={s.desc}>{p.description}</p>}

      <div style={s.stats}>
        <span>📅 {p.eventsHosted} events</span>
        <span>👥 {formatCount(p.followers)}</span>
        <span>⚡ {p.responseTime} response</span>
      </div>

      {p.nextEvent && !compact && (
        <div style={s.nextEvent}>
          <div style={s.nextEventLabel}>UPCOMING</div>
          <div>
            {p.nextEvent.title} · {formatDate(p.nextEvent.date)} · {p.nextEvent.venue}
          </div>
        </div>
      )}

      <div style={s.actions}>
        <button style={s.primaryBtn}>View Profile</button>
        <button style={s.secondaryBtn}>Follow</button>
      </div>
    </div>
  );
}

export default function PromotersClient() {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const trendingRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROMOTERS.filter((p) => {
      if (verifiedOnly && !p.verified) return false;
      if (city !== 'All' && p.city !== city) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.city,
        p.description,
        ...p.genres,
      ].join(' ').toLowerCase();
      return haystack.includes(q);
    });
  }, [query, city, verifiedOnly]);

  const trending = useMemo(() => {
    return [...PROMOTERS]
      .sort((a, b) => {
        const scoreA = a.eventsHosted * 2 + a.followers / 100;
        const scoreB = b.eventsHosted * 2 + b.followers / 100;
        return scoreB - scoreA;
      })
      .slice(0, 3);
  }, []);

  const scrollTrending = (dir: number) => {
    const el = trendingRef.current;
    if (!el) return;
    el.scrollBy({ left: 340 * dir, behavior: 'smooth' });
  };

  return (
    <main style={s.page}>
      <div style={s.wrap}>
        <h1 style={s.h1}>Discover promoters</h1>
        <p style={s.subtitle}>
          Browse every promoter on GRID. Filter by city and discover who&apos;s actively booking
          artists and running events.
        </p>

        {/* Search */}
        <div style={s.searchRow}>
          <input
            style={s.input}
            placeholder="Search by name, city, or event focus..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button style={s.searchBtn}>Search</button>
        </div>

        {/* Cities */}
        <div style={s.label}>CITIES</div>
        <div style={s.cities}>
          {CITIES.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              style={c === city ? s.cityBtnActive : s.cityBtn}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Verified + count */}
        <div style={s.filterRow}>
          <label style={s.verifiedToggle}>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
            />
            Verified promoters only
          </label>
          <span style={s.count}>{filtered.length} promoters found</span>
        </div>

        {/* Trending */}
        <div style={s.trendingHead}>
          <h2 style={s.trendingTitle}>🔥 Trending this week</h2>
          <div style={s.nav}>
            <button style={s.navBtn} onClick={() => scrollTrending(-1)} aria-label="Previous">
              {'\u2039'}
            </button>
            <button style={s.navBtn} onClick={() => scrollTrending(1)} aria-label="Next">
              {'\u203A'}
            </button>
          </div>
        </div>
        <div ref={trendingRef} style={s.trendingTrack}>
          {trending.map((p) => (
            <div key={p.id} style={{ flex: '0 0 320px' }}>
              <PromoterCard p={p} />
            </div>
          ))}
        </div>

        {/* All promoters */}
        <div style={s.gridHead}>
          <h2 style={s.gridTitle}>All promoters</h2>
          <span style={s.sortWrap}>Sort: Popular ▾</span>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <p style={{ margin: '0 0 8px', fontSize: 16, color: '#e8eaf2' }}>
              No promoters found
            </p>
            <p style={{ margin: 0 }}>
              Try clearing filters or{' '}
              <button
                onClick={() => { setQuery(''); setCity('All'); setVerifiedOnly(false); }}
                style={{ background: 'none', border: 'none', color: '#b6a5ff', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit' }}
              >
                reset all filters
              </button>
              .
            </p>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map((p) => (
              <PromoterCard key={p.id} p={p} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={s.cta}>
          <h2 style={s.ctaTitle}>Run events?</h2>
          <p style={s.ctaSub}>Get found by artists and venues looking for promoters.</p>

          <div style={s.benefits}>
            <div style={s.benefit}>
              <p style={s.benefitTitle}>✅ Get verified</p>
              <p style={s.benefitDesc}>Build trust with artists &amp; venues.</p>
            </div>
            <div style={s.benefit}>
              <p style={s.benefitTitle}>📊 Track bookings</p>
              <p style={s.benefitDesc}>See who&apos;s viewing and booking you.</p>
            </div>
            <div style={s.benefit}>
              <p style={s.benefitTitle}>🎯 Get discovered</p>
              <p style={s.benefitDesc}>Appear in artist searches by city.</p>
            </div>
            <div style={s.benefit}>
              <p style={s.benefitTitle}>💬 Direct messages</p>
              <p style={s.benefitDesc}>Talk to artists without email.</p>
            </div>
          </div>

          <button style={s.ctaBtn}>Create promoter profile — free</button>
          <p style={s.ctaNote}>No credit card. Takes 2 minutes.</p>
        </div>
      </div>
    </main>
  );
}
