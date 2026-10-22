'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function VenueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const [venue, setVenue] = useState<any>(null);
  const [showEnquire, setShowEnquire] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch('/api/venues')
      .then(r => r.json())
      .then(data => {
        const found = data.find((v: any) => v.name.toLowerCase().replace(/\s+/g, '-') === slug || v.id === slug);
        if (found) setVenue(found);
      });
  }, [slug]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const submitEnquiry = () => {
    showToast('Enquiry sent to ' + venue.name + '!');
    setShowEnquire(false);
  };

  if (!venue) return <div style={{ padding: 60, textAlign: 'center', fontSize: 18 }}>Loading...</div>;

  const amenities = [
    { icon: '🔊', label: 'Premium Sound System' },
    { icon: '💡', label: 'Stage Lighting' },
    { icon: '🍸', label: 'Full Bar' },
    { icon: '🚪', label: 'VIP Area' },
    { icon: '❄️', label: 'Air Conditioning' },
    { icon: '🎤', label: 'Green Room' },
    { icon: '🚗', label: 'Parking Nearby' },
    { icon: '📶', label: 'Free Wi-Fi' },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>
      
      {/* HERO IMAGE & BREADCRUMB */}
      <div style={{ height: 480, width: '100%', backgroundImage: 'url(' + venue.image + ')', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))' }}></div>
        
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
          <button onClick={() => router.back()} style={{ background: 'white', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            ← Back to venues
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>VERIFIED</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{venue.type}</span>
              <span style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, background: 'white', borderRadius: '50%', display: 'inline-block' }}></span> High Demand
              </span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, margin: 0, color: 'white', letterSpacing: '-1.5px' }}>{venue.name}</h1>
            <p style={{ fontSize: 18, color: '#e5e7eb', marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              📍 {venue.city} · ⭐ {venue.rating} ({venue.reviews} reviews) · 📅 {venue.bookings} bookings this month
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID (2 Columns) */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Details */}
        <div>
          
          {/* ABOUT */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, color: '#111827' }}>About the venue</h2>
            <p style={{ fontSize: 17, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
              A premier {venue.type.toLowerCase()} in {venue.city}, designed for unforgettable nights. 
              Featuring state-of-the-art sound and lighting, {venue.name} is the perfect space for promoters 
              looking to host club nights, live music, and private events for up to {venue.capacity} guests. 
              The venue also offers a range of premium amenities, including a full bar, VIP area, and a dedicated green room for artists.
            </p>
          </section>

          {/* AMENITIES */}
          <section style={{ marginBottom: 48, borderTop: '1px solid #e5e7eb', paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {amenities.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{a.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* GALLERY */}
          <section style={{ borderTop: '1px solid #e5e7eb', paddingTop: 40, marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '200px 200px', gap: 12 }}>
              <img src={gallery[0]} alt="Gallery 0" style={{ gridRow: 'span 2', width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
              <img src={gallery[1]} alt="Gallery 1" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
              <img src={gallery[2]} alt="Gallery 2" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
            </div>
          </section>

          {/* LOCATION (MAP PLACEHOLDER) */}
          <section style={{ borderTop: '1px solid #e5e7eb', paddingTop: 40, marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Location</h2>
            <div style={{ width: '100%', height: 300, background: '#e5e7eb', borderRadius: 16, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 32 }}>📍</span>
                <p style={{ fontWeight: 700, marginTop: 8 }}>{venue.city}</p>
                <p style={{ fontSize: 14, color: '#6b7280' }}>Map view available on request</p>
              </div>
            </div>
          </section>

          {/* HOUSE RULES */}
          <section style={{ borderTop: '1px solid #e5e7eb', paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>House Rules</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Last entry at 1:00 AM</li>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Strictly 18+ (ID required)</li>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> No outside food or drink</li>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><span style={{ color: '#10b981', fontWeight: 800 }}>✓</span> Respect the neighbours (no flyering outside)</li>
            </ul>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #e5e7eb', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            
            {/* PRICE */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 900 }}>£{Math.floor(venue.rating * 500)}</span>
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>/ night (est.)</span>
            </div>
            
            {/* METRICS */}
            <div style={{ background: '#f9fafb', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Capacity</span>
                <span style={{ fontWeight: 800, fontSize: 13 }}>{venue.capacity} people</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Rating</span>
                <span style={{ fontWeight: 800, fontSize: 13 }}>{venue.rating} / 5.0</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Response Rate</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: '#10b981' }}>&lt; 2 hours</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Booked this month</span>
                <span style={{ fontWeight: 800, fontSize: 13 }}>{venue.bookings} times</span>
              </div>
            </div>

            {/* CTA BUTTONS */}
            <button onClick={() => setShowEnquire(true)} style={{ width: '100%', padding: '18px 0', borderRadius: 12, background: '#111827', color: 'white', border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 12, transition: 'background 0.2s' }}>
              Enquire for Availability
            </button>
            <button onClick={() => router.push('/venues/' + slug + '/join')} style={{ width: '100%', padding: '18px 0', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'opacity 0.2s' }}>
              🏆 Join Venue Club
            </button>

            {/* TRUST SIGNALS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🛡️</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Protected by GRID</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>⚡</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Fast response (&lt; 2h)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>🔒</span>
                <span style={{ fontSize: 13, color: '#6b7280' }}>Secure enquiry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRE MODAL */}
      {showEnquire && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, width: '100%', maxWidth: 500, position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setShowEnquire(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 16 }}>✕</button>
            <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>Enquire: {venue.name}</h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 24px' }}>Send a structured brief to the venue. They usually respond within 2 hours.</p>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Date of Event</label>
              <input type="date" style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Expected Attendance (Max {venue.capacity})</label>
              <input type="number" placeholder="e.g. 350" style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Event Type</label>
              <select style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
                <option>Club Night</option>
                <option>Live Music</option>
                <option>Private Party</option>
                <option>Corporate Event</option>
              </select>
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Message</label>
              <textarea placeholder="Hi, we are looking to host..." style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, minHeight: 100 }}></textarea>
            </div>
            <button onClick={submitEnquiry} style={{ width: '100%', padding: '16px 0', borderRadius: 12, background: '#111827', color: 'white', border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
              Send Enquiry
            </button>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#10b981', color: 'white', padding: '16px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, zIndex: 200, boxShadow: '0 10px 30px rgba(16,185,129,0.4)' }}>
          ✓ {toast}
        </div>
      )}
    </main>
  );
}