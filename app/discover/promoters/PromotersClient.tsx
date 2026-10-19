'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { PROMOTERS, CITIES, GENRES } from './data';

const s: Record<string, CSSProperties> = {
  page: { background: '#ffffff', color: '#111827', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', padding: '32px 24px' },
  wrap: { maxWidth: 1280, margin: '0 auto' },
  
  h1: { margin: '0 0 8px', fontSize: 24, fontWeight: 600 },
  subtitle: { color: '#4b5563', margin: '0 0 24px', fontSize: 14, lineHeight: 1.5, maxWidth: 800 },
  searchBox: { padding: '12px 16px', borderRadius: 8, border: '1px solid #d1d5db', width: '100%', maxWidth: 800, marginBottom: 24, fontSize: 14, outline: 'none' },
  
  sectionTitle: { fontSize: 12, letterSpacing: '0.05em', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', marginBottom: 12 },
  pillRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 },
  pill: { padding: '6px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#ffffff', border: '1px solid #d1d5db', color: '#374151' },
  pillActive: { padding: '6px 16px', borderRadius: 999, fontSize: 13, cursor: 'pointer', background: '#111827', border: '1px solid #111827', color: '#ffffff' },
  
  filterRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 16 },
  verifiedRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#374151', cursor: 'pointer' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 },
  
  card: { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  cardHead: { display: 'flex', gap: 12, alignItems: 'flex-start' },
  avatar: { width: 44, height: 44, borderRadius: 8, background: '#111827', color: '#ffffff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
  nameRow: { display: 'flex', alignItems: 'center', gap: 6 },
  name: { margin: 0, fontSize: 15, fontWeight: 600, color: '#111827' },
  badge: { background: '#111827', color: '#ffffff', borderRadius: '50%', width: 16, height: 16, display: 'grid', placeItems: 'center', fontSize: 10 },
  meta: { margin: '2px 0 0', fontSize: 12, color: '#6b7280' },
  desc: { margin: '8px 0 16px', fontSize: 13, color: '#4b5563', lineHeight: 1.5, flexGrow: 1 },
  
  statsRow: { display: 'flex', gap: 12, fontSize: 12, color: '#4b5563', marginBottom: 12 },
  
  calStrip: { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 12px', marginBottom: 16 },
  calRow: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, marginBottom: 4 },
  dotGreen: { width: 8, height: 8, borderRadius: '50%', background: '#10b981' },
  dotYellow: { width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' },
  dotRed: { width: 8, height: 8, borderRadius: '50%', background: '#ef4444' },
  calNext: { fontSize: 12, color: '#6b7280' },

  actions: { display: 'flex', gap: 8 },
  btnView: { flex: 1, padding: '8px 0', borderRadius: 999, background: '#ffffff', color: '#111827', border: '1px solid #d1d5db', fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' },
  btnBook: { flex: 1, padding: '8px 0', borderRadius: 999, background: '#111827', color: '#ffffff', border: '1px solid #111827', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 100 },
  modalBox: { background: '#ffffff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalTitle: { margin: '0 0 8px', fontSize: 20, fontWeight: 600 },
  modalSub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },
  formGroup: { marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 4, color: '#374151' },
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, outline: 'none' },
  btnClose: { padding: '10px 16px', borderRadius: 8, background: 'transparent', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer' },
  btnSend: { padding: '10px 16px', borderRadius: 8, background: '#111827', color: '#ffffff', border: 'none', fontWeight: 600, cursor: 'pointer' },
};

export default function PromotersClient() {
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [activeCity, setActiveCity] = useState('All');
  
  const [modalMode, setModalMode] = useState<'book' | 'message' | null>(null);
  const [selectedPromoter, setSelectedPromoter] = useState<typeof PROMOTERS[0] | null>(null);
  const [isSent, setIsSent] = useState(false);

  const openModal = (mode: 'book' | 'message', p: typeof PROMOTERS[0]) => {
    setModalMode(mode);
    setSelectedPromoter(p);
    setIsSent(false);
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPromoter(null);
  };

  const filtered = PROMOTERS.filter(p => {
    if (verifiedOnly && !p.verified) return false;
    if (activeCity !== 'All' && p.city !== activeCity) return false;
    return true;
  });

  return (
    <main style={s.page}>
      <div style={s.wrap}>
        <h1 style={s.h1}>Discover promoters</h1>
        <p style={s.subtitle}>
          Browse every promoter on GRID. Filter by city and discover who's actively booking artists and running events.
        </p>

        <input style={s.searchBox} placeholder="Search by name, city, or event focus..." />

        <div style={s.sectionTitle}>CITIES</div>
        <div style={s.pillRow}>
          <button style={activeCity === 'All' ? s.pillActive : s.pill} onClick={() => setActiveCity('All')}>All</button>
          {CITIES.map(c => (
            <button key={c} style={activeCity === c ? s.pillActive : s.pill} onClick={() => setActiveCity(c)}>{c}</button>
          ))}
        </div>

        <div style={s.sectionTitle}>GENRES</div>
        <div style={s.pillRow}>
          {GENRES.map(g => (
            <button key={g} style={s.pill}>{g}</button>
          ))}
        </div>

        <div style={s.filterRow}>
          <label style={s.verifiedRow}>
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            Verified promoters only
          </label>
          <div style={{ fontSize: 13, color: '#6b7280' }}>{filtered.length} promoters found</div>
        </div>

        <div style={s.grid}>
          {filtered.map((p) => (
            <div key={p.id} style={s.card}>
              <div style={s.cardHead}>
                <div style={s.avatar}>{p.initials}</div>
                <div>
                  <div style={s.nameRow}>
                    <h3 style={s.name}>{p.name}</h3>
                    {p.verified && <div style={s.badge} title="Verified by GRID">✓</div>}
                  </div>
                  <p style={s.meta}>{p.city} · Member since {p.since}</p>
                </div>
              </div>
              
              <p style={s.desc}>{p.desc}</p>
              
              <div style={s.statsRow}>
                <span>📅 {p.events} events</span>
                <span>⭐ {p.rating} ({p.reviews})</span>
                {p.merch && <span>🛍️ Merch</span>}
              </div>
              
              <div style={s.calStrip}>
                <div style={s.calRow}>
                  <div style={p.status === 'green' ? s.dotGreen : p.status === 'yellow' ? s.dotYellow : s.dotRed}></div>
                  {p.status === 'green' ? 'Available now' : p.status === 'yellow' ? 'Limited availability' : 'Fully booked'}
                </div>
                <div style={s.calNext}>Next: {p.next}</div>
              </div>

              <div style={s.actions}>
                <Link href={`/discover/promoters/${p.id}`} style={s.btnView}>View</Link>
                <button style={s.btnBook} onClick={() => openModal('book', p)}>✉ Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalMode && selectedPromoter && (
        <div style={s.modalOverlay} onClick={closeModal}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            {isSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
                <h2 style={s.modalTitle}>Message sent!</h2>
                <p style={s.modalSub}>{selectedPromoter.name} will get back to you shortly.</p>
                <button style={s.btnSend} onClick={closeModal}>Close</button>
              </div>
            ) : (
              <>
                <h2 style={s.modalTitle}>{modalMode === 'book' ? 'Book' : 'Message'} {selectedPromoter.name}</h2>
                <p style={s.modalSub}>Send a direct inquiry to their booking team.</p>
                
                <div style={s.formGroup}>
                  <label style={s.label}>Your Name / Artist Name</label>
                  <input style={s.input} placeholder="e.g. DJ Poxy" />
                </div>
                {modalMode === 'book' && (
                  <div style={s.formGroup}>
                    <label style={s.label}>Event Date</label>
                    <input style={s.input} type="date" />
                  </div>
                )}
                <div style={s.formGroup}>
                  <label style={s.label}>Message</label>
                  <textarea style={{ ...s.input, minHeight: 80 }} placeholder="Tell them about your event..."></textarea>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
                  <button style={s.btnClose} onClick={closeModal}>Cancel</button>
                  <button style={s.btnSend} onClick={() => setIsSent(true)}>Send {modalMode === 'book' ? 'Booking' : 'Message'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
