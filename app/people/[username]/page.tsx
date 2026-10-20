'use client';

import { useState, useEffect } from 'react';
import DemoSubmissionModal from '@/components/people/DemoSubmissionModal';
import MessageModal from '@/components/people/MessageModal';
import DemoStatusBar from '@/components/people/DemoStatusBar';
import type { DemoSubmission } from '@/components/people/DemoStatusBar';
import {
  TagIcon, UsersIcon, FlameIcon, MailIcon, MusicIcon, TrophyIcon,
  CalendarIcon, ClockIcon, XIcon, GiftIcon, PlayIcon, ChartIcon,
} from '@/components/people/Icons';

const PROFILE_DATA = {
  name: 'Sarah Jenkins',
  handle: '@sarahjenkins',
  role: 'A&R',
  label: 'Echo Chamber Records',
  city: 'London',
  followers: '3,400',
  responseTime: '48h',
  demosReviewed: 142,
  signingsCount: 3,
  signRate: '2%',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
  bio: "I'm an A&R at Echo Chamber Records, scouting for the next wave of underground club music. I've signed 3 artists in the last year and I'm looking for raw, unreleased tracks for my label.",
  socials: [
    { name: 'Instagram', url: 'https://instagram.com/sarahjenkins' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/sarahjenkins' },
    { name: 'Email', url: 'mailto:sarah@echochamber.co.uk' },
  ],
  recentSigningsStrip: ['Analog Dreams', 'Echo Chamber', 'Neon Nights'],
  lookingFor: ['Techno', 'Deep House', 'Minimal'],
  notLookingFor: ['EDM', 'Pop', 'Commercial House'],
  demoStatusText: 'Actively accepting until Dec 15, 2026',
  pitchingTo: ['Ninja Tune', 'Warp Records', 'XL Recordings'],
  picks: [
    { track: 'Midnight Sessions', artist: 'DJ Poxy', embedId: '5qap5aO4i9A' },
    { track: 'Neon London', artist: 'Alex Morgan', embedId: 'dQw4w9WgXcQ' },
    { track: 'Basement Collective', artist: 'Analog Dreams', embedId: 'jfKfPfyJRdk' },
  ],
  activity: [
    { date: 'Nov 12', text: "Added 'Midnight Sessions' to my pitch list" },
    { date: 'Nov 08', text: 'Signed Analog Dreams to Echo Chamber' },
  ],
  signings: ['Analog Dreams (Nov 2026)', 'Echo Chamber (Sep 2026)', 'Neon Nights (May 2026)'],
};

const INITIAL_DEMO: DemoSubmission = {
  trackName: 'Midnight Sessions',
  submittedAt: 'Nov 12, 2026 · 2:45pm',
  tier: 'priority',
  tierPrice: '£5',
  slaHours: 48,
  status: 'in_review',
  events: [
    { date: 'Nov 12 · 2:45pm', text: 'Demo received. Queued for review.', completed: true },
    { date: 'Nov 13 · 10:20am', text: 'Sarah listened to your track (full play, 4:12). Your demo is in active review.', completed: true },
    { date: 'Nov 14-15 (expected)', text: 'Feedback being prepared. SLA: 48h — 1 day remaining.', completed: false },
    { date: 'Nov 15 (expected)', text: 'Final decision: Sign / Feedback / Pass. Guaranteed response or full refund.', completed: false },
  ],
};

// Optional rejection demo
const REJECTED_DEMO: DemoSubmission = {
  trackName: 'Neon Skyline',
  submittedAt: 'Nov 05, 2026 · 9:12am',
  tier: 'standard',
  tierPrice: 'FREE',
  slaHours: 168,
  status: 'passed',
  events: [
    { date: 'Nov 05 · 9:12am', text: 'Demo received. Queued for review.', completed: true },
    { date: 'Nov 07 · 3:40pm', text: 'Sarah listened to your track (full play, 3:28).', completed: true },
    { date: 'Nov 10 · 11:00am', text: 'Feedback prepared.', completed: true },
    { date: 'Nov 10 · 11:05am', text: 'Decision: Pass. Feedback provided.', completed: true },
  ],
};

const s: Record<string, React.CSSProperties> = {
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
  sidebar: { background: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 },
  libTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 },
  libList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  libItem: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' },
  divider: { height: 1, background: '#f3f4f6', margin: '8px 0' },
  promoCard: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 },
  promoTitleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  promoTitle: { margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' },
  promoDesc: { margin: '0 0 12px', fontSize: 12, color: '#6b7280', lineHeight: 1.4 },
  promoBtn: { width: '100%', padding: '8px 0', borderRadius: 999, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  main: { paddingBottom: 64, width: '100%', overflowX: 'hidden' },
  banner: { height: 200, background: 'linear-gradient(135deg, #1f2937, #111827)' },
  contentWrap: { maxWidth: 1000, margin: '0 auto', padding: '0 24px', position: 'relative', top: -40 },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 },
  headerLeft: { display: 'flex', gap: 24, alignItems: 'flex-end' },
  avatar: { width: 120, height: 120, borderRadius: '50%', background: '#ffffff', border: '4px solid #ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  headerInfo: { paddingBottom: 12 },
  name: { margin: '0 0 4px', fontSize: 32, fontWeight: 800, color: '#111827' },
  handle: { margin: '0 0 8px', fontSize: 15, color: '#6b7280' },
  meta: { margin: '0 0 6px', fontSize: 14, color: '#374151', fontWeight: 500, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  subMeta: { margin: 0, fontSize: 13, color: '#6b7280', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 },
  actionRow: { display: 'flex', gap: 12, paddingBottom: 12 },
  btnFollow: { padding: '10px 24px', borderRadius: 999, border: '1px solid #111827', fontWeight: 600, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' },
  btnMessage: { padding: '10px 24px', borderRadius: 999, background: '#111827', color: '#ffffff', border: '1px solid #111827', fontWeight: 600, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
  socialProofStrip: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px 24px', marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  socialProofText: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  socialProofName: { fontSize: 13, color: '#111827', fontWeight: 600, background: '#f3f4f6', padding: '4px 10px', borderRadius: 999 },
  tierBox: { background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 16, padding: 32, marginTop: 24, color: '#ffffff' },
  tierTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: 800 },
  tierSub: { margin: '0 0 24px', fontSize: 14, color: '#9ca3af' },
  tierGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  tierCard: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, cursor: 'pointer' },
  tierBadge: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#b6a5ff', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 },
  tierName: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  tierPrice: { fontSize: 24, fontWeight: 800, marginBottom: 8 },
  tierPriceFree: { fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#10b981' },
  tierDesc: { fontSize: 12, color: '#9ca3af', lineHeight: 1.5, marginBottom: 16 },
  tierCta: { width: '100%', padding: '10px 0', borderRadius: 8, background: '#ffffff', color: '#111827', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  tierCtaPrimary: { width: '100%', padding: '10px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, marginTop: 32 },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 },
  sectionTitle: { margin: '0 0 16px', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 },
  bio: { margin: '0 0 16px', fontSize: 15, color: '#4b5563', lineHeight: 1.6 },
  socialLinksRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  socialBtn: { padding: '6px 12px', borderRadius: 6, background: '#f3f4f6', color: '#111827', fontSize: 13, fontWeight: 500, textDecoration: 'none', cursor: 'pointer' },
  pickRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f9fafb', borderRadius: 8, marginBottom: 8, cursor: 'pointer' },
  pickNum: { width: 32, height: 32, borderRadius: 6, background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 },
  pickTitle: { fontSize: 14, fontWeight: 600, color: '#111827' },
  pickArtist: { fontSize: 12, color: '#6b7280' },
  spotifyLink: { display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13, color: '#10b981', fontWeight: 600, textDecoration: 'none', cursor: 'pointer' },
  activityRow: { display: 'flex', gap: 12, fontSize: 14, color: '#374151', alignItems: 'center' },
  activityDate: { color: '#6b7280', fontSize: 12, minWidth: 50 },
  demoBox: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24, position: 'sticky', top: 24 },
  demoStatusText: { fontSize: 12, color: '#6b7280', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 },
  statusDot: { width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' },
  miniLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 },
  tagWrap: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tagGood: { background: '#f3f4f6', color: '#111827', padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500 },
  tagBad: { background: '#fef2f2', color: '#991b1b', padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500 },
  pitchingList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 },
  pitchingItem: { fontSize: 13, color: '#374151' },
  signingRow: { display: 'flex', gap: 8, fontSize: 13, color: '#374151' },
  checkMark: { color: '#10b981' },
  supportGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  supportCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, textAlign: 'center' },
  supportName: { fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 8 },
  supportBtn: { width: '100%', padding: '8px 0', borderRadius: 6, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
  toast: { position: 'fixed', bottom: 24, right: 24, background: '#111827', color: '#ffffff', padding: '12px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500, zIndex: 200, boxShadow: '0 10px 15px rgba(0,0,0,0.2)' },
  
  // NEW: Rejection Modal Styles
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24 },
  modalBox: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520 },
  modalTitle: { margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#111827' },
  modalSub: { margin: '0 0 20px', fontSize: 14, color: '#6b7280', lineHeight: 1.5 },
  feedbackBlock: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 14, color: '#374151', lineHeight: 1.6, fontStyle: 'italic' },
  modalActions: { display: 'flex', flexDirection: 'column', gap: 10 },
  modalBtnPrimary: { padding: '12px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  modalBtnSecondary: { padding: '12px 16px', borderRadius: 8, background: 'transparent', border: '1px solid #d1d5db', color: '#111827', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  modalBtnGhost: { padding: '12px 16px', borderRadius: 8, background: 'transparent', border: 'none', color: '#6b7280', fontWeight: 500, fontSize: 13, cursor: 'pointer' },

  // NEW: Submit Another Demo CTA
  nextDemoBox: { background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)', border: '1px solid #10b981', borderRadius: 12, padding: 24, marginTop: 16 },
  nextDemoTitle: { margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: 8 },
  nextDemoText: { margin: '0 0 16px', fontSize: 13, color: '#065f46', lineHeight: 1.5 },
  nextDemoBtn: { padding: '12px 24px', borderRadius: 8, background: '#10b981', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' },

  // NEW: Notification Bell
  bellBtn: { position: 'relative', padding: '10px 12px', borderRadius: 999, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  bellDot: { position: 'absolute', top: 6, right: 8, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' },
  bellPanel: { position: 'absolute', top: 52, right: 0, width: 320, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden' },
  bellHeader: { padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' },
  bellItem: { padding: '14px 16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
  bellItemTitle: { fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 },
  bellItemSub: { fontSize: 12, color: '#6b7280' },

  // Video embeds
  videoWrap: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, marginTop: 12 },
  videoFrame: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
};

export default function ARProfilePage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [following, setFollowing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [demoSubmission, setDemoSubmission] = useState<DemoSubmission | null>(INITIAL_DEMO);
  const [showRejection, setShowRejection] = useState(false);
  const [playTrack, setPlayTrack] = useState<string | null>(null);
  const [bellOpen, setBellOpen] = useState(false);

  useEffect(() => {
    const storedFollow = localStorage.getItem('follow_sarahjenkins');
    if (storedFollow === 'true') setFollowing(true);
  }, []);

  const handleFollow = () => {
    const next = !following;
    setFollowing(next);
    localStorage.setItem('follow_sarahjenkins', String(next));
    setToast(next ? "Following Sarah. You'll get notified about new signings." : 'Unfollowed Sarah.');
    setTimeout(() => setToast(null), 3000);
  };

  const openTier = (tier: string) => {
    setSelectedTier(tier);
    setIsDemoOpen(true);
  };

  const handleDemoClose = () => {
    if (selectedTier) {
      const tierPrice = selectedTier === 'priority' ? '£5' : selectedTier === 'session' ? '£49' : 'FREE';
      const slaHours = selectedTier === 'priority' ? 48 : selectedTier === 'session' ? 24 : 168;
      setDemoSubmission({
        trackName: 'Your New Track',
        submittedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
        tier: (selectedTier as any) || 'standard',
        tierPrice,
        slaHours,
        status: 'submitted',
        events: [
          { date: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }), text: 'Demo received. Queued for review.', completed: true },
          { date: 'Within the SLA', text: 'Sarah will listen and respond with feedback.', completed: false },
        ],
      });
      setToast('Demo submitted! You can track it above.');
      setTimeout(() => setToast(null), 4000);
    }
    setIsDemoOpen(false);
    setSelectedTier(null);
  };

  return (
    <div style={s.layout}>
      {/* LEFT SIDEBAR */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.libTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Your Library
          </div>
          <ul style={s.libList}>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>Home</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>Artists</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>Search</li>
            <div style={s.divider}></div>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path></svg>My Tickets</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>Friends</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>Messages</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>Following</li>
            <div style={s.divider}></div>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line></svg>Network</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>Opportunities</li>
            <li style={s.libItem}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>Dashboard</li>
          </ul>
        </div>
        <div style={s.promoCard}>
          <div style={s.promoTitleRow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <h4 style={s.promoTitle}>Find events near you</h4>
          </div>
          <p style={s.promoDesc}>Browse by city, genre, and date.</p>
          <button style={s.promoBtn}>Explore</button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        <div style={s.banner} />
        <div style={s.contentWrap}>
          {/* Header */}
          <div style={s.headerRow}>
            <div style={s.headerLeft}>
              <div style={s.avatar}>
                <img src={PROFILE_DATA.profileImage} alt={PROFILE_DATA.name} style={s.avatarImg} />
              </div>
              <div style={s.headerInfo}>
                <h1 style={s.name}>{PROFILE_DATA.name}</h1>
                <p style={s.handle}>{PROFILE_DATA.handle} · A&R at {PROFILE_DATA.label}</p>
                <p style={s.meta}>
                  <TagIcon width={14} height={14} /> {PROFILE_DATA.role}
                  <span>·</span>
                  <span>{PROFILE_DATA.city}</span>
                  <span>·</span>
                  <UsersIcon width={14} height={14} /> {PROFILE_DATA.followers} followers
                </p>
                <p style={s.subMeta}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <ClockIcon width={13} height={13} /> Responds in ~{PROFILE_DATA.responseTime}
                  </span>
                  <span>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MailIcon width={13} height={13} /> {PROFILE_DATA.demosReviewed} reviewed · {PROFILE_DATA.signingsCount} signed ({PROFILE_DATA.signRate})
                  </span>
                </p>
              </div>
            </div>

            <div style={s.actionRow}>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button onClick={() => setBellOpen(!bellOpen)} style={s.bellBtn} aria-label="Notifications">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                  <span style={s.bellDot} />
                </button>
                {bellOpen && (
                  <div style={s.bellPanel}>
                    <div style={s.bellHeader}>Notifications</div>
                    <div style={s.bellItem}>
                      <div style={s.bellItemTitle}>Sarah listened to your demo</div>
                      <div style={s.bellItemSub}>2 hours ago · Midnight Sessions</div>
                    </div>
                    <div style={s.bellItem}>
                      <div style={s.bellItemTitle}>Feedback ready from Sarah</div>
                      <div style={s.bellItemSub}>Yesterday · Neon Skyline</div>
                    </div>
                    <div style={s.bellItem}>
                      <div style={s.bellItemTitle}>Sarah signed Analog Dreams 🎉</div>
                      <div style={s.bellItemSub}>3 days ago</div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleFollow} style={{ ...s.btnFollow, background: following ? '#111827' : '#ffffff', color: following ? '#ffffff' : '#111827' }}>
                {following ? 'Following' : 'Follow'}
              </button>
              <button onClick={() => setIsMessageOpen(true)} style={s.btnMessage}>
                <MailIcon width={14} height={14} /> Message
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div style={s.socialProofStrip}>
            <span style={s.socialProofText}>Recently signed artists trust Sarah:</span>
            {PROFILE_DATA.recentSigningsStrip.map(name => (
              <span key={name} style={s.socialProofName}>{name}</span>
            ))}
          </div>

          {/* Demo Status Tracker */}
          {demoSubmission && <DemoStatusBar demo={demoSubmission} />}

          {/* Submit Another Demo CTA (only if there's an active demo) */}
          {demoSubmission && (
            <div style={s.nextDemoBox}>
              <h3 style={s.nextDemoTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                Got another track?
              </h3>
              <p style={s.nextDemoText}>
                You've submitted 1 demo to Sarah. She's reviewed {PROFILE_DATA.demosReviewed} this month.
                Artists who submit 2+ demos are 5x more likely to get signed.
              </p>
              <button style={s.nextDemoBtn} onClick={() => openTier('standard')}>
                Submit Your Next Track →
              </button>
            </div>
          )}

          {/* Rejection Demo (test trigger) */}
          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => setShowRejection(true)}
              style={{ padding: '8px 14px', borderRadius: 8, background: 'transparent', border: '1px dashed #d1d5db', color: '#6b7280', fontSize: 12, cursor: 'pointer' }}
            >
              (Demo: View a rejected submission)
            </button>
          </div>

          {/* Paid Demo Tiers */}
          <div style={s.tierBox}>
            <h2 style={s.tierTitle}>Submit Your Demo to Sarah</h2>
            <p style={s.tierSub}>Choose how you want your track reviewed. All tiers include honest feedback.</p>
            <div style={s.tierGrid}>
              <div style={s.tierCard} onClick={() => openTier('standard')}>
                <div style={s.tierBadge}><ChartIcon width={14} height={14} /> Standard</div>
                <div style={s.tierName}>Free Review</div>
                <div style={s.tierPriceFree}>FREE</div>
                <div style={s.tierDesc}>I listen and respond within 7 days. Honest feedback if it's not a fit.</div>
                <button style={s.tierCta}>Submit Free Demo</button>
              </div>
              <div style={s.tierCard} onClick={() => openTier('priority')}>
                <div style={s.tierBadge}><FlameIcon width={14} height={14} /> Priority</div>
                <div style={s.tierName}>48h Review</div>
                <div style={s.tierPrice}>£5</div>
                <div style={s.tierDesc}>Jump the queue. Guaranteed reply within 48 hours.</div>
                <button style={s.tierCtaPrimary}>Submit — £5</button>
              </div>
              <div style={s.tierCard} onClick={() => openTier('session')}>
                <div style={s.tierBadge}><MusicIcon width={14} height={14} /> Premium</div>
                <div style={s.tierName}>1-on-1 Session</div>
                <div style={s.tierPrice}>£65</div>
                <div style={s.tierDesc}>30-min video call. Detailed feedback + career advice.</div>
                <button style={s.tierCta}>Book Session — £65</button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div style={s.grid}>
            <div>
              <div style={s.card}>
                <h2 style={s.sectionTitle}>About Sarah</h2>
                <p style={s.bio}>{PROFILE_DATA.bio}</p>
                <div style={s.socialLinksRow}>
                  {PROFILE_DATA.socials.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" style={s.socialBtn}>{link.name}</a>
                  ))}
                </div>
                <div style={{ fontSize: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div><span style={{ color: '#6b7280' }}>Label:</span> <strong>{PROFILE_DATA.label}</strong></div>
                  <div><span style={{ color: '#6b7280' }}>Location:</span> <strong>{PROFILE_DATA.city}, UK</strong></div>
                </div>
              </div>

              <div style={s.card}>
                <h2 style={s.sectionTitle}><MusicIcon width={18} height={18} /> What I'm Listening To</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {PROFILE_DATA.picks.map((pick, i) => (
                    <div key={i}>
                      <div style={s.pickRow} onClick={() => setPlayTrack(playTrack === pick.embedId ? null : pick.embedId)}>
                        <div style={s.pickNum}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={s.pickTitle}>{pick.track}</div>
                          <div style={s.pickArtist}>{pick.artist}</div>
                        </div>
                        <div style={{ color: '#9ca3af', display: 'flex', alignItems: 'center' }}><PlayIcon width={16} height={16} /></div>
                      </div>
                      {playTrack === pick.embedId && (
                        <div style={s.videoWrap}>
                          <iframe
                            style={s.videoFrame}
                            src={`https://www.youtube.com/embed/${pick.embedId}?autoplay=1`}
                            title={pick.track}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer" style={s.spotifyLink}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14.5c2-1 5-1 8 0M8 10.5c3-1.5 7-1.5 10 0M8 6.5c4-2 9-2 12 0"></path></svg>
                  Listen to full playlist on Spotify →
                </a>
              </div>

              <div style={s.card}>
                <h2 style={s.sectionTitle}><CalendarIcon width={18} height={18} /> Recent Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {PROFILE_DATA.activity.map((act, i) => (
                    <div key={i} style={s.activityRow}>
                      <span style={s.activityDate}>{act.date}</span>
                      <span>{act.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={s.card}>
                <h2 style={s.sectionTitle}><GiftIcon width={18} height={18} /> Support Sarah's Artists</h2>
                <div style={s.supportGrid}>
                  <div style={s.supportCard}>
                    <div style={s.supportName}>Analog Dreams</div>
                    <button style={s.supportBtn}>Shop Merch</button>
                  </div>
                  <div style={s.supportCard}>
                    <div style={s.supportName}>Echo Chamber</div>
                    <button style={s.supportBtn}>Buy Music</button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div style={s.demoBox}>
                <h3 style={s.sectionTitle}><FlameIcon width={18} height={18} /> Open to Demos</h3>
                <p style={s.demoStatusText}>
                  <span style={s.statusDot} />
                  {PROFILE_DATA.demoStatusText}
                </p>
                <div style={{ marginBottom: 12 }}>
                  <div style={s.miniLabel}>Looking For</div>
                  <div style={s.tagWrap}>
                    {PROFILE_DATA.lookingFor.map(tag => (<span key={tag} style={s.tagGood}>{tag}</span>))}
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={s.miniLabel}><XIcon width={12} height={12} /> Not Looking For</div>
                  <div style={s.tagWrap}>
                    {PROFILE_DATA.notLookingFor.map(tag => (<span key={tag} style={s.tagBad}>{tag}</span>))}
                  </div>
                </div>
              </div>

              <div style={s.card}>
                <h3 style={s.sectionTitle}><ChartIcon width={16} height={16} /> Currently Pitching To</h3>
                <ul style={s.pitchingList}>
                  {PROFILE_DATA.pitchingTo.map(label => (<li key={label} style={s.pitchingItem}>• {label}</li>))}
                </ul>
              </div>

              <div style={s.card}>
                <h3 style={s.sectionTitle}><TrophyIcon width={16} height={16} /> Recent Signings</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {PROFILE_DATA.signings.map((signing, i) => (
                    <div key={i} style={s.signingRow}>
                      <span style={s.checkMark}>✓</span>
                      <span>{signing}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && <div style={s.toast}>{toast}</div>}

      {/* Rejection Modal */}
      {showRejection && (
        <div style={s.modalOverlay} onClick={() => setShowRejection(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>Sarah reviewed your demo</h2>
            <p style={s.modalSub}>Track: "Neon Skyline" · Submitted Nov 05</p>
            <div style={s.feedbackBlock}>
              "Great groove, but the mix needs work. Consider investing in a mastering engineer before pitching again. I'd love to hear a revised version in a few months."
              <div style={{ marginTop: 12, fontSize: 13, color: '#6b7280', fontStyle: 'normal', fontWeight: 600 }}>— Sarah Jenkins</div>
            </div>
            <div style={s.modalActions}>
              <button style={s.modalBtnPrimary} onClick={() => { setShowRejection(false); openTier('standard'); }}>
                Submit Revised Track
              </button>
              <button style={s.modalBtnSecondary}>
                Get Pro Mix Help →
              </button>
              <button style={s.modalBtnGhost} onClick={() => setShowRejection(false)}>
                Try another A&R instead
              </button>
            </div>
          </div>
        </div>
      )}

      <DemoSubmissionModal isOpen={isDemoOpen} onClose={handleDemoClose} recipientName={PROFILE_DATA.name} />
      <MessageModal isOpen={isMessageOpen} onClose={() => setIsMessageOpen(false)} recipientName={PROFILE_DATA.name} recipientHandle={PROFILE_DATA.handle} />
    </div>
  );
}
