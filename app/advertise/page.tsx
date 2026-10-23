'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdvertisePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', promote: '', newsletter: false });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Upsell Modals
  const [showBasicUpsell, setShowBasicUpsell] = useState(false);
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Basic');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan: selectedPlan }),
      });
      
      if (res.ok) setSubmitted(true);
      else alert('Something went wrong. Please try again.');
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanClick = (plan: string) => {
    setSelectedPlan(plan);
    if (plan === 'Basic') {
      setShowBasicUpsell(true);
    } else if (plan === 'Premium') {
      setShowPremiumUpsell(true);
    } else {
      // Enterprise -> scroll to form
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (submitted) {
    return (
      <main style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui' }}>
        <div style={{ background: 'white', borderRadius: 24, padding: 48, maxWidth: 500, textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>Thanks for your interest!</h1>
          <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 24px' }}>
            Our team will reach out within 24 hours to discuss your campaign.
          </p>
          <button onClick={() => router.push('/')} style={{ padding: '12px 24px', borderRadius: 8, background: '#111827', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui', paddingBottom: 80 }}>
      
      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #111827, #1f2937)', padding: '80px 24px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h1 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px', letterSpacing: '-1px' }}>
            Advertise on GRID
          </h1>
          <p style={{ fontSize: 20, color: '#9ca3af', margin: '0 0 40px', maxWidth: 700, marginLeft: 'auto', marginRight: 'auto' }}>
            Reach 50,000+ artists, promoters, and music lovers. Promote your event, venue, or brand directly to the people who matter.
          </p>
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <div><p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>50k+</p><p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Monthly visitors</p></div>
            <div><p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>2.5M</p><p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Page views</p></div>
            <div><p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>12k+</p><p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Events promoted</p></div>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', opacity: 0.7 }}>
            <span style={{ fontSize: 14, color: '#d1d5db' }}>Trusted by: Nightshift Presents · Fabric · Paper Lions · Techno Nation</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '64px 24px' }}>
        
        {/* TIERS */}
        <h2 style={{ fontSize: 36, fontWeight: 800, textAlign: 'center', margin: '0 0 16px' }}>Choose your plan</h2>
        <p style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', margin: '0 0 48px' }}>Simple, transparent pricing. No hidden fees.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          
          {/* BASIC */}
          <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Basic</h3>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>Perfect for single events.</p>
            <p style={{ fontSize: 48, fontWeight: 800, margin: '0 0 24px' }}>£25<span style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>/event</span></p>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Featured on Events page for 7 days</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Social media mention</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Basic analytics</p>
            </div>
            <button onClick={() => handlePlanClick('Basic')} style={{ width: '100%', padding: '14px 0', borderRadius: 8, background: '#111827', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
              Get Started
            </button>
          </div>

          {/* PREMIUM */}
          <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '2px solid #7c5cff', boxShadow: '0 20px 40px -10px rgba(124,92,255,0.3)', transform: 'scale(1.05)', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#7c5cff', color: 'white', padding: '4px 16px', borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>MOST POPULAR</div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Premium</h3>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>For promoters and venues.</p>
            <p style={{ fontSize: 48, fontWeight: 800, margin: '0 0 24px' }}>£150<span style={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>/month</span></p>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Featured on ALL discovery pages</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Priority placement in search</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Dedicated social campaign</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Advanced analytics dashboard</p>
            </div>
            <button onClick={() => handlePlanClick('Premium')} style={{ width: '100%', padding: '14px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
              Choose Premium
            </button>
          </div>

          {/* ENTERPRISE */}
          <div style={{ background: 'white', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px' }}>Enterprise</h3>
            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 24px' }}>For brands and festivals.</p>
            <p style={{ fontSize: 48, fontWeight: 800, margin: '0 0 24px' }}>Custom</p>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Everything in Premium</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Homepage banner takeover</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Email newsletter feature</p>
              <p style={{ fontSize: 14, color: '#374151', marginBottom: 8 }}>✓ Dedicated account manager</p>
            </div>
            <button onClick={() => handlePlanClick('Enterprise')} style={{ width: '100%', padding: '14px 0', borderRadius: 8, background: '#111827', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 24 }}>
              Contact Sales
            </button>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div id="contact-form" style={{ background: 'white', borderRadius: 24, padding: 48, marginTop: 64, border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', textAlign: 'center' }}>Get in touch</h2>
          <p style={{ fontSize: 16, color: '#6b7280', textAlign: 'center', margin: '0 0 32px' }}>Fill out the form and our team will get back to you within 24 hours.</p>
          
          <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Your Name</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Email Address</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>What do you want to promote?</label>
              <select value={formData.promote} onChange={(e) => setFormData({...formData, promote: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
                <option value="">Select an option</option>
                <option value="Event">An Event</option>
                <option value="Venue">A Venue</option>
                <option value="Brand">A Brand</option>
                <option value="Artist">An Artist</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={formData.newsletter} onChange={(e) => setFormData({...formData, newsletter: e.target.checked})} style={{ width: 16, height: 16, cursor: 'pointer' }} />
              <label style={{ fontSize: 14, color: '#374151', cursor: 'pointer' }}>Also feature my campaign in the GRID Newsletter (+£50)</label>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px 0', borderRadius: 12, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* BASIC UPSELL MODAL */}
      {showBasicUpsell && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, maxWidth: 450, width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Want 3x more clicks?</h2>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
              Upgrade to Premium for just <strong>+£50</strong> and get featured on all discovery pages, plus priority placement in search.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowBasicUpsell(false); setSelectedPlan('Premium'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ flex: 1, padding: '14px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Yes, upgrade!
              </button>
              <button onClick={() => { setShowBasicUpsell(false); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ flex: 1, padding: '14px 0', borderRadius: 8, background: '#f3f4f6', color: '#374151', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREMIUM UPSELL MODAL */}
      {showPremiumUpsell && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', borderRadius: 24, padding: 40, maxWidth: 450, width: '100%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Go Enterprise?</h2>
            <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
              For just <strong>+£50/month</strong>, get a homepage banner takeover, email newsletter feature, and a dedicated account manager. 
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowPremiumUpsell(false); setSelectedPlan('Enterprise'); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ flex: 1, padding: '14px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                Yes, upgrade!
              </button>
              <button onClick={() => { setShowPremiumUpsell(false); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); }} style={{ flex: 1, padding: '14px 0', borderRadius: 8, background: '#f3f4f6', color: '#374151', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                No thanks
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}