'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function ArtistBookingPage() {
  const params = useParams();
  const router = useRouter();
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
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [serviceType, setServiceType] = useState('Live Performance');

  useEffect(() => {
    if (!slug) return;
    // Fetch artist details from the public API
    fetch(`/api/artists/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        setArtist(d?.artist || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

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
          name, email, eventDate, venue, budget, message, serviceType
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Could not submit booking - please try again.');
      }
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
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: 24, textAlign: 'center' }}>
        <div style={{ background: '#d1fae5', color: '#059669', padding: '16px 24px', borderRadius: 16, marginBottom: 24 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Booking Request Sent!</h1>
        <p style={{ color: '#6b7280', maxWidth: 500, marginBottom: 32 }}>
          {artist?.name || 'The artist'} will review your request. We will notify you via email within 48 hours.
        </p>
        <Link href="/discover/events" style={{ padding: '12px 24px', background: '#111827', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          Browse More Events
        </Link>
      </div>
    );
  }

  const displayName = artist?.name || slug?.replace(/-/g, ' ') || 'Artist';

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 24px' }}>
      <Link href={`/artist/${slug}`} style={{ color: '#6b7280', fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 24 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to {displayName}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800 }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Book {displayName}</h1>
          <p style={{ color: '#6b7280', margin: '4px 0 0' }}>Send a direct booking request. Fast response guaranteed.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 20, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Service Type</label>
            <select value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
              <option>Live Performance</option>
              <option>DJ Set</option>
              <option>Studio Session</option>
              <option>Feature / Collab</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Event Date</label>
            <input type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Venue / Location</label>
            <input type="text" required value={venue} onChange={e => setVenue(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Budget (optional)</label>
            <input type="text" placeholder="e.g. £800" value={budget} onChange={e => setBudget(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
          </div>

          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Message</label>
            <textarea rows={4} required value={message} onChange={e => setMessage(e.target.value)} placeholder={`Tell ${displayName} about your event...`} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical' }} />
          </div>
        </div>

        <button type="submit" disabled={submitting} style={{ marginTop: 24, width: '100%', padding: '16px', background: '#111827', color: '#fff', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
          {submitting ? 'Sending Request...' : `Send Booking Request to ${displayName}`}
        </button>
        
        <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
          Free to send. No payment required until the artist accepts and you confirm terms.
        </p>
      </form>
    </div>
  );
}