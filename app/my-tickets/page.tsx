'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarIcon, MapPinIcon, TagIcon, XIcon, GiftIcon,
  TrophyIcon, ChartIcon, DollarIcon,
} from '@/components/people/Icons';

// ============ MOCK DATA ============
const TICKETS = [
  {
    id: 't1',
    eventTitle: 'Warehouse Sessions 12',
    venue: 'Basement 44',
    city: 'London',
    date: 'Sat, 15 Nov 2026',
    time: '22:00',
    tier: 'General Admission',
    price: 25.00,
    status: 'confirmed',
    banner: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop',
    canResell: true,
    canUpgrade: true,
  },
  {
    id: 't2',
    eventTitle: 'Paper Lions Jazz Night',
    venue: 'The Jazz Cafe',
    city: 'London',
    date: 'Tue, 03 Nov 2026',
    time: '20:00',
    tier: 'VIP Table',
    price: 85.00,
    status: 'confirmed',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
    canResell: false,
    canUpgrade: false,
  },
  {
    id: 't3',
    eventTitle: 'Pomoer Odyssey Live',
    venue: 'Village Underground',
    city: 'London',
    date: 'Thu, 22 Oct 2026',
    time: '19:30',
    tier: 'Early Bird',
    price: 18.00,
    status: 'used',
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
    canResell: false,
    canUpgrade: false,
  },
];

const UPGRADES = [
  { id: 'u1', name: 'VIP Soundcheck', price: 20, desc: 'Early entry + signed poster' },
  { id: 'u2', name: 'Tour T-Shirt', price: 25, desc: 'Limited edition 2026 design' },
];

