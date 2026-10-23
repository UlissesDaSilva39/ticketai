'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// ============ SVG ICONS ============
const IconLocation = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconFire = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;
const IconShield = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconZap = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconLock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const IconTrophy = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><polyline points="20 6 9 17 4 12"/></svg>;
const IconX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconSpeaker = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
const IconLight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/></svg>;
const IconGlass = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 22h8"/><path d="M12 11v11"/><path d="M12 11L3 2h18l-9 9z"/></svg>;
const IconDoor = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561z"/></svg>;
const IconSnow = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/></svg>;
const IconMic = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>;
const IconCar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>;
const IconWifi = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>;

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

  if (!venue) return <div style={{ padding: 60, textAlign: 'center', fontSize: 18 }}>Loading or not found...</div>;

  const amenities = [
    { icon: <IconSpeaker />, label: 'Premium Sound System' },
    { icon: <IconLight />, label: 'Stage Lighting' },
    { icon: <IconGlass />, label: 'Full Bar' },
    { icon: <IconDoor />, label: 'VIP Area' },
    { icon: <IconSnow />, label: 'Air Conditioning' },
    { icon: <IconMic />, label: 'Green Room' },
    { icon: <IconCar />, label: 'Parking Nearby' },
    { icon: <IconWifi />, label: 'Free Wi-Fi' },
  ];

  const gallery = [
    'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop',
  ];

  const recommendedArtists = [
    { id: 'a1', name: 'DJ Poxy', type: 'DJ', genre: 'House', price: 1500, image: 'https://images.unsplash.com/photo-1574154893626-3b6e6f6dc55c?q=80&w=400&auto=format&fit=crop' },
    { id: 'a2', name: 'Paper Lions', type: 'Band', genre: 'Jazz Fusion', price: 2500, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop' },
    { id: 'a3', name: 'Ulisses Da Silva', type: 'Singer', genre: 'MPB', price: 1200, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop' },
  ];

  const mapQuery = encodeURIComponent(venue.name + ', ' + venue.city);
  const mapUrl = 'https://maps.google.com/maps?q=' + mapQuery + '&t=&z=13&ie=UTF8&iwloc=&output=embed';

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>
      
      {/* HERO IMAGE */}
      <div style={{ height: 480, width: '100%', backgroundImage: 'url(' + venue.image + ')', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))' }}></div>
        
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', padding: '24px 24px 0' }}>
          <button onClick={() => router.push('/discover/venues')} style={{ background: 'white', border: 'none', padding: '10px 18px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
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
              <IconLocation /> {venue.city} &middot; <IconStar /> {venue.rating} ({venue.reviews} reviews) &middot; <IconCalendar /> {venue.bookings} bookings this month
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }}>
        
        <div>
          {/* URGENCY BANNER */}
          <div style={{ background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 12, padding: '12px 16px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconFire />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#92400e' }}>2 promoters are viewing this venue right now.</span>
          </div>

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

          {/* RECOMMENDED ACTS */}
          <section style={{ marginBottom: 48, borderTop: '1px solid #e5e7eb', paddingTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#111827' }}>Recommended acts for this space</h2>
                <p style={{ fontSize: 14, color: '#6b7280', marginTop: 4, margin: 0 }}>Promoters usually pair this venue with these artists.</p>
              </div>
              <button onClick={() => router.push('/discover/artists')} style={{ background: 'none', border: 'none', color: '#7c5cff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                View all &rarr;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {recommendedArtists.map((artist) => (
                <div key={artist.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                  <img src={artist.image} alt={artist.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, margin: 0 }}>{artist.name}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{artist.type} &middot; {artist.genre}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginTop: 8, marginBottom: 12 }}>From £{artist.price}</p>
                    <button 
                      onClick={() => router.push('/artist/' + artist.name.toLowerCase().replace(/\s+/g, '-'))}
                      style={{ marginTop: 'auto', width: '100%', padding: '8px 0', borderRadius: 8, background: '#f3f4f6', color: '#111827', border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AMENITIES */}
          <section style={{ marginBottom: 48, borderTop: '1px solid #e5e7eb', paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Amenities</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {amenities.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'white', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#374151', display: 'flex', alignItems: 'center' }}>{a.icon}</span>
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

          {/* MAP (GOOGLE MAPS) */}
          <section style={{ borderTop: '1px solid #e5e7eb', paddingTop: 40, marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>Location</h2>
            <div style={{ width: '100%', height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f3f4f6' }}>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={mapUrl}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={'Map of ' + venue.name}
              ></iframe>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center' }}>
                <IconLocation /> {venue.name}, {venue.city}
              </p>
              <a 
                href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(venue.name + ', ' + venue.city)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: '#7c5cff', fontWeight: 700, textDecoration: 'none' }}
              >
                Open in Google Maps &rarr;
              </a>
            </div>
          </section>

          {/* HOUSE RULES */}
          <section style={{ borderTop: '1px solid #e5e7eb', paddingTop: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20, color: '#111827' }}>House Rules</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><IconCheck /> Last entry at 1:00 AM</li>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><IconCheck /> Strictly 18+ (ID required)</li>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><IconCheck /> No outside food or drink</li>
              <li style={{ display: 'flex', gap: 12, fontSize: 15, color: '#374151' }}><IconCheck /> Respect the neighbours (no flyering outside)</li>
            </ul>
          </section>
        </div>

        {/* STICKY SIDEBAR */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 32, border: '1px solid #e5e7eb', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 900 }}>£{Math.floor(venue.rating * 500)}</span>
              <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 500 }}>/ night (est.)</span>
            </div>
            
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

            <button onClick={() => setShowEnquire(true)} style={{ width: '100%', padding: '18px 0', borderRadius: 12, background: '#111827', color: 'white', border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
              Enquire for Availability
            </button>
            <button onClick={() => router.push('/venues/' + slug + '/join')} style={{ width: '100%', padding: '18px 0', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <IconTrophy /> Join Venue Club
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13 }}>
                <IconShield /> Protected by GRID
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13 }}>
                <IconZap /> Fast response (&lt; 2h)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13 }}>
                <IconLock /> Secure enquiry
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRE MODAL */}
      {showEnquire && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', zIndex: 100, padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, width: '100%', maxWidth: 500, position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setShowEnquire(false)} style={{ position: 'absolute', top: 16, right: 16, background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              <IconX />
            </button>
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
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#10b981', color: 'white', padding: '16px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700, zIndex: 200, boxShadow: '0 10px 30px rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconCheck /> {toast}
        </div>
      )}
    </main>
  );
}