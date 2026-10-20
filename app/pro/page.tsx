'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MusicIcon, UsersIcon, TrophyIcon, MailIcon, ChartIcon, FlameIcon,
  GiftIcon, TagIcon, CalendarIcon, ClockIcon,
} from '@/components/people/Icons';

type Role = 'artist' | 'promoter' | 'venue' | 'label';
type Billing = 'monthly' | 'yearly';

const FEATURES_BY_ROLE: Record<Role, { icon: any; title: string; desc: string }[]> = {
  artist: [
    { icon: TrophyIcon, title: 'Priority Placement', desc: 'Your profile appears at the top of search and A&R feeds.' },
    { icon: TagIcon, title: 'Verified Badge', desc: 'Green checkmark signals you are a real pro.' },
    { icon: ChartIcon, title: 'Profile Analytics', desc: "See who's viewing you, where they're from, and what's hot." },
    { icon: MailIcon, title: 'Direct Messages', desc: 'Message A&Rs, promoters, and labels directly.' },
    { icon: MusicIcon, title: 'Advanced Tracks', desc: 'Unlimited uploads, playlists, and detailed analytics.' },
    { icon: GiftIcon, title: 'Unlimited Demos', desc: 'Submit to any A&R without paying per submission.' },
  ],
  promoter: [
    { icon: FlameIcon, title: 'Featured Events', desc: 'Pinned at the top of Discover and search results.' },
    { icon: MailIcon, title: 'Unlimited Messaging', desc: 'Contact any artist or venue with no limits.' },
    { icon: UsersIcon, title: 'Roster Analytics', desc: "See who's going to your events and why." },
    { icon: CalendarIcon, title: 'Ticket Tracking', desc: 'Real-time sales, venue insights, and conversion.' },
    { icon: ClockIcon, title: 'Booking Calendar', desc: 'Share availability directly with artists.' },
    { icon: TagIcon, title: 'Verified Badge', desc: 'The badge artists and venues trust.' },
  ],
  venue: [
    { icon: FlameIcon, title: 'Priority Listing', desc: 'Your venue appears at the top of venue search.' },
    { icon: CalendarIcon, title: 'Event Hosting', desc: 'Host and promote events directly from your profile.' },
    { icon: MailIcon, title: 'Direct Promoter Access', desc: 'Message promoters looking for space.' },
    { icon: ChartIcon, title: 'Footfall Analytics', desc: 'See who is viewing your venue and when.' },
    { icon: TagIcon, title: 'Verified Venue Badge', desc: 'Prove legitimacy to promoters and labels.' },
    { icon: UsersIcon, title: 'Team Access', desc: 'Add multiple team members to manage listings.' },
  ],
  label: [
    { icon: MusicIcon, title: 'Bulk Demo Review', desc: 'Review hundreds of submissions at once.' },
    { icon: ChartIcon, title: 'Advanced Analytics', desc: 'See pitch performance across all artists.' },
    { icon: TagIcon, title: 'Verified Label Badge', desc: 'Blue checkmark for instant credibility.' },
    { icon: FlameIcon, title: 'Priority A&R Placement', desc: 'Your A&R profiles rank above free accounts.' },
    { icon: UsersIcon, title: 'Unlimited Team Seats', desc: 'Add your whole A&R team at no extra cost.' },
    { icon: MailIcon, title: 'Direct Artist Outreach', desc: 'Contact any artist on GRID with one click.' },
  ],
};

const PRICING_BY_ROLE: Record<Role, { monthly: number; yearly: number; label: string }> = {
  artist: { monthly: 9, yearly: 90, label: 'Artist' },
  promoter: { monthly: 19, yearly: 190, label: 'Promoter' },
  venue: { monthly: 19, yearly: 190, label: 'Venue' },
  label: { monthly: 29, yearly: 290, label: 'Label' },
};

const COMPARISON = [
  { feature: 'Create a profile', free: true, pro: true },
  { feature: 'Browse promoters and events', free: true, pro: true },
  { feature: 'Apply to opportunities', free: true, pro: true },
  { feature: 'Upload up to 5 tracks', free: true, pro: true },
  { feature: 'Unlimited track uploads', free: false, pro: true },
  { feature: 'Verified badge on profile', free: false, pro: true },
  { feature: 'Priority search placement', free: false, pro: true },
  { feature: 'Profile analytics dashboard', free: false, pro: true },
  { feature: 'Direct messaging to anyone', free: false, pro: true },
  { feature: 'Early access to new listings', free: false, pro: true },
  { feature: 'Apply to sync and brand deals', free: false, pro: true },
  { feature: 'Unlimited demo submissions', free: false, pro: true },
  { feature: 'Team seats (multi-user access)', free: false, pro: true },
];