// ============ STYLES ============
const s: Record<string, React.CSSProperties> = {
  page: { background: '#f9fafb', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 },
  container: { maxWidth: 1100, margin: '0 auto', padding: '40px 24px' },
  
  header: { marginBottom: 32 },
  h1: { margin: '0 0 8px', fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' },
  subtitle: { margin: 0, fontSize: 16, color: '#6b7280' },

  // Filter tabs
  tabRow: { display: 'flex', gap: 8, marginBottom: 32, borderBottom: '1px solid #e5e7eb', paddingBottom: 16, overflowX: 'auto' as const },
  tab: { padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'transparent', color: '#6b7280', border: '1px solid #e5e7eb' },
  tabActive: { padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: '#111827', color: '#ffffff', border: '1px solid #111827' },

  // Ticket Cards
  ticketGrid: { display: 'grid', gap: 20 },
  ticketCard: { background: '#ffffff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', display: 'flex', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  ticketCardUsed: { opacity: 0.6, filter: 'grayscale(0.5)' },
  ticketBanner: { width: 200, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', flexShrink: 0 },
  ticketBannerOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)' },
  ticketBody: { padding: 24, flex: 1 },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap' as const, gap: 12 },
  eventTitle: { fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: '#111827' },
  eventVenue: { fontSize: 14, color: '#6b7280', margin: 0 },
  
  statusBadge: { fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  statusConfirmed: { background: '#d1fae5', color: '#065f46' },
  statusUsed: { background: '#e5e7eb', color: '#6b7280' },

  metaGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 },
  metaItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' },
  metaLabel: { fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 4, fontWeight: 600 },

  actionRow: { display: 'flex', gap: 12, flexWrap: 'wrap' as const },
  btnPrimary: { padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  btnSecondary: { padding: '10px 20px', borderRadius: 8, background: '#ffffff', color: '#111827', border: '1px solid #d1d5db', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  btnDanger: { padding: '10px 20px', borderRadius: 8, background: '#ffffff', color: '#dc2626', border: '1px solid #fca5a5', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },
  btnUpgrade: { padding: '10px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 },

  // Modal
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24 },
  modal: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 500, position: 'relative' },
  modalTitle: { margin: '0 0 8px', fontSize: 22, fontWeight: 800 },
  modalSub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },
  closeBtn: { position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4 },

  // Resale Modal
  resaleBox: { background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 12, padding: 16, marginBottom: 20, fontSize: 13, color: '#1e40af', lineHeight: 1.6 },
  priceRow: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e5e7eb', fontSize: 14 },
  priceRowTotal: { display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: 18, fontWeight: 800 },

  // Upsell Modal
  upgradeCard: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  upgradeCardActive: { border: '2px solid #7c5cff', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#faf9ff' },
  upgradeName: { fontSize: 15, fontWeight: 700, margin: '0 0 4px' },
  upgradeDesc: { fontSize: 12, color: '#6b7280', margin: 0 },
  upgradePrice: { fontSize: 16, fontWeight: 800 },

  submitBtn: { width: '100%', padding: '14px 0', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#ffffff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 20 },
  
  successBox: { textAlign: 'center' as const, padding: '20px 0' },
  successIcon: { fontSize: 64, marginBottom: 16 },

  empty: { textAlign: 'center' as const, padding: '80px 24px', color: '#6b7280' },
};

export default function MyTicketsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [modal, setModal] = useState<'none' | 'resell' | 'upgrade' | 'success'>('none');
  const [selectedTicket, setSelectedTicket] = useState<typeof TICKETS[0] | null>(null);
  const [selectedUpgrades, setSelectedUpgrades] = useState<string[]>([]);

  const openResell = (ticket: typeof TICKETS[0]) => {
    setSelectedTicket(ticket);
    setModal('resell');
  };

  const openUpgrade = (ticket: typeof TICKETS[0]) => {
    setSelectedTicket(ticket);
    setSelectedUpgrades([]);
    setModal('upgrade');
  };

  const toggleUpgrade = (id: string) => {
    setSelectedUpgrades(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const upcomingTickets = TICKETS.filter(t => t.status === 'confirmed');
  const pastTickets = TICKETS.filter(t => t.status === 'used');
  const visibleTickets = activeTab === 'upcoming' ? upcomingTickets : pastTickets;

  return (
    <main style={s.page}>
      <div style={s.container}>
        
        <div style={s.header}>
          <h1 style={s.h1}>My Tickets</h1>
          <p style={s.subtitle}>Your upcoming events, resale options, and upgrades.</p>
        </div>

        {/* Filter Tabs */}
        <div style={s.tabRow}>
          <button style={activeTab === 'upcoming' ? s.tabActive : s.tab} onClick={() => setActiveTab('upcoming')}>
            Upcoming ({upcomingTickets.length})
          </button>
          <button style={activeTab === 'past' ? s.tabActive : s.tab} onClick={() => setActiveTab('past')}>
            Past ({pastTickets.length})
          </button>
        </div>

        {/* Tickets List */}
        {visibleTickets.length === 0 ? (
          <div style={s.empty}>
            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>No tickets here yet</p>
            <p style={{ marginBottom: 24 }}>Browse events to find your next night out.</p>
            <Link href="/discover/events" style={{ padding: '12px 24px', borderRadius: 8, background: '#111827', color: '#ffffff', fontWeight: 600, textDecoration: 'none' }}>
              Find Events →
            </Link>
          </div>
        ) : (
          <div style={s.ticketGrid}>
            {visibleTickets.map(ticket => (
              <div key={ticket.id} style={{ ...s.ticketCard, ...(ticket.status === 'used' ? s.ticketCardUsed : {}) }}>
                <div style={{ ...s.ticketBanner, backgroundImage: `url('${ticket.banner}')` }}>
                  <div style={s.ticketBannerOverlay} />
                </div>
                <div style={s.ticketBody}>
                  
                  <div style={s.ticketHeader}>
                    <div>
                      <h3 style={s.eventTitle}>{ticket.eventTitle}</h3>
                      <p style={s.eventVenue}>{ticket.venue} · {ticket.city}</p>
                    </div>
                    <span style={{ ...s.statusBadge, ...(ticket.status === 'confirmed' ? s.statusConfirmed : s.statusUsed) }}>
                      {ticket.status === 'confirmed' ? 'Confirmed' : 'Used'}
                    </span>
                  </div>

                  <div style={s.metaGrid}>
                    <div>
                      <div style={s.metaLabel}>Date</div>
                      <div style={s.metaItem}><CalendarIcon width={14} height={14} /> {ticket.date}</div>
                    </div>
                    <div>
                      <div style={s.metaLabel}>Time</div>
                      <div style={s.metaItem}>{ticket.time}</div>
                    </div>
                    <div>
                      <div style={s.metaLabel}>Tier</div>
                      <div style={s.metaItem}><TagIcon width={14} height={14} /> {ticket.tier}</div>
                    </div>
                  </div>

                  <div style={s.actionRow}>
                    <Link href="/my-tickets/view" style={s.btnPrimary}>
                      View Ticket →
                    </Link>
                    {ticket.canUpgrade && (
                      <button style={s.btnUpgrade} onClick={() => openUpgrade(ticket)}>
                        <TrophyIcon width={14} height={14} /> Upgrade
                      </button>
                    )}
                    {ticket.canResell && (
                      <button style={s.btnDanger} onClick={() => openResell(ticket)}>
                        <DollarIcon width={14} height={14} /> Resell
                      </button>
                    )}
                    <button style={s.btnSecondary}>
                      <GiftIcon width={14} height={14} /> Buy Merch
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ===== RESELL MODAL ===== */}
      {modal === 'resell' && selectedTicket && (
        <div style={s.overlay} onClick={() => setModal('none')}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setModal('none')}><XIcon width={20} height={20} /></button>
            <h2 style={s.modalTitle}>Resell your ticket</h2>
            <p style={s.modalSub}>{selectedTicket.eventTitle} · {selectedTicket.date}</p>

            <div style={s.resaleBox}>
              <strong>🔒 GRID Verified Resale</strong><br />
              Tickets with an active instalment plan cannot be resold. Once fully paid, tickets can be listed at face value + up to 10%. (max £{(selectedTicket.price * 1.1).toFixed(2)}). GRID takes a 10% fee from the sale. Once listed, tickets cannot be cancelled.
            </div>

            <div style={s.priceRow}>
              <span>Original price</span>
              <span>£{selectedTicket.price.toFixed(2)}</span>
            </div>
            <div style={s.priceRow}>
              <span>Your listing (capped)</span>
              <span>£{(selectedTicket.price * 1.1).toFixed(2)}</span>
            </div>
            <div style={s.priceRow}>
              <span>GRID fee (10%)</span>
              <span>-£{(selectedTicket.price * 0.11).toFixed(2)}</span>
            </div>
            <div style={s.priceRowTotal}>
              <span>You receive</span>
              <span>£{(selectedTicket.price * 0.99).toFixed(2)}</span>
            </div>

            <button style={s.submitBtn} onClick={() => setModal('success')}>
              List for £{(selectedTicket.price * 1.1).toFixed(2)} →
            </button>
          </div>
        </div>
      )}

      {/* ===== UPGRADE MODAL ===== */}
      {modal === 'upgrade' && selectedTicket && (
        <div style={s.overlay} onClick={() => setModal('none')}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button style={s.closeBtn} onClick={() => setModal('none')}><XIcon width={20} height={20} /></button>
            <h2 style={s.modalTitle}>Upgrade your ticket</h2>
            <p style={s.modalSub}>{selectedTicket.eventTitle} · {selectedTicket.tier}</p>

            {UPGRADES.map(upg => (
              <div
                key={upg.id}
                style={selectedUpgrades.includes(upg.id) ? s.upgradeCardActive : s.upgradeCard}
                onClick={() => toggleUpgrade(upg.id)}
              >
                <div>
                  <p style={s.upgradeName}>{upg.name}</p>
                  <p style={s.upgradeDesc}>{upg.desc}</p>
                </div>
                <span style={s.upgradePrice}>+£{upg.price}</span>
              </div>
            ))}

            <button style={s.submitBtn} onClick={() => setModal('success')}>
              Add {selectedUpgrades.length} upgrade{selectedUpgrades.length === 1 ? '' : 's'} · £
              {selectedUpgrades.reduce((sum, id) => {
                const upg = UPGRADES.find(u => u.id === id);
                return sum + (upg?.price || 0);
              }, 0)}
            </button>
          </div>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {modal === 'success' && (
        <div style={s.overlay} onClick={() => setModal('none')}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.successBox}>
              <div style={s.successIcon}>🎉</div>
              <h2 style={s.modalTitle}>Done!</h2>
              <p style={s.modalSub}>
                {selectedTicket && `Your ticket to ${selectedTicket.eventTitle} has been updated. Check your email for confirmation.`}
              </p>
              <button style={{ ...s.submitBtn, width: 'auto', padding: '14px 32px' }} onClick={() => setModal('none')}>
                Back to My Tickets
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

