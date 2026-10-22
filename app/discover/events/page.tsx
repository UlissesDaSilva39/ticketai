'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarIcon, MapPinIcon, UsersIcon, DollarIcon, FlameIcon,
  BookmarkIcon, ClockIcon, MusicIcon, TagIcon,
} from '@/components/people/Icons';
import { FALLBACK_FEATURED, FALLBACK_ALL } from '@/lib/events/fallback';
import type { DiscoverEvent } from '@/lib/events/fallback';

// ============ MOCK DATA ============

const STARTING_SOON = [
  { id: 's1', title: 'Pomoer Odyssey Live', time: '22:00', ticketsLeft: 5, banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop' },
  { id: 's2', title: 'Alice Waves Live', time: '23:00', ticketsLeft: 0, banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop' },
  { id: 's3', title: 'Bobby Beats Garage Night', time: '00:00', ticketsLeft: 20, banner: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
];

const EVENTS = [
  { id: '1', title: 'Analog Dreams Live', date: 'Sat, 24 Oct', time: '18:16', venue: 'Test - First Venue', city: 'London', price: 16, banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', friends: ['Amelia G', 'Sam O'], friendsCount: 3, ticketsLeft: 15, soldOut: false, verified: true },
  { id: '2', title: 'Alice Waves Live', date: 'Tue, 27 Oct', time: '17:16', venue: 'The Blue Note', city: 'London', price: 14, banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop', friends: ['Maya C', 'Lily M'], friendsCount: 6, ticketsLeft: null, soldOut: false, verified: true },
  { id: '3', title: 'Voice Records Crew Live', date: 'Thu, 29 Oct', time: '17:16', venue: 'Test 15%', city: 'London', price: 12, banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=600&auto=format&fit=crop', friends: [], friendsCount: 4, ticketsLeft: null, soldOut: false, verified: false },
  { id: '4', title: 'Concrete Garden Live', date: 'Thu, 29 Oct', time: '17:16', venue: 'Test 15%', city: 'London', price: 16, banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=600&auto=format&fit=crop', friends: ['Alex M'], friendsCount: 2, ticketsLeft: null, soldOut: false, verified: true },
  { id: '5', title: 'Bobby Beats Garage Night', date: 'Sat, 31 Oct', time: '17:16', venue: 'Test - First Venue', city: 'London', price: 15, banner: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop', friends: [], friendsCount: 0, ticketsLeft: null, soldOut: false, verified: false },
  { id: '6', title: 'Ulisses Da Silva Live', date: 'Fri, 6 Nov', time: '17:16', venue: 'Test 15%', city: 'London', price: 22, banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', friends: ['Amelia G'], friendsCount: 5, ticketsLeft: null, soldOut: false, verified: true },
  { id: '7', title: 'Warehouse Sessions 12', date: 'Sat, 15 Nov', time: '22:00', venue: 'Basement 44', city: 'London', price: 25, banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=600&auto=format&fit=crop', friends: ['Sam O', 'Maya C'], friendsCount: 12, ticketsLeft: 0, soldOut: true, verified: true },
];

const CITIES = ['All', 'London', 'Manchester', 'Birmingham', 'Berlin', 'Paris', 'New York'];
const GENRES = ['All', 'House', 'Techno', 'Hip-Hop', 'Jazz', 'Electronic', 'Afrobeats'];
const WHEN = ['All', 'Tonight', 'This Weekend', 'This Week', 'This Month'];
const PRICES = ['All', 'Free', 'Under £20', '£20-£50', '£50+'];

// ============ STYLES ============
const s: Record<string, React.CSSProperties> = {
  layout: { display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
  
  // Sidebar
  sidebar: { background: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 },
  libTitle: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 12 },
  libList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 },
  libItem: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#374151', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' },
  libItemActive: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#111827', fontWeight: 600, background: '#f3f4f6', padding: '10px 12px', borderRadius: 8, cursor: 'pointer' },
  divider: { height: 1, background: '#f3f4f6', margin: '8px 0' },
  promoCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 },
  promoTitleRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 },
  promoTitle: { margin: 0, fontSize: 14, fontWeight: 600, color: '#111827' },
  promoDesc: { margin: '0 0 12px', fontSize: 12, color: '#6b7280', lineHeight: 1.4 },
  promoBtn: { width: '100%', padding: '8px 0', borderRadius: 999, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 13, fontWeight: 500, cursor: 'pointer' },

  // Main
  main: { padding: '32px 40px', maxWidth: 1200, margin: '0 auto', width: '100%' },
  header: { marginBottom: 32 },
  h1: { margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' },
  subtitle: { margin: 0, fontSize: 16, color: '#6b7280' },

  searchRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '14px 20px', borderRadius: 12, border: '1px solid #d1d5db', background: '#ffffff' },
  searchInput: { border: 'none', outline: 'none', fontSize: 15, flex: 1, color: '#111827', background: 'transparent' },
  searchBtn: { padding: '8px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' },

  filterSection: { marginBottom: 24 },
  filterLabel: { fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 8 },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const },
  pill: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151', display: 'flex', gap: 6, alignItems: 'center' },
  pillActive: { padding: '8px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#111827', border: '1px solid #111827', color: '#ffffff', display: 'flex', gap: 6, alignItems: 'center' },

  sectionHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 40 },
  sectionTitle: { fontSize: 20, fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: 8, margin: 0 },
  sectionSub: { fontSize: 14, color: '#6b7280', margin: 0 },

  scrollRow: { display: 'flex', gap: 16, overflowX: 'auto' as const, paddingBottom: 8, scrollbarWidth: 'none' as const },

  soonCard: { flex: '0 0 260px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' },
  soonImg: { width: '100%', height: 120, objectFit: 'cover' as const, background: '#f3f4f6' },
  soonBody: { padding: 14 },
  soonTitle: { fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#111827' },
  soonTime: { fontSize: 12, color: '#6b7280', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 4 },
  soonBadge: { fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999, display: 'inline-block' },
  soonBadgeRed: { background: '#fee2e2', color: '#991b1b' },
  soonBadgeGray: { background: '#f3f4f6', color: '#6b7280' },

  featuredGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 },
  featuredCard: { background: '#ffffff', border: '2px solid #7c5cff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 12px rgba(124,92,255,0.15)' },
  featuredImg: { width: '100%', height: 200, objectFit: 'cover' as const, background: '#f3f4f6', position: 'relative' },
  featuredBody: { padding: 20 },
  featuredTitle: { fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#111827' },
  featuredMeta: { fontSize: 13, color: '#6b7280', margin: '0 0 12px' },
  badgeRow: { display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 12 },
  badge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, background: '#f3f0ff', color: '#7c5cff', display: 'inline-flex', alignItems: 'center', gap: 4 },
  badgeGreen: { background: '#f0fdf4', color: '#10b981' },
  badgeRed: { background: '#fef2f2', color: '#dc2626' },
  featuredPriceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid #f3f4f6' },
  featuredPrice: { fontSize: 16, fontWeight: 800, color: '#111827' },
  featuredCta: { padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 16 },
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  cardImg: { width: '100%', height: 160, objectFit: 'cover' as const, background: '#f3f4f6', position: 'relative' },
  cardBody: { padding: 16, flex: 1, display: 'flex', flexDirection: 'column' },
  cardHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: 700, margin: 0, color: '#111827', lineHeight: 1.3 },
  saveBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4, flexShrink: 0 },
  cardMeta: { fontSize: 12, color: '#6b7280', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 4 },
  cardMetaRow: { marginBottom: 12 },
  socialProof: { fontSize: 12, color: '#4b5563', margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 },
  urgency: { fontSize: 12, color: '#dc2626', fontWeight: 600, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 4 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f3f4f6' },
  cardPrice: { fontSize: 15, fontWeight: 800, color: '#111827' },
  cardCta: { padding: '8px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', textDecoration: 'none' },

  soldOutBanner: { position: 'absolute', top: 10, right: 10, background: '#111827', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' },
  verifiedBadgeSmall: { position: 'absolute', top: 10, left: 10, background: '#10b981', color: '#ffffff', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 },

  soldOutActions: { display: 'flex', flexDirection: 'column' as const, gap: 6, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f3f4f6' },
  soldOutBtn: { padding: '8px 12px', borderRadius: 8, background: '#ffffff', border: '1px solid #111827', color: '#111827', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },

  empty: { background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 16, padding: 60, textAlign: 'center' as const, marginTop: 32 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' },
  emptyDesc: { fontSize: 15, color: '#6b7280', margin: '0 0 24px' },
  emptyActions: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const },
  emptyBtn: { padding: '10px 20px', borderRadius: 8, background: '#ffffff', border: '1px solid #111827', color: '#111827', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  emptyBtnPrimary: { padding: '10px 20px', borderRadius: 8, background: '#111827', border: '1px solid #111827', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },

  promoterCta: { background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 20, padding: 48, marginTop: 80, textAlign: 'center' as const, color: '#ffffff' },
  promoterTitle: { fontSize: 28, fontWeight: 800, margin: '0 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 },
  promoterDesc: { fontSize: 16, color: '#9ca3af', margin: '0 0 24px', maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' },
  promoterBtn: { padding: '14px 32px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 25px rgba(124,92,255,0.3)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 },

  countLabel: { fontSize: 14, color: '#6b7280', fontWeight: 500 },
};

export default function DiscoverEventsPage() {

  // ============ DATA STATE ============
  const [FEATURED_EVENTS, setFeaturedEvents] = useState<DiscoverEvent[]>(FALLBACK_FEATURED);
  const [ALL_EVENTS, setAllEvents] = useState<DiscoverEvent[]>(FALLBACK_ALL);
  const [dataSource, setDataSource] = useState<"loading" | "db" | "fallback">("loading");
  const [userCity, setUserCity] = useState<string | null>(null);

  // ============ FETCH FROM API ============
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [featRes, allRes] = await Promise.all([
          fetch("/api/events/featured").then(r => r.ok ? r.json() : { events: [] }).catch(() => ({ events: [] })),
          fetch("/api/events/all?sort=popular").then(r => r.ok ? r.json() : { events: [] }).catch(() => ({ events: [] })),
        ]);
        if (cancelled) return;
        if (featRes.events?.length > 0) setFeaturedEvents(featRes.events);
        if (allRes.events?.length > 0) setAllEvents(allRes.events);
        setDataSource(featRes.events?.length || allRes.events?.length ? "db" : "fallback");
      } catch {
        if (!cancelled) setDataSource("fallback");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ============ NEAR ME ============
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        if (lat > 51.2 && lat < 51.7) setUserCity("London");
        else if (lat > 53.3 && lat < 53.6) setUserCity("Manchester");
        else if (lat > 52.3 && lat < 52.7) setUserCity("Birmingham");
      },
      () => {}
    );
  }, []);

  // ============ SAVE SEARCH ============
  async function saveSearch() {
    try {
      const res = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: userCity, notify: true }),
      });
      if (res.ok) alert("Search saved - you'll get email alerts");
      else alert("Sign in to save searches");
    } catch {
      alert("Could not save - try again");
    }
  }
  const [city, setCity] = useState('All');
  const [genre, setGenre] = useState('All');
  const [when, setWhen] = useState('All');
  const [price, setPrice] = useState('All');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filtered = EVENTS.filter(e => {
    if (city !== 'All' && e.city !== city) return false;
    if (price === 'Free' && e.price > 0) return false;
    if (price === 'Under £20' && e.price >= 20) return false;
    if (price === '£20-£50' && (e.price < 20 || e.price > 50)) return false;
    if (price === '£50+' && e.price < 50) return false;
    return true;
  });

  return (
    <div style={s.layout}>
      
      {/* ========== LEFT SIDEBAR ========== */}
      <aside style={s.sidebar}>
        <div>
          <div style={s.libTitle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            Your Library
          </div>
          <ul style={s.libList}>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Home
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              Artists
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search
            </li>
            <div style={s.divider}></div>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>
              My Tickets
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Friends
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Messages
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              Following
            </li>
            <div style={s.divider}></div>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              Network
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Opportunities
            </li>
            <li style={s.libItem}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Dashboard
            </li>
          </ul>
        </div>

        <div style={s.promoCard}>
          <div style={s.promoTitleRow}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            <h4 style={s.promoTitle}>Find events near you</h4>
          </div>
          <p style={s.promoDesc}>Browse by city, genre, and date.</p>
          <button style={s.promoBtn}>Explore</button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main style={s.main}>

        <div style={s.header}>
          <h1 style={s.h1}>Discover events</h1>
          <p style={s.subtitle}>Find your next live experience. Filter by date, city, genre, and price.</p>
        </div>

        {/* Search */}
        <div style={s.searchRow}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input style={s.searchInput} placeholder="Search by event, artist, or venue..." />
          <button style={s.searchBtn}>Search</button>
        </div>

        {/* Filters */}
        <div style={s.filterSection}>
          <div style={s.filterLabel}>When</div>
          <div style={s.pillRow}>
            {WHEN.map(w => (
              <button key={w} onClick={() => setWhen(w)} style={when === w ? s.pillActive : s.pill}>{w}</button>
            ))}
            <button style={s.pill}>
              <CalendarIcon width={14} height={14} /> Pick a date
            </button>
          </div>
        </div>

        <div style={s.filterSection}>
          <div style={s.filterLabel}>Cities</div>
          <div style={s.pillRow}>
            {CITIES.map(c => (
              <button key={c} onClick={() => setCity(c)} style={city === c ? s.pillActive : s.pill}>{c}</button>
            ))}
          </div>
        </div>

        <div style={s.filterSection}>
          <div style={s.filterLabel}>Genres</div>
          <div style={s.pillRow}>
            {GENRES.map(g => (
              <button key={g} onClick={() => setGenre(g)} style={genre === g ? s.pillActive : s.pill}>{g}</button>
            ))}
          </div>
        </div>

        <div style={s.filterSection}>
          <div style={s.filterLabel}>Price & Sort</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 12 }}>
            <div style={s.pillRow}>
              {PRICES.map(p => (
                <button key={p} onClick={() => setPrice(p)} style={price === p ? s.pillActive : s.pill}>{p}</button>
              ))}
            </div>
            <select style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 13, color: '#374151', cursor: 'pointer' }}>
              <option>Sort: Popular</option>
              <option>Sort: Date</option>
              <option>Sort: Price (low to high)</option>
              <option>Sort: Newest</option>
            </select>
          </div>
        </div>

        {/* Starting Soon */}
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>
            <ClockIcon width={20} height={20} /> Starting soon
          </h2>
          <p style={s.sectionSub}>Next 4 hours</p>
        </div>
        <div style={s.scrollRow}>
          {STARTING_SOON.map(item => (
            <div key={item.id} style={s.soonCard}>
              <img src={item.banner} alt={item.title} style={s.soonImg} />
              <div style={s.soonBody}>
                <h3 style={s.soonTitle}>{item.title}</h3>
                <div style={s.soonTime}>
                  <ClockIcon width={12} height={12} /> Tonight · {item.time}
                </div>
                {item.ticketsLeft > 0 && item.ticketsLeft < 10 ? (
                  <span style={{ ...s.soonBadge, ...s.soonBadgeRed }}>{item.ticketsLeft} left</span>
                ) : item.ticketsLeft === 0 ? (
                  <span style={{ ...s.soonBadge, ...s.soonBadgeGray }}>Sold out</span>
                ) : (
                  <span style={{ ...s.soonBadge, ...s.soonBadgeGray }}>Available</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Featured */}
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>
            <FlameIcon width={20} height={20} /> Featured this week
          </h2>
          <p style={s.sectionSub}>Premium events</p>
        </div>
        <div style={s.featuredGrid}>
          {FEATURED_EVENTS.map(f => (
            <div key={f.id} style={s.featuredCard}>
              <div style={{ position: 'relative' }}>
                <Link href={`/events/${f.id}`}>
                  <img src={f.banner} alt={f.title} style={s.featuredImg} />
                </Link>
                {f.verified && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(16,185,129,0.95)', color: '#ffffff', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    VERIFIED
                  </div>
                )}
                {f.membershipUrl && (
                  <Link
                    href={f.membershipUrl}
                    style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(251,191,36,0.95)', color: '#78350f', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}
                  >
                    Join Club
                  </Link>
                )}
              </div>
              <div style={s.featuredBody}>
                <h3 style={s.featuredTitle}>{f.title}</h3>
                <p style={s.featuredMeta}>
                  {f.date} · {f.time} ·{' '}
                  <Link
                    href={`/venues/${f.venueSlug || (f.venue || '').toLowerCase().replace(/\s+/g, '-')}`}
                    style={{ color: 'inherit', textDecoration: 'underline' }}
                  >
                    {f.venue}
                  </Link>
                  {f.city ? `, ${f.city}` : ''}
                </p>
                {f.artists && f.artists.length > 0 && (
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <span>Feat.</span>
                    {f.artists.slice(0, 3).map((a, i) => (
                      <Link
                        key={a.slug}
                        href={`/artist/${a.slug}`}
                        style={{ color: 'inherit', textDecoration: 'underline' }}
                      >
                        {a.name}{i < Math.min(2, f.artists.length - 1) ? ',' : ''}
                      </Link>
                    ))}
                  </p>
                )}
                {f.promoter && (
                  <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0' }}>
                    Presenter:{' '}
                    <Link
                      href={`/promoters/${f.promoter.slug}`}
                      style={{ color: 'inherit', textDecoration: 'underline' }}
                    >
                      {f.promoter.name}
                    </Link>
                  </p>
                )}
                <div style={s.badgeRow}>
                  <span style={{ ...s.badge, ...s.badgeGreen }}>
                    <UsersIcon width={12} height={12} /> {f.friendsGoing} going
                  </span>
                  {f.urgent && (
                    <span style={{ ...s.badge, ...s.badgeRed }}>
                      <FlameIcon width={12} height={12} /> {f.urgent}
                    </span>
                  )}
                </div>
                <div style={s.featuredPriceRow}>
                  <span style={s.featuredPrice}>From £{f.price.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <Link
                    href={`/events/${f.id}`}
                    style={{ ...s.featuredCta, flex: 1, display: 'block', textAlign: 'center' }}
                  >
                    Get Tickets
                  </Link>
                  {f.artists && f.artists.length > 0 && (
                    <Link
                      href={`/book/artist/${f.artists[0].slug}`}
                      style={{ flex: 1, display: 'block', textAlign: 'center', padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#111827', textDecoration: 'none' }}
                    >
                      Book artist
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div style={s.sectionHead}>
          <h2 style={s.sectionTitle}>All events</h2>
          <p style={s.countLabel}>{filtered.length} events found</p>
        </div>

        {filtered.length === 0 ? (
          <div style={s.empty}>
            <h3 style={s.emptyTitle}>No events match your filters</h3>
            <p style={s.emptyDesc}>Try adjusting your city, genre, or price filters.</p>
            <div style={s.emptyActions}>
              <button style={s.emptyBtn} onClick={() => { setCity('All'); setGenre('All'); setPrice('All'); setWhen('All'); }}>
                Clear all filters
              </button>
              <button style={s.emptyBtnPrimary}>Browse all events</button>
            </div>
          </div>
        ) : (
          <div style={s.grid}>
            {filtered.map(e => (
              <div key={e.id} style={s.card}>
                <div style={{ position: 'relative' }}>
                  <Link href={`/events/${e.id}`}><img src={e.banner} alt={e.title} style={s.cardImg} /></Link>
                  {e.soldOut && <div style={s.soldOutBanner}>SOLD OUT</div>}
                  {e.verified && !e.soldOut && (
                    <div style={s.verifiedBadgeSmall}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      VERIFIED
                    </div>
                  )}
                </div>
                <div style={s.cardBody}>
                  <div style={s.cardHeaderRow}>
                    <h3 style={s.cardTitle}>{e.title}</h3>
                    <button style={s.saveBtn} onClick={() => toggleSave(e.id)} title="Save event">
                      <BookmarkIcon width={18} height={18} />
                    </button>
                  </div>
                  <div style={s.cardMetaRow}>
                    <p style={s.cardMeta}><CalendarIcon width={12} height={12} /> {e.date} · {e.time}</p>
                    <p style={s.cardMeta}><MapPinIcon width={12} height={12} /> {e.venue}, {e.city}</p>
                  </div>
                  {e.friendsCount > 0 && (
                    <p style={s.socialProof}>
                      <UsersIcon width={12} height={12} />
                      {e.friends.length > 0 ? `${e.friends[0]}${e.friends.length > 1 ? `, ${e.friends[1]}` : ''} + ${e.friendsCount - e.friends.length} going` : `${e.friendsCount} people going`}
                    </p>
                  )}
                  {e.ticketsLeft !== null && e.ticketsLeft > 0 && e.ticketsLeft < 20 && (
                    <p style={s.urgency}>
                      <FlameIcon width={12} height={12} /> Only {e.ticketsLeft} tickets left
                    </p>
                  )}
                  {e.soldOut ? (
                    <div style={s.soldOutActions}>
                      <button style={s.soldOutBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        Notify me if tickets return
                      </button>
                      <button style={s.soldOutBtn}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                        Join resale waitlist
                      </button>
                    </div>
                  ) : (
                    <div style={s.cardFooter}>
                      <span style={s.cardPrice}>From £{e.price.toFixed(2)}</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/events/${e.id}`} style={{ ...s.cardCta, display: 'block', textAlign: 'center' }}>Get Tickets →</Link>
                        {e.artists && e.artists.length > 0 && (
                          <Link href={`/book/artist/${e.artists[0].slug}`} style={{ padding: '10px 12px', border: '1px solid #d1d5db', color: '#111827', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            Book artist
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Promoter CTA */}
        <div style={s.promoterCta}>
          <h2 style={s.promoterTitle}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20"></path><path d="M4 20V8l8-4 8 4v12"></path><path d="M9 20v-6h6v6"></path></svg>
            Running an event?
          </h2>
          <p style={s.promoterDesc}>
            Sell tickets on GRID. Reach thousands of artists and fans. From £25 to feature your event.
          </p>
          <Link href="/post-opportunity" style={s.promoterBtn}>
            List Your Event
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </Link>
        </div>

      </main>
    </div>
  );
}

