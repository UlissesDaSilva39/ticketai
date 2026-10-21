'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PaymentAgreement from '@/components/checkout/PaymentAgreement';
import type { PaymentPlan } from '@/components/checkout/PaymentAgreement';
import {
  CalendarIcon, MapPinIcon, UsersIcon, DollarIcon, TagIcon,
  MusicIcon, GiftIcon, XIcon, TrophyIcon, ClockIcon, PlayIcon, ChartIcon, BookmarkIcon, ShareIcon
} from '@/components/people/Icons';

// ============ MOCK DATA ============
const EVENT_DB = {
  '1': {
    id: '1', title: 'Analog Dreams Live', venue: 'Test - First Venue', city: 'London',
    date: 'Sat, 24 Oct 2026', time: '18:16 - 23:00', genre: 'House / Techno', capacity: 300,
    fromPrice: 16, banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop',
    verified: true, rating: 4.8, reviewCount: 89,
    venueInfo: 'A 300-capacity warehouse in Shoreditch. No dress code. Nearest station: Old Street.',
    friendsGoing: ['Amelia G', 'Sam O'],
    friendsCount: 12,
    lineup: [
      { name: 'Analog Dreams', role: 'Headliner', image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', followers: '150k' },
      { name: 'DJ Poxy', role: 'Support', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop', followers: '45k' },
      { name: 'Alex Morgan', role: 'Opening', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=200&auto=format&fit=crop', followers: '12k' }
    ]
  },
  '2': {
    id: '2', title: 'Alice Waves Live', venue: 'The Blue Note', city: 'London',
    date: 'Tue, 27 Oct 2026', time: '17:16 - 23:00', genre: 'Jazz / Soul', capacity: 150,
    fromPrice: 14, banner: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop',
    verified: true, rating: 4.9, reviewCount: 214,
    venueInfo: 'Intimate jazz club in Soho. Smart casual dress code. Table service available.',
    friendsGoing: ['Maya C', 'Lily M'],
    friendsCount: 6,
    lineup: [
      { name: 'Alice Waves', role: 'Headliner', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=200&auto=format&fit=crop', followers: '85k' },
      { name: 'The Jazz Trio', role: 'Support', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop', followers: '8k' }
    ]
  },
  '7': {
    id: '7', title: 'Warehouse Sessions 12', venue: 'Basement 44', city: 'London',
    date: 'Sat, 15 Nov 2026', time: '22:00 - 06:00', genre: 'Techno / House', capacity: 300,
    fromPrice: 25, banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=1600&auto=format&fit=crop',
    verified: true, rating: 4.9, reviewCount: 128,
    venueInfo: 'Underground club. 300 capacity. Nearest station: Hackney Central. No photos allowed.',
    friendsGoing: ['Sam O', 'Maya C'],
    friendsCount: 12,
    lineup: [
      { name: 'Basement Collective', role: 'Headliner', image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=200&auto=format&fit=crop', followers: '230k' },
      { name: 'Analog Dreams', role: 'Support', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=200&auto=format&fit=crop', followers: '150k' }
    ]
  }
};

const FALLBACK_EVENT = EVENT_DB['1'];

const UPSELLS = [
  { id: 'tshirt', icon: GiftIcon, name: 'Tour T-Shirt 2026', price: 25, desc: 'Limited edition. Only available online.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=100&auto=format&fit=crop' },
  { id: 'vipupgrade', icon: TrophyIcon, name: 'VIP Early Entry', price: 15, desc: 'Skip the queue. Get in at 21:30.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=100&auto=format&fit=crop' },
];

const RESALE_TICKETS = [
  { id: 'r1', tier: 'General Admission', price: 27.50, seller: '@djpoxyfan', note: 'Verified resale · Instant transfer' },
  { id: 'r2', tier: 'General Admission', price: 25.00, seller: '@technonation', note: 'Verified resale · Instant transfer' },
  { id: 'r3', tier: 'VIP Soundcheck', price: 49.50, seller: '@warehousefan', note: 'Verified resale · Instant transfer' },
];

const FAQS = [
  { q: 'Can I get a refund?', a: 'Tickets are non-refundable, but you can resell them to another fan via GRID Resale (capped at face value +10%).' },
  { q: 'How does resale work?', a: 'If you can no longer attend, list your ticket in GRID Resale. We verify it, cap the price, and transfer it instantly to the buyer.' },
  { q: 'Are resale tickets legitimate?', a: 'Yes. All GRID resale tickets are verified, transferred instantly, and invalidated on the original holder\'s device.' },
  { q: 'Can I pay in instalments?', a: 'Yes — on the 3x plan, you pay a 30% deposit today and the rest over 2 monthly payments. Interest-free. Your ticket is held until fully paid.' },
];

// ============ STYLES ============
const s: Record<string, React.CSSProperties> = {
  page: { background: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', color: '#111827' },

  hero: { position: 'relative', height: 480, display: 'flex', alignItems: 'flex-end', color: '#ffffff' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)', zIndex: 1 },
  heroInner: { maxWidth: 1100, margin: '0 auto', padding: '32px 24px', width: '100%', position: 'relative', zIndex: 2 },
  verifiedBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 16 },
  
  titleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' as const },
  eventTitle: { fontSize: 52, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.1, letterSpacing: '-0.02em' },
  shareBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)' },
  
  eventVenue: { fontSize: 20, color: '#d1d5db', margin: '0 0 24px' },
  metaRow: { display: 'flex', gap: 24, flexWrap: 'wrap' as const, fontSize: 14, color: '#e5e7eb', marginBottom: 32 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 6 },

  ctaRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 640 },
  btnPrimary: { padding: '18px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', textAlign: 'left' as const, boxShadow: '0 10px 25px rgba(124,92,255,0.4)' },
  btnSecondary: { padding: '18px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: '#ffffff', fontSize: 16, fontWeight: 700, cursor: 'pointer', textAlign: 'left' as const, backdropFilter: 'blur(10px)' },
  btnLabel: { display: 'block', fontSize: 11, opacity: 0.8, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' as const, fontWeight: 600 },
  btnTitle: { display: 'block', fontSize: 20, fontWeight: 800 },

  trustRow: { display: 'flex', gap: 20, flexWrap: 'wrap' as const, fontSize: 13, color: '#d1d5db', marginTop: 16 },
  trustItem: { display: 'flex', alignItems: 'center', gap: 6 },
  greenCheck: { color: '#10b981' },

  container: { maxWidth: 1100, margin: '0 auto', padding: '0 24px' },
  section: { padding: '64px 0', borderBottom: '1px solid #e5e7eb' },
  sectionTitle: { fontSize: 28, fontWeight: 800, margin: '0 0 24px' },

  sellingFastBanner: { background: 'linear-gradient(90deg, #fef2f2, #fef3c7)', borderTop: '1px solid #fca5a5', borderBottom: '1px solid #f59e0b', padding: '14px 24px', textAlign: 'center' as const, fontSize: 15, fontWeight: 700, color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },

  trustBadgeStrip: { display: 'flex', justifyContent: 'center', gap: 32, padding: '24px 0', background: '#f9fafb', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap' as const },
  trustBadge: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600, color: '#4b5563' },

  lineupGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 },
  artistCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 12 },
  artistImg: { width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' as const },
  artistName: { fontSize: 16, fontWeight: 700, margin: 0 },
  artistRole: { fontSize: 11, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.05em', fontWeight: 700, margin: '4px 0' },
  artistFollowers: { fontSize: 12, color: '#10b981', fontWeight: 600, margin: '4px 0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 },
  playBtn: { width: '100%', padding: '8px 0', borderRadius: 6, background: '#e5e7eb', border: 'none', fontSize: 12, fontWeight: 600, color: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', marginBottom: 8 },
  artistBtnRow: { display: 'flex', gap: 8, width: '100%' },
  joinClubBtn: { flex: 1, padding: '8px 0', borderRadius: 6, background: '#111827', color: '#ffffff', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' },
  stageVipBtn: { flex: 1, padding: '8px 0', borderRadius: 6, background: '#ffffff', border: '1px solid #d1d5db', color: '#111827', fontSize: 12, fontWeight: 700, cursor: 'pointer' },

  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 },
  friendsRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
  avatarStack: { display: 'flex' },
  avatarSmall: { width: 40, height: 40, borderRadius: '50%', border: '2px solid #ffffff', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#6b7280', marginLeft: -10 },
  friendsText: { fontSize: 15, color: '#374151', fontWeight: 500 },
  venueBox: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 },
  venueText: { fontSize: 15, color: '#4b5563', lineHeight: 1.6, margin: '0 0 16px' },
  mapBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', textDecoration: 'none', fontSize: 14, fontWeight: 600 },

  reviewCard: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  stars: { fontSize: 20, color: '#f59e0b' },
  ratingNum: { fontSize: 18, fontWeight: 800 },
  reviewText: { fontSize: 15, color: '#4b5563', lineHeight: 1.6, margin: '0 0 12px' },
  reviewAuthor: { fontSize: 13, color: '#6b7280' },

  faqList: { maxWidth: 800 },
  faqItem: { borderBottom: '1px solid #e5e7eb', padding: '20px 0' },
  faqQuestion: { fontSize: 16, fontWeight: 600, margin: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  faqAnswer: { fontSize: 14, color: '#4b5563', lineHeight: 1.6, marginTop: 12, marginBottom: 0 },

  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24 },
  modal: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 540, maxHeight: '90vh', overflowY: 'auto' as const, position: 'relative' },
  modalTitle: { margin: '0 0 8px', fontSize: 22, fontWeight: 800 },
  modalSub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 },

  tierGroup: { marginBottom: 24 },
  tierGroupTitle: { fontSize: 13, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 6 },
  
  tierCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12 },
  tierCardActive: { border: '2px solid #111827', borderRadius: 12, padding: 16, marginBottom: 12, background: '#f9fafb' },
  tierCardSold: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12, opacity: 0.5 },
  tierHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  tierName: { fontSize: 13, fontWeight: 700, color: '#111827', letterSpacing: '0.02em' },
  tierPrice: { fontSize: 20, fontWeight: 800, color: '#111827' },
  tierDesc: { fontSize: 12, color: '#6b7280', margin: '0 0 12px' },
  tierDescScarcity: { fontSize: 12, color: '#dc2626', margin: '0 0 12px', fontWeight: 600 },
  qtyControl: { display: 'flex', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: '50%', border: '1px solid #d1d5db', background: '#ffffff', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'grid', placeItems: 'center' },
  qtyValue: { fontSize: 16, fontWeight: 700, minWidth: 30, textAlign: 'center' as const },

  summary: { borderTop: '1px solid #e5e7eb', paddingTop: 16, marginTop: 16, fontSize: 14 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#4b5563' },
  summaryTotal: { display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, marginTop: 12, paddingTop: 12, borderTop: '2px solid #111827' },

  checkoutBtn: { width: '100%', padding: '16px 0', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 20 },

  paymentOption: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 10, cursor: 'pointer', background: '#ffffff' },
  paymentOptionActive: { border: '2px solid #7c5cff', borderRadius: 12, padding: 16, marginBottom: 10, cursor: 'pointer', background: '#faf9ff' },

  upsellCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' },
  upsellImg: { width: 64, height: 64, borderRadius: 8, objectFit: 'cover' as const, flexShrink: 0 },
  upsellBody: { flex: 1 },
  upsellName: { fontSize: 15, fontWeight: 700, margin: '0 0 4px' },
  upsellDesc: { fontSize: 12, color: '#6b7280', margin: '0 0 8px' },
  upsellPrice: { fontSize: 14, fontWeight: 700 },
  addBtn: { padding: '8px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' },

  promoLink: { background: 'none', border: 'none', color: '#7c5cff', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', padding: 0, marginTop: 12 },
  promoInputRow: { display: 'flex', gap: 8, marginTop: 12 },
  promoInput: { flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, outline: 'none' },
  promoApplyBtn: { padding: '10px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' },

  // Club Tiers
  clubTier: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12 },
  clubTierFeatured: { border: '2px solid #7c5cff', borderRadius: 12, padding: 16, marginBottom: 12, background: '#faf9ff' },
  clubTierVIP: { border: '1px solid #111827', borderRadius: 12, padding: 16, marginBottom: 12, background: '#111827', color: '#ffffff' },

  resaleNotice: { background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13, color: '#1e40af' },
  resaleCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12 },
  resaleHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  resaleTier: { fontSize: 14, fontWeight: 700 },
  resalePrice: { fontSize: 16, fontWeight: 800, color: '#111827' },
  resaleCapped: { fontSize: 11, color: '#6b7280', fontWeight: 500, marginLeft: 6 },
  resaleSeller: { fontSize: 13, color: '#4b5563', marginBottom: 4 },
  resaleNote: { fontSize: 12, color: '#10b981', marginBottom: 12 },
  resaleBtn: { width: '100%', padding: '10px 0', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
};

export default function EventPage() {
  const params = useParams();
  const id = params?.id as string;
  const EVENT = EVENT_DB[id as keyof typeof EVENT_DB] || FALLBACK_EVENT;

  // Main modals
  const [modal, setModal] = useState<'none' | 'checkout' | 'resale' | 'success'>('none');
  
  // Club modals (separate from main flow)
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [clubModal, setClubModal] = useState<'none' | 'buy' | 'success'>('none');
  const [clubTier, setClubTier] = useState<string>('superfan');
  
  // Existing state
  const [quantities, setQuantities] = useState<Record<string, number>>({ ga: 1 });
  const [addedUpsells, setAddedUpsells] = useState<string[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [paymentPlan, setPaymentPlan] = useState<PaymentPlan>('full');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [shared, setShared] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [clubMember, setClubMember] = useState<string | null>(null); // tracks who you joined

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const TIERS = [
    {
      group: 'Standard Access',
      tiers: [
        { id: 'early', name: 'EARLY BIRD', price: Math.floor(EVENT.fromPrice * 0.8), remaining: 0, desc: 'Sold out', soldOut: true },
        { id: 'ga', name: 'GENERAL ADMISSION', price: EVENT.fromPrice, remaining: 12, desc: 'Only 12 left at this price', soldOut: false },
      ],
    },
    {
      group: 'VIP Experiences',
      tiers: [
        { id: 'vip', name: 'VIP SOUNDCHECK', price: EVENT.fromPrice + 20, remaining: 8, desc: 'Early entry + signed poster', soldOut: false },
      ],
    },
  ];

  const flatTiers = TIERS.flatMap(g => g.tiers);
  const ticketTotal = Object.entries(quantities).reduce((sum, [tierId, qty]) => {
    const tier = flatTiers.find(t => t.id === tierId);
    return sum + (tier ? tier.price * qty : 0);
  }, 0);
  const upsellTotal = addedUpsells.reduce((sum, upsellId) => {
    const upsell = UPSELLS.find(u => u.id === upsellId);
    return sum + (upsell ? upsell.price : 0);
  }, 0);
  const platformFee = Math.round(ticketTotal * 0.05 * 100) / 100;
  const grandTotalBeforeDiscount = ticketTotal + upsellTotal + platformFee;
  const discount = promoApplied ? Math.round(grandTotalBeforeDiscount * 0.1 * 100) / 100 : 0;
  const grandTotal = grandTotalBeforeDiscount - discount;

  const totalRemaining = flatTiers.reduce((sum, t) => sum + (t.soldOut ? 0 : t.remaining), 0);
  const totalCapacity = EVENT.capacity;
  const soldPercentage = Math.round(((totalCapacity - totalRemaining) / totalCapacity) * 100);
  const sellingFast = soldPercentage >= 70;

  const updateQty = (tierId: string, delta: number) => {
    setQuantities(prev => {
      const newQty = Math.max(0, (prev[tierId] || 0) + delta);
      return { ...prev, [tierId]: newQty };
    });
  };

  const toggleUpsell = (uid: string) => {
    setAddedUpsells(prev => prev.includes(uid) ? prev.filter(x => x !== uid) : [...prev, uid]);
  };

  const canCheckout = paymentPlan === 'full' || (paymentPlan === '3x' && agreedToTerms);

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: EVENT.title, url });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  const openClubModal = (artist: any, tier: string) => {
    setSelectedArtist(artist);
    setClubTier(tier);
    setClubModal('buy');
  };

  const handleClubPurchase = () => {
    setClubModal('success');
    if (selectedArtist) {
      setClubMember(selectedArtist.name);
    }
  };

  const closeClubModal = () => {
    setClubModal('none');
    setSelectedArtist(null);
  };

  return (
    <main style={s.page}>
      <section style={{ ...s.hero, backgroundImage: `url('${EVENT.banner}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={s.heroOverlay} />
        <div style={s.heroInner}>
          <div style={s.verifiedBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            VERIFIED EVENT
          </div>
          <div style={s.titleRow}>
            <h1 style={s.eventTitle}>{EVENT.title}</h1>
            {isMounted && (
              <button onClick={handleShare} style={s.shareBtn}>
                <ShareIcon width={14} height={14} /> {shared ? 'Link copied!' : 'Share'}
              </button>
            )}
          </div>
          <p style={s.eventVenue}>{EVENT.venue} · {EVENT.city}</p>

          <div style={s.metaRow}>
            <span style={s.metaItem}><CalendarIcon width={16} height={16} /> {EVENT.date} · {EVENT.time}</span>
            <span style={s.metaItem}><MusicIcon width={16} height={16} /> {EVENT.genre}</span>
            <span style={s.metaItem}><UsersIcon width={16} height={16} /> {EVENT.capacity} capacity</span>
            <span style={s.metaItem}><DollarIcon width={16} height={16} /> From £{EVENT.fromPrice} all-in</span>
          </div>

          <div style={s.ctaRow}>
            <button onClick={() => setModal('checkout')} style={s.btnPrimary}>
              <span style={s.btnLabel}>Primary Tickets</span>
              <span style={s.btnTitle}>BUY TICKETS</span>
            </button>
            <button onClick={() => setModal('resale')} style={s.btnSecondary}>
              <span style={s.btnLabel}>Resale Marketplace</span>
              <span style={s.btnTitle}>{RESALE_TICKETS.length} Available</span>
            </button>
          </div>

          <div style={s.trustRow}>
            <span style={s.trustItem}><span style={s.greenCheck}>✓</span> Secure Checkout</span>
            <span style={s.trustItem}><span style={s.greenCheck}>✓</span> Verified Tickets</span>
            <span style={s.trustItem}><span style={s.greenCheck}>✓</span> Fan-to-Fan Resale</span>
          </div>
        </div>
      </section>

      {sellingFast && (
        <div style={s.sellingFastBanner}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>
          SELLING FAST — {soldPercentage}% sold. Final tickets remaining.
        </div>
      )}

      <div style={s.trustBadgeStrip}>
        <div style={s.trustBadge}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Secure Checkout by Stripe
        </div>
        <div style={s.trustBadge}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Instant Ticket Transfer
        </div>
        <div style={s.trustBadge}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          100% Verified Resale
        </div>
      </div>

      <section style={s.section}>
        <div style={s.container}>
          <div style={s.infoGrid}>
            <div>
              <h2 style={s.sectionTitle}>Lineup</h2>
              <div style={s.lineupGrid}>
                {EVENT.lineup.map((artist, i) => (
                  <div key={i} style={s.artistCard}>
                    <img src={artist.image} alt={artist.name} style={s.artistImg} />
                    <div style={{ textAlign: 'center' }}>
                      <p style={s.artistName}>{artist.name}</p>
                      <p style={s.artistRole}>{artist.role}</p>
                      <p style={s.artistFollowers}>
                        <UsersIcon width={12} height={12} /> {artist.followers} followers
                      </p>
                    </div>
                    <button style={s.playBtn}>
                      <PlayIcon width={12} height={12} /> Play top track
                    </button>
                    {clubMember === artist.name ? (
                      <div style={{ width: '100%', padding: '8px 0', borderRadius: 6, background: '#f0fdf4', border: '1px solid #10b981', color: '#065f46', fontSize: 12, fontWeight: 700, textAlign: 'center' }}>
                        ⭐ Superfan Member
                      </div>
                    ) : (
                      <div style={s.artistBtnRow}>
                        <button onClick={() => openClubModal(artist, 'superfan')} style={s.joinClubBtn}>
                          Join Club
                        </button>
                        <button onClick={() => openClubModal(artist, 'stage')} style={s.stageVipBtn}>
                          Stage VIP
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 style={s.sectionTitle}>Venue Details</h2>
              <div style={s.venueBox}>
                <p style={s.venueText}>{EVENT.venueInfo}</p>
                <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={s.mapBtn}>
                  <MapPinIcon width={16} height={16} /> Get Directions
                </a>
              </div>

              <div style={{ marginTop: 32 }}>
                <h2 style={s.sectionTitle}>Who's Going?</h2>
                <div style={s.friendsRow}>
                  <div style={s.avatarStack}>
                    {EVENT.friendsGoing.map((f, i) => (
                      <div key={i} style={{ ...s.avatarSmall, marginLeft: i === 0 ? 0 : -10 }}>
                        {f.substring(0, 2).toUpperCase()}
                      </div>
                    ))}
                    <div style={{ ...s.avatarSmall, marginLeft: -10, background: '#111827', color: '#ffffff' }}>
                      +{EVENT.friendsCount - EVENT.friendsGoing.length}
                    </div>
                  </div>
                  <span style={s.friendsText}>
                    {EVENT.friendsGoing.join(', ')} and {EVENT.friendsCount - EVENT.friendsGoing.length} others are going
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>What attendees say</h2>
          <div style={s.reviewCard}>
            <div style={s.ratingRow}>
              <span style={s.stars}>★★★★★</span>
              <span style={s.ratingNum}>{EVENT.rating} / 5</span>
              <span style={{ color: '#6b7280', fontSize: 14 }}>({EVENT.reviewCount} reviews)</span>
            </div>
            <p style={s.reviewText}>"Absolute banger of a night. Sound system was incredible. Already bought my resale ticket for the next one."</p>
            <p style={s.reviewAuthor}>— @amelia.grant · Verified attendee</p>
          </div>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.container}>
          <h2 style={s.sectionTitle}>Questions about this event</h2>
          <div style={s.faqList}>
            {FAQS.map((item, i) => (
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

      {/* ===== CLUB MODAL: BUY ===== */}
      {clubModal === 'buy' && selectedArtist && (
        <div style={s.overlay} onClick={closeClubModal}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={closeClubModal}>
              <XIcon width={20} height={20} />
            </button>
            <h2 style={s.modalTitle}>Join the {selectedArtist.name} Club</h2>
            <p style={s.modalSub}>Get exclusive access, early tickets, and stage VIP experiences.</p>

            {/* Free Tier */}
            <div style={s.clubTier}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Supporter (Free)</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>FREE</span>
              </div>
              <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 12 }}>
                ✓ Follow {selectedArtist.name} on GRID<br/>
                ✓ Get notified of new events
              </div>
              <button
                onClick={() => handleClubPurchase()}
                style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: '#f3f4f6', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Follow for Free
              </button>
            </div>

            {/* Paid Tier */}
            <div style={s.clubTierFeatured}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Superfan Club</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#7c5cff' }}>£5/mo</span>
              </div>
              <div style={{ fontSize: 12, color: '#4b5563', marginBottom: 12 }}>
                ✓ Early ticket access (24h before public)<br/>
                ✓ Exclusive unreleased mixes<br/>
                ✓ 10% off merch<br/>
                ✓ Monthly Q&A with {selectedArtist.name}
              </div>
              <button
                onClick={() => handleClubPurchase()}
                style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Join Club — £5/mo
              </button>
            </div>

            {/* Stage VIP */}
            <div style={s.clubTierVIP}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Stage Access (One-time)</span>
                <span style={{ fontSize: 16, fontWeight: 800 }}>£75</span>
              </div>
              <div style={{ fontSize: 12, color: '#d1d5db', marginBottom: 12 }}>
                ✓ Watch the set from the side of the stage<br/>
                ✓ Meet {selectedArtist.name} after the show<br/>
                ✓ Signed setlist + photo
              </div>
              <button
                onClick={() => handleClubPurchase()}
                style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: '#ffffff', color: '#111827', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Buy Stage Access — £75
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== CLUB MODAL: SUCCESS ===== */}
      {clubModal === 'success' && selectedArtist && (
        <div style={s.overlay} onClick={closeClubModal}>
          <div style={{ ...s.modal, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⭐</div>
            <h2 style={s.modalTitle}>You're in!</h2>
            <p style={s.modalSub}>
              Welcome to the {selectedArtist.name} Club.<br />
              You now have early access to tickets and exclusive mixes.
            </p>
            <button
              onClick={closeClubModal}
              style={{ padding: '14px 32px', borderRadius: 12, background: '#111827', color: '#ffffff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 15 }}
            >
              Back to Event
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL: CHECKOUT ===== */}
      {modal === 'checkout' && (
        <div style={s.overlay} onClick={() => setModal('none')}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setModal('none')}>
              <XIcon width={20} height={20} />
            </button>
            <h2 style={s.modalTitle}>Select your tickets</h2>
            <p style={s.modalSub}>{EVENT.title} · {EVENT.date}</p>

            {TIERS.map((group, gi) => (
              <div key={gi} style={s.tierGroup}>
                <div style={s.tierGroupTitle}>
                  <TagIcon width={14} height={14} /> {group.group}
                </div>
                {group.tiers.map(tier => (
                  <div key={tier.id} style={tier.soldOut ? s.tierCardSold : (quantities[tier.id] > 0 ? s.tierCardActive : s.tierCard)}>
                    <div style={s.tierHeader}>
                      <span style={s.tierName}>{tier.name}</span>
                      <span style={s.tierPrice}>£{tier.price}</span>
                    </div>
                    <p style={tier.soldOut ? s.tierDesc : (tier.remaining < 20 ? s.tierDescScarcity : s.tierDesc)}>
                      {tier.soldOut ? 'Sold out' : `🔥 ${tier.desc}`}
                    </p>
                    {!tier.soldOut && (
                      <div style={s.qtyControl}>
                        <button style={s.qtyBtn} onClick={() => updateQty(tier.id, -1)}>−</button>
                        <span style={s.qtyValue}>{quantities[tier.id] || 0}</span>
                        <button style={s.qtyBtn} onClick={() => updateQty(tier.id, 1)}>+</button>
                      </div>
                    )}
                    {tier.soldOut && (
                      <button style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: '1px solid #111827', background: '#ffffff', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                        Join Waitlist
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ))}

            <div style={{ marginTop: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                Enhance your experience
              </div>
              {UPSELLS.map(upsell => {
                const isAdded = addedUpsells.includes(upsell.id);
                return (
                  <div key={upsell.id} style={s.upsellCard}>
                    <img src={upsell.image} alt={upsell.name} style={s.upsellImg} />
                    <div style={s.upsellBody}>
                      <p style={s.upsellName}>{upsell.name}</p>
                      <p style={s.upsellDesc}>{upsell.desc}</p>
                      <span style={s.upsellPrice}>£{upsell.price}</span>
                    </div>
                    <button style={s.addBtn} onClick={() => toggleUpsell(upsell.id)}>
                      {isAdded ? '✓ Added' : 'Add'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                Payment Plan
              </div>

              <div
                onClick={() => { setPaymentPlan('full'); setAgreedToTerms(false); }}
                style={paymentPlan === 'full' ? s.paymentOptionActive : s.paymentOption}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Full Payment</span>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>£{grandTotal.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: 12, color: '#065f46' }}>Instant ticket delivery</div>
              </div>

              <div
                onClick={() => setPaymentPlan('3x')}
                style={paymentPlan === '3x' ? s.paymentOptionActive : s.paymentOption}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>3x Instalments</span>
                  <span style={{ fontSize: 16, fontWeight: 800 }}>£{(grandTotal / 3).toFixed(2)}/mo</span>
                </div>
                <div style={{ fontSize: 12, color: '#4b5563' }}>30% deposit upfront. Interest-free.</div>
              </div>

              <PaymentAgreement
                plan={paymentPlan}
                total={grandTotal}
                onAgreeChange={setAgreedToTerms}
              />
            </div>

            {!promoOpen ? (
              <button style={s.promoLink} onClick={() => setPromoOpen(true)}>
                Have a promo code?
              </button>
            ) : (
              <div style={s.promoInputRow}>
                <input
                  style={s.promoInput}
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                />
                <button
                  style={s.promoApplyBtn}
                  onClick={() => {
                    if (promoCode === 'GRID10') {
                      setPromoApplied(true);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            )}

            <div style={s.summary}>
              <div style={s.summaryRow}>
                <span>Tickets</span>
                <span>£{ticketTotal.toFixed(2)}</span>
              </div>
              {upsellTotal > 0 && (
                <div style={s.summaryRow}>
                  <span>Add-ons</span>
                  <span>£{upsellTotal.toFixed(2)}</span>
                </div>
              )}
              <div style={s.summaryRow}>
                <span>Platform fee (5%)</span>
                <span>£{platformFee.toFixed(2)}</span>
              </div>
              {promoApplied && (
                <div style={s.summaryRow}>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Promo (GRID10)</span>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>-£{discount.toFixed(2)}</span>
                </div>
              )}
              <div style={s.summaryTotal}>
                <span>Total</span>
                <span>£{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              style={canCheckout ? s.checkoutBtn : { ...s.checkoutBtn, background: '#d1d5db', color: '#9ca3af', cursor: 'not-allowed' }}
              onClick={() => {
                if (canCheckout) setModal('success');
              }}
            >
              {paymentPlan === '3x' && !agreedToTerms
                ? 'Agree to terms to continue'
                : `Pay £${(paymentPlan === '3x' ? grandTotal * 0.3 : grandTotal).toFixed(2)} →`}
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL: RESALE ===== */}
      {modal === 'resale' && (
        <div style={s.overlay} onClick={() => setModal('none')}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setModal('none')}>
              <XIcon width={20} height={20} />
            </button>
            <h2 style={s.modalTitle}>Resale Tickets</h2>
            <p style={s.modalSub}>For {EVENT.title}</p>

            <div style={s.resaleNotice}>
              <strong>🔒 GRID Verified Resale</strong><br />
              All tickets are verified and capped at 10% above face value.
            </div>

            {RESALE_TICKETS.map(ticket => (
              <div key={ticket.id} style={s.resaleCard}>
                <div style={s.resaleHeader}>
                  <span style={s.resaleTier}>{ticket.tier}</span>
                  <span style={s.resalePrice}>
                    £{ticket.price.toFixed(2)}
                    <span style={s.resaleCapped}>(capped)</span>
                  </span>
                </div>
                <p style={s.resaleSeller}>Seller: {ticket.seller}</p>
                <p style={s.resaleNote}>✓ {ticket.note}</p>
                <button style={s.resaleBtn} onClick={() => setModal('success')}>
                  Buy Resale Ticket →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MODAL: SUCCESS ===== */}
      {modal === 'success' && (
        <div style={s.overlay} onClick={() => setModal('none')}>
          <div style={{ ...s.modal, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={s.modalTitle}>
              {paymentPlan === '3x' ? 'Instalment plan started!' : "You're going!"}
            </h2>
            <p style={s.modalSub}>
              {paymentPlan === '3x'
                ? `Your 30% deposit (£${(grandTotal * 0.3).toFixed(2)}) has been charged. Check your email for the payment schedule.`
                : "Your tickets are confirmed. Check your email."}
            </p>
            <Link
              href="/my-tickets"
              style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 12, background: '#111827', color: '#ffffff', fontWeight: 700, textDecoration: 'none', fontSize: 15 }}
            >
              View My Tickets →
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
