'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// SVG Icons
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
);
const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
);
const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="9 12 11 14 16 9" stroke="#fff" strokeWidth="2.5" fill="none"></polyline></svg>
);
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default function ArtistBookingPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [serviceType, setServiceType] = useState('Live Performance');

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/artists/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setArtist(d?.artist || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  // Estimate fee based on service type
  const estimatedFee = serviceType === 'Live Performance' ? '£800–£1,500' : 
                       serviceType === 'DJ Set' ? '£500–£1,000' :
                       serviceType === 'Studio Session' ? '£150/hr' :
                       serviceType === 'Feature / Collab' ? '£500–£2,000' : 'Custom';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/book/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistSlug: slug,
          artistName: artist?.name || slug,
          name, email, eventDate, venue, capacity, budget, message, serviceType
        }),
      });
      if (res.ok) setSubmitted(true);
      else alert('Could not submit - please try again.');
    } catch {
      alert('Error submitting booking.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Loading artist...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, margin: '0 auto 24px', background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Request Sent!</h1>
        <p style={{ color: '#6b7280', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
          {artist?.name || 'The artist'} will review your request. Expect a response within 24 hours.
          <br /><br />
          <strong>What happens next:</strong>
          <br />
          1. Artist reviews → 2. You receive a quote → 3. Deposit 30% → 4. Booking confirmed
        </p>
        <Link href="/discover/events" style={{ display: 'inline-block', padding: '14px 32px', background: '#111827', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}>
          Browse More Events
        </Link>
      </div>
    );
  }

  const displayName = artist?.name || slug?.replace(/-/g, ' ') || 'Artist';
  const responseTime = artist?.response_time || '24 hours';
  const isVerified = artist?.verified !== false;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: 80 }}>
      {/* HERO SECTION with artist info */}
      <section style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#fff', padding: '48px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href={`/artist/${slug}`} style={{ color: '#9ca3af', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
            <ArrowLeftIcon /> Back to {displayName}
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>Book {displayName}</h1>
                {isVerified && <VerifiedIcon />}
              </div>
              <p style={{ color: '#9ca3af', margin: '4px 0 0' }}>{artist?.city || 'London'} · {artist?.genres?.join(', ') || 'Music'}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
                <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                <span style={{ fontSize: 13, color: '#d1d5db', marginLeft: 4 }}>4.9 · 12 reviews</span>
              </div>
            </div>
          </div>

          {/* Trust signals row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 32, padding: '20px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ClockIcon />
              <span style={{ fontSize: 13 }}>Responds in {responseTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BoltIcon />
              <span style={{ fontSize: 13 }}>Fast booking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldIcon />
              <span style={{ fontSize: 13 }}>Secure escrow payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN FORM */}
      <div style={{ maxWidth: 900, margin: '-40px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          
          {/* LEFT: Form */}
          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Booking Request</h2>
            <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 24px' }}>All fields required unless marked optional</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Service Type</label>
                <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }}>
                  <option>Live Performance</option>
                  <option>DJ Set</option>
                  <option>Studio Session</option>
                  <option>Feature / Collab</option>
                  <option>Other</option>
                </select>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '6px 0 0' }}>Typical rate: <strong>{estimatedFee}</strong></p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your Name</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your Email</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Event Date</label>
                <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Venue / Location</label>
                <input type="text" required value={venue} onChange={e => setVenue(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Expected Capacity</label>
                <input type="number" placeholder="e.g. 500" value={capacity} onChange={e => setCapacity(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Budget (optional)</label>
                <input type="text" placeholder={estimatedFee} value={budget} onChange={e => setBudget(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14 }} />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Tell {displayName} about your event</label>
                <textarea rows={5} required value={message} onChange={e => setMessage(e.target.value)} placeholder="Genre, audience, special requirements, other artists on the lineup..." style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical' }} />
              </div>
            </div>

            <button type="submit" disabled={submitting} style={{ marginTop: 24, width: '100%', padding: '16px', background: 'linear-gradient(135deg, #00FF87, #00cc6d)', color: '#000', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1, boxShadow: '0 10px 30px rgba(0,255,135,0.3)' }}>
              {submitting ? 'Sending...' : `Send Booking Request to ${displayName}`}
            </button>
            
            <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
              Free to send · No payment until confirmed · 48-hour response guarantee
            </p>
          </form>

          {/* RIGHT: Trust sidebar */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            
            {/* Why book through GRID */}
            <div style={{ background: '#fff', padding: 24, borderRadius: 20, border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 0.5, color: '#6b7280' }}>Why book through GRID</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Secure escrow payment',
                  'Auto-generated contracts',
                  '30% deposit, 70% after event',
                  'Money-back guarantee',
                  'No hidden fees',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, fontSize: 13 }}>
                    <CheckIcon /> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What happens next */}
            <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', color: '#fff', padding: 24, borderRadius: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: 0.5, color: '#00FF87' }}>What happens next</h3>
              <ol style={{ padding: '0 0 0 20px', margin: 0, fontSize: 13, lineHeight: 2 }}>
                <li>Artist reviews request</li>
                <li>You receive custom quote</li>
                <li>Deposit 30% to confirm</li>
                <li>Booking confirmed 🎉</li>
              </ol>
            </div>

            {/* Response guarantee */}
            <div style={{ background: '#fef3c7', padding: 20, borderRadius: 16, border: '1px solid #fbbf24' }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#78350f', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <BoltIcon /> Fast response guarantee
              </p>
              <p style={{ fontSize: 12, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                {displayName} usually responds within {responseTime}. If no response in 48 hours, GRID will refund your request and suggest alternatives.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}