const TESTIMONIALS = [
  { name: 'DJ Poxy', city: 'London', quote: "I went from 3 gigs a year to 3 gigs a month. The analytics alone paid for itself.", photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { name: 'Nightshift Presents', city: 'London', quote: "Verified badge got me 5x more promo bookings. Worth every penny.", photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { name: 'Sarah Jenkins', city: 'Echo Chamber Records', quote: "The DM tool replaced my entire email workflow. I book artists in 2 clicks now.", photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
];

const FAQ = [
  { q: 'Can I cancel anytime?', a: 'Yes. One click. No questions asked. Your data stays safe.' },
  { q: 'Is there a free trial?', a: 'Yes — 14 days, no credit card required. If it is not for you, you cancel with one click.' },
  { q: 'What happens to my Pro data if I cancel?', a: 'Your profile, tracks, and messages stay. You just lose access to Pro features (analytics, priority placement, DMs).' },
  { q: 'Do I need Pro as a promoter?', a: 'No — but Pro promoters get 3x more artist applications because their listings are featured.' },
  { q: 'Can I upgrade from Pro to Pro Plus later?', a: 'Yes. You only pay the difference.' },
  { q: 'Is there a discount for yearly billing?', a: 'Yes — 2 months free. Equivalent to saving £18-£58/year depending on role.' },
];

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111827', paddingBottom: 80 },
  hero: { background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', padding: '80px 24px', color: '#ffffff', position: 'relative', overflow: 'hidden' },
  heroInner: { maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 },
  heroBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(124,92,255,0.15)', border: '1px solid rgba(124,92,255,0.4)', color: '#b6a5ff', padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', marginBottom: 24, textTransform: 'uppercase' as const },
  heroTitle: { fontSize: 56, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.02em' },
  heroSub: { fontSize: 20, color: '#9ca3af', margin: '0 0 32px', lineHeight: 1.5, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' },
  roleSelector: { display: 'inline-flex', gap: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: 6, marginBottom: 32, flexWrap: 'wrap' as const, justifyContent: 'center' },
  roleBtn: { padding: '10px 20px', borderRadius: 999, border: 'none', background: 'transparent', color: '#9ca3af', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 },
  roleBtnActive: { padding: '10px 20px', borderRadius: 999, border: 'none', background: '#ffffff', color: '#111827', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  heroCta: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', marginBottom: 16, boxShadow: '0 10px 25px rgba(124,92,255,0.3)' },
  heroCtaNote: { fontSize: 13, color: '#9ca3af', margin: '0 0 32px' },
  heroSocialProof: { fontSize: 14, color: '#9ca3af', marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' },
  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  section: { padding: '80px 0' },
  sectionGray: { background: '#f9fafb', padding: '80px 0' },
  sectionTitle: { fontSize: 38, fontWeight: 800, margin: '0 0 12px', textAlign: 'center' as const, letterSpacing: '-0.02em' },
  sectionSub: { fontSize: 17, color: '#6b7280', margin: '0 0 48px', textAlign: 'center' as const, maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' },
  
  // New Press Strip
  pressStrip: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 40, flexWrap: 'wrap' as const, marginBottom: 48, opacity: 0.6, filter: 'grayscale(1)' },
  pressLogo: { fontSize: 18, fontWeight: 800, letterSpacing: '0.02em' },
  
  // New Booking Stats
  liveStatRow: { display: 'flex', justifyContent: 'center', gap: 40, marginTop: 24, fontSize: 14, color: '#374151', fontWeight: 500 },
  liveDot: { display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginRight: 6 },
  
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  featureCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 28 },
  featureIcon: { width: 44, height: 44, borderRadius: 10, background: '#f3f0ff', color: '#7c5cff', display: 'grid', placeItems: 'center', marginBottom: 16 },
  featureTitle: { fontSize: 16, fontWeight: 700, margin: '0 0 8px' },
  featureDesc: { fontSize: 14, color: '#4b5563', lineHeight: 1.6, margin: 0 },
  
  // New Analytics Preview
  analyticsPreview: { background: '#111827', borderRadius: 16, padding: 32, maxWidth: 700, margin: '48px auto 0', color: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
  analyticsHeader: { fontSize: 12, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 16, fontWeight: 700 },
  analyticsBigNum: { fontSize: 40, fontWeight: 800, marginBottom: 8 },
  analyticsChart: { display: 'flex', alignItems: 'flex-end', gap: 6, height: 60, marginBottom: 20, borderBottom: '1px solid #374151', paddingBottom: 8 },
  analyticsBar: { flex: 1, background: 'linear-gradient(to top, #7c5cff, #b6a5ff)', borderRadius: 4 },
  analyticsList: { listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#d1d5db' },
  analyticsItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #374151' },
  
  tableWrap: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', maxWidth: 700, margin: '0 auto' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1fr 100px 100px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  tableRow: { display: 'grid', gridTemplateColumns: '1fr 100px 100px', padding: '14px 24px', borderBottom: '1px solid #f3f4f6', fontSize: 14, alignItems: 'center' },
  tableRowPro: { background: '#faf9ff' },
  tableFeature: { color: '#374151', fontWeight: 500 },
  tableCell: { textAlign: 'center' as const },
  checkGreen: { color: '#10b981', fontWeight: 700 },
  dashGray: { color: '#d1d5db' },
  
  // New Loss Aversion box
  lossBox: { background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: 24, maxWidth: 700, margin: '32px auto 0' },
  lossTitle: { fontSize: 16, fontWeight: 700, color: '#991b1b', margin: '0 0 12px' },
  lossItem: { fontSize: 14, color: '#7f1d1d', marginBottom: 8, display: 'flex', gap: 8 },
  lossTotal: { fontSize: 15, fontWeight: 700, color: '#991b1b', marginTop: 16, paddingTop: 16, borderTop: '1px solid #fca5a5' },

  // New Pricing Toggle
  billingToggle: { display: 'inline-flex', gap: 8, background: '#f3f4f6', borderRadius: 999, padding: 6, marginBottom: 32 },
  billingBtn: { padding: '10px 24px', borderRadius: 999, border: 'none', background: 'transparent', color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  billingBtnActive: { padding: '10px 24px', borderRadius: 999, border: 'none', background: '#111827', color: '#ffffff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  saveBadge: { fontSize: 11, background: '#10b981', color: '#ffffff', padding: '2px 8px', borderRadius: 999, marginLeft: 6, fontWeight: 700 },

  pricingBox: { maxWidth: 460, margin: '0 auto', background: '#ffffff', border: '2px solid #111827', borderRadius: 20, padding: 40, textAlign: 'center' as const },
  pricingBadge: { display: 'inline-block', background: '#f3f0ff', color: '#7c5cff', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  pricingName: { fontSize: 24, fontWeight: 800, margin: '0 0 16px' },
  pricingAmount: { fontSize: 56, fontWeight: 800, margin: '0 0 8px', lineHeight: 1 },
  pricingPeriod: { fontSize: 18, color: '#6b7280', fontWeight: 500 },
  pricingNote: { fontSize: 14, color: '#6b7280', marginBottom: 32 },
  pricingFeatures: { textAlign: 'left' as const, marginBottom: 32 },
  pricingFeature: { display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#374151', marginBottom: 12 },
  pricingCta: { width: '100%', padding: '16px 0', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' },
  pricingTrial: { fontSize: 13, color: '#6b7280', marginTop: 16, lineHeight: 1.6 },
  
  // New What Happens Next
  nextSteps: { background: '#f9fafb', borderRadius: 12, padding: 20, marginTop: 24, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', textAlign: 'left' as const },
  nextStep: { display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: '#4b5563', marginBottom: 12 },
  nextStepNum: { width: 22, height: 22, borderRadius: '50%', background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 },

  urgency: { background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 12, padding: '16px 24px', maxWidth: 700, margin: '0 auto 32px', textAlign: 'center' as const, fontSize: 14, color: '#92400e', fontWeight: 500 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 800, margin: '0 auto' },
  statCard: { textAlign: 'center' as const, padding: 24 },
  statNumber: { fontSize: 48, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' },
  statLabel: { fontSize: 14, color: '#6b7280', margin: 0 },
  
  successGrid: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 40, alignItems: 'center' as const, maxWidth: 900, margin: '0 auto', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 20, padding: 40 },
  successPhoto: { width: '100%', aspectRatio: '1', borderRadius: 16, objectFit: 'cover' as const },
  successName: { fontSize: 24, fontWeight: 800, margin: '0 0 4px' },
  successLocation: { fontSize: 14, color: '#6b7280', margin: '0 0 16px' },
  successStat: { display: 'inline-block', background: '#f3f0ff', color: '#7c5cff', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, marginBottom: 16 },
  successQuote: { fontSize: 18, color: '#374151', lineHeight: 1.6, fontStyle: 'italic' as const, margin: 0 },
  
  testimonialGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  testimonialCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 },
  testimonialQuote: { fontSize: 15, color: '#374151', lineHeight: 1.6, margin: '0 0 20px', fontStyle: 'italic' as const },
  testimonialAuthor: { display: 'flex', alignItems: 'center', gap: 12 },
  testimonialPhoto: { width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' as const },
  testimonialName: { fontSize: 14, fontWeight: 700, margin: '0 0 2px' },
  testimonialCity: { fontSize: 12, color: '#6b7280', margin: 0 },
  
  memberStrip: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const, maxWidth: 700, margin: '0 auto' },
  memberAvatar: { width: 48, height: 48, borderRadius: '50%', background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, border: '2px solid #ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' },
  memberCount: { width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', color: '#6b7280', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 11 },
  
  faqList: { maxWidth: 700, margin: '0 auto' },
  faqItem: { borderBottom: '1px solid #e5e7eb', padding: '20px 0' },
  faqQuestion: { fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  faqAnswer: { fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginTop: 12, marginBottom: 0 },
  
  finalCta: { background: 'linear-gradient(135deg, #111827, #1f2937)', padding: '80px 24px', textAlign: 'center' as const, color: '#ffffff' },
  finalTitle: { fontSize: 40, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.02em' },
  finalSub: { fontSize: 18, color: '#9ca3af', margin: '0 0 32px' },
  finalCtaBtn: { padding: '18px 40px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 17, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 25px rgba(124,92,255,0.3)' },
  talkToUs: { marginTop: 24, fontSize: 14, color: '#9ca3af' },
  talkToUsLink: { color: '#b6a5ff', textDecoration: 'underline', cursor: 'pointer' },

  // Sticky CTA
  stickyBar: { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' },
  stickyText: { fontSize: 14, fontWeight: 600, color: '#111827' },
  stickySub: { fontSize: 12, color: '#6b7280' },
  stickyBtn: { padding: '12px 24px', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};

const ROLE_ICONS: Record<Role, any> = {
  artist: MusicIcon,
  promoter: FlameIcon,
  venue: CalendarIcon,
  label: TagIcon,
};

export default function ProPage() {
  const [role, setRole] = useState<Role>('artist');
  const [billing, setBilling] = useState<Billing>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = FEATURES_BY_ROLE[role];
  const pricing = PRICING_BY_ROLE[role];
  const RoleIcon = ROLE_ICONS[role];

  return (
    <main style={s.page}>
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>GRID PRO</div>
          <h1 style={s.heroTitle}>Get booked.<br />Get discovered.<br />Get paid.</h1>
          <p style={s.heroSub}>The tools serious artists, promoters, and venues use to grow their careers on GRID.</p>
          
          <div style={s.roleSelector}>
            {(['artist', 'promoter', 'venue', 'label'] as Role[]).map(r => {
              const Icon = ROLE_ICONS[r];
              return (
                <button key={r} onClick={() => setRole(r)} style={role === r ? s.roleBtnActive : s.roleBtn}>
                  <Icon width={16} height={16} />
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              );
            })}
          </div>

          <div>
            <a href="#pricing" style={{ ...s.heroCta, textDecoration: 'none' }}>Start 14-Day Free Trial</a>
          </div>
          <p style={s.heroCtaNote}>Cancel anytime · No credit card required · £{pricing.monthly}/month for {pricing.label}</p>
          
          <div style={s.heroSocialProof}>
            Trusted by 2,400+ artists, 180 promoters, and 40 venues.
          </div>
          
          <div style={s.liveStatRow}>
            <span><span style={s.liveDot} />412 gigs booked via GRID Pro this month</span>
            <span><span style={s.liveDot} />2,847 artists booked in the last 30 days</span>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.container}>
          <div style={s.statGrid}>
            <div style={s.statCard}><div style={s.statNumber}>3.2x</div><p style={s.statLabel}>more bookings for Pro artists</p></div>
            <div style={s.statCard}><div style={s.statNumber}>2,400+</div><p style={s.statLabel}>artists, promoters and venues on Pro</p></div>
            <div style={s.statCard}><div style={s.statNumber}>98%</div><p style={s.statLabel}>of Pro users renew every month</p></div>
          </div>
          <div style={s.pressStrip}>
            <span style={s.pressLogo}>MIXMAG</span>
            <span style={s.pressLogo}>RESIDENT ADVISOR</span>
            <span style={s.pressLogo}>DJ MAG</span>
            <span style={s.pressLogo}>BBC R1</span>
            <span style={s.pressLogo}>PITCHFORK</span>
          </div>
        </div>
      </section>

      <section style={s.sectionGray}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Everything a {pricing.label.toLowerCase()} needs.</h2>
          <p style={s.sectionSub}>Switch roles above to see what Pro unlocks for you.</p>
          <div style={s.featureGrid}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={s.featureCard}>
                  <div style={s.featureIcon}><Icon width={22} height={22} /></div>
                  <h3 style={s.featureTitle}>{f.title}</h3>
                  <p style={s.featureDesc}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          {role === 'artist' && (
            <div style={s.analyticsPreview}>
              <div style={s.analyticsHeader}>YOUR PRO ANALYTICS · PREVIEW</div>
              <div style={s.analyticsBigNum}>248 profile views <span style={{ fontSize: 16, color: '#9ca3af' }}>this week</span></div>
              <div style={s.analyticsChart}>
                {[40, 55, 70, 50, 85, 65, 75].map((h, i) => (
                  <div key={i} style={{ ...s.analyticsBar, height: `${h}%` }} />
                ))}
              </div>
              <ul style={s.analyticsList}>
                <li style={s.analyticsItem}><span>Nightshift Presents</span><span>4 visits</span></li>
                <li style={s.analyticsItem}><span>Echo Chamber Records</span><span>3 visits</span></li>
                <li style={s.analyticsItem}><span>Techno Nation</span><span>2 visits</span></li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <section style={s.section}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Real results from real users.</h2>
          <p style={s.sectionSub}>The proof, not the pitch.</p>
          <div style={s.successGrid}>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" alt="DJ Poxy" style={s.successPhoto} />
            <div>
              <h3 style={s.successName}>DJ Poxy</h3>
              <p style={s.successLocation}>London · House / Techno</p>
              <span style={s.successStat}>3 gigs/year → 3 gigs/month</span>
              <p style={s.successQuote}>"The analytics alone paid for itself in 2 weeks. I now see exactly which promoters view my profile, and I can reach out directly. GRID Pro is the difference between 'maybe next year' and 'booked'."</p>
            </div>
          </div>
        </div>
      </section>

      <section style={s.sectionGray}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Free vs Pro. See the difference.</h2>
          <p style={s.sectionSub}>What you get for free — and what Pro unlocks.</p>
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <div>Feature</div><div style={s.tableCell}>Free</div><div style={s.tableCell}>Pro</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} style={row.pro && !row.free ? { ...s.tableRow, ...s.tableRowPro } : s.tableRow}>
                <div style={s.tableFeature}>{row.feature}</div>
                <div style={s.tableCell}>{row.free ? <span style={s.checkGreen}>✓</span> : <span style={s.dashGray}>—</span>}</div>
                <div style={s.tableCell}><span style={s.checkGreen}>✓</span></div>
              </div>
            ))}
          </div>

          <div style={s.lossBox}>
            <h3 style={s.lossTitle}>What staying on Free costs you:</h3>
            <div style={s.lossItem}>✗ Missed bookings (avg £500/gig × 2-3/month)</div>
            <div style={s.lossItem}>✗ Lost visibility in search rankings</div>
            <div style={s.lossItem}>✗ No analytics to know who's viewing you</div>
            <div style={s.lossItem}>✗ No direct messaging (must use email)</div>
            <div style={s.lossTotal}>Total opportunity cost: £1,000-£1,500/month</div>
          </div>
        </div>
      </section>

      <section style={s.section} id="pricing">
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Simple, one price.</h2>
          <p style={s.sectionSub}>For {pricing.label}s. No hidden fees. Cancel anytime.</p>
          <div style={s.urgency}>🎉 Launch pricing: £{pricing.monthly}/month for {pricing.label}s. Regular price £{pricing.monthly + 3}/month starting Jan 1, 2027.</div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={s.billingToggle}>
              <button onClick={() => setBilling('monthly')} style={billing === 'monthly' ? s.billingBtnActive : s.billingBtn}>
                Monthly
              </button>
              <button onClick={() => setBilling('yearly')} style={billing === 'yearly' ? s.billingBtnActive : s.billingBtn}>
                Yearly <span style={s.saveBadge}>Save 17%</span>
              </button>
            </div>
          </div>

          <div style={s.pricingBox}>
            <div style={s.pricingBadge}>MOST POPULAR</div>
            <h3 style={s.pricingName}>GRID PRO</h3>
            {billing === 'monthly' ? (
              <div style={s.pricingAmount}>£{pricing.monthly}<span style={s.pricingPeriod}>/month</span></div>
            ) : (
              <div style={s.pricingAmount}>£{pricing.yearly}<span style={s.pricingPeriod}>/year</span></div>
            )}
            <p style={s.pricingNote}>for {pricing.label}s · billed {billing}</p>
            
            <div style={s.pricingFeatures}>
              {[
                'Unlimited track uploads + advanced analytics',
                'Verified badge on profile & search results',
                'Priority placement in every search',
                'Direct messaging to any A&R or promoter',
                'Unlimited demo submissions (no £5 fee)',
                'Early access to new opportunities',
              ].map(f => (
                <div key={f} style={s.pricingFeature}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {f}
                </div>
              ))}
            </div>
            <button style={s.pricingCta}>Start 14-Day Free Trial</button>
            <p style={s.pricingTrial}>
              You won't be charged until your trial ends.<br />
              We'll email you 3 days before, so you can cancel anytime.
            </p>
          </div>

          <div style={s.nextSteps}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>What happens next:</div>
            <div style={s.nextStep}><div style={s.nextStepNum}>1</div><div>Click "Start Free Trial"</div></div>
            <div style={s.nextStep}><div style={s.nextStepNum}>2</div><div>Sign in with email (30 sec)</div></div>
            <div style={s.nextStep}><div style={s.nextStepNum}>3</div><div>Full Pro access instantly</div></div>
            <div style={{ ...s.nextStep, marginBottom: 0 }}><div style={s.nextStepNum}>4</div><div>Cancel anytime in settings</div></div>
          </div>
        </div>
      </section>

      <section style={s.sectionGray}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Join these Pro members.</h2>
          <p style={s.sectionSub}>Real artists. Real promoters. Real venues.</p>
          <div style={s.memberStrip}>
            {['DP', 'AG', 'NP', 'WS', 'TN', 'AD', 'MR'].map((initials, i) => (
              <div key={i} style={s.memberAvatar}>{initials}</div>
            ))}
            <div style={s.memberCount}>+2.4k</div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', marginTop: 16 }}>
            DJ Poxy · Amelia Grant · Nightshift Presents · Warehouse Sessions · Techno Nation
          </p>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>What Pro users say.</h2>
          <p style={s.sectionSub}>Real quotes from real subscribers.</p>
          <div style={s.testimonialGrid}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={s.testimonialCard}>
                <p style={s.testimonialQuote}>"{t.quote}"</p>
                <div style={s.testimonialAuthor}>
                  <img src={t.photo} alt={t.name} style={s.testimonialPhoto} />
                  <div>
                    <p style={s.testimonialName}>{t.name}</p>
                    <p style={s.testimonialCity}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s.sectionGray}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Questions? We've got answers.</h2>
          <p style={s.sectionSub}>Everything you need to know before you upgrade.</p>
          <div style={s.faqList}>
            {FAQ.map((item, i) => (
              <div key={i} style={s.faqItem}>
                <div style={s.faqQuestion} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{item.q}</span>
                  <span style={{ fontSize: 20, color: '#9ca3af' }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && <p style={s.faqAnswer}>{item.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={s.finalCta}>
        <div style={s.container}>
          <h2 style={s.finalTitle}>Ready to grow your career?</h2>
          <p style={s.finalSub}>Join 2,400+ Pro users. Cancel anytime.</p>
          <button style={s.finalCtaBtn}>Start 14-Day Free Trial →</button>
          <p style={s.talkToUs}>Still not sure? <span style={s.talkToUsLink}>Talk to us first →</span></p>
        </div>
      </section>

      {showSticky && (
        <div style={s.stickyBar}>
          <div>
            <div style={s.stickyText}>GRID PRO · £{billing === 'monthly' ? pricing.monthly : pricing.yearly}/{billing === 'monthly' ? 'mo' : 'yr'}</div>
            <div style={s.stickySub}>14-day free trial · Cancel anytime</div>
          </div>
          <button style={s.stickyBtn}>Start Trial →</button>
        </div>
      )}
    </main>
  );
}
