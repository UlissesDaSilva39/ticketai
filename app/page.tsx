import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="home-hero">
        <p style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#16A36A", fontWeight: 700, marginBottom: 16 }}>
          THE NETWORK FOR MUSIC
        </p>
        <h1>The network for live music.</h1>
        <p>
          Artists get booked. Promoters fill rooms. Venues get discovered.
          Fans find their next night out — all in one place.
        </p>
        <div className="home-hero-actions">
          <Link href="/network" className="btn">Create free profile</Link>
          <Link href="/discover" className="btn btn-outline">See how it works</Link>
        </div>
      </section>

      <section style={{ padding: "0 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="home-stats">
          <div className="home-stat"><div className="home-stat-value">45,000+</div><div className="home-stat-label">Artists</div></div>
          <div className="home-stat"><div className="home-stat-value">12,000+</div><div className="home-stat-label">Promoters</div></div>
          <div className="home-stat"><div className="home-stat-value">8,000+</div><div className="home-stat-label">Venues</div></div>
          <div className="home-stat"><div className="home-stat-value">120,000+</div><div className="home-stat-label">Events</div></div>
        </div>
      </section>

      <section style={{ padding: "0 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div className="home-problem-fix">
          <div className="home-problem-card">
            <div className="home-problem-label bad">THE PROBLEM</div>
            <div className="home-problem-title">SCATTERED</div>
            <div className="home-problem-body">Gigs spread across ten apps and a hundred DMs.</div>
            <div style={{ margin: "12px 0", color: "#16A36A", fontSize: 20 }}>↓</div>
            <div className="home-problem-label good">THE FIX</div>
            <div className="home-problem-title">ONE FEED</div>
            <div className="home-problem-body">Every show, every artist, every city in one place.</div>
          </div>
          <div className="home-problem-card">
            <div className="home-problem-label bad">THE PROBLEM</div>
            <div className="home-problem-title">OPAQUE</div>
            <div className="home-problem-body">Booking emails lost in inboxes. No visibility.</div>
            <div style={{ margin: "12px 0", color: "#16A36A", fontSize: 20 }}>↓</div>
            <div className="home-problem-label good">THE FIX</div>
            <div className="home-problem-title">ONE REQUEST</div>
            <div className="home-problem-body">Send a booking. Get a clear accept or decline.</div>
          </div>
          <div className="home-problem-card">
            <div className="home-problem-label bad">THE PROBLEM</div>
            <div className="home-problem-title">INVISIBLE</div>
            <div className="home-problem-body">Artists never know who is actually listening.</div>
            <div style={{ margin: "12px 0", color: "#16A36A", fontSize: 20 }}>↓</div>
            <div className="home-problem-label good">THE FIX</div>
            <div className="home-problem-title">ONE DASHBOARD</div>
            <div className="home-problem-body">See views, cities, sources and trends in real time.</div>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ textAlign: "center" }}>
        <h2>What you get</h2>
        <p className="home-section-sub" style={{ margin: "0 auto 40px" }}>Everything a music career needs, in one place.</p>
        <div className="home-feature-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon">A</div>
            <h3>Artist Page</h3>
            <p>A Spotify-style profile with your music, shows, bio, and direct booking.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">B</div>
            <h3>Bookings</h3>
            <p>Request, accept, decline. Promoters and artists see the same status in real time.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">T</div>
            <h3>Ticketing</h3>
            <p>Sell tickets directly from your page. No hidden fees. Instant settlement.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">S</div>
            <h3>Social Layer</h3>
            <p>Follow, message, share. A real network, not an algorithm-driven feed.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">D</div>
            <h3>Analytics</h3>
            <p>Views, cities, traffic sources, trends. Know your audience for the first time.</p>
          </div>
          <div className="home-feature-card">
            <div className="home-feature-icon">N</div>
            <h3>Notifications</h3>
            <p>Email and in-app, in real time. Never miss a booking, a message or a follow.</p>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ textAlign: "center" }}>
        <h2>Built for everyone in the room</h2>
        <div className="home-roles">
          <div className="home-role-card">
            <div className="home-role-label">ARTISTS</div>
            <h3>Get booked. Get paid. Get seen.</h3>
            <Link href="/network" className="btn">Start as artist</Link>
          </div>
          <div className="home-role-card">
            <div className="home-role-label">PROMOTERS</div>
            <h3>Fill rooms. Earn commission.</h3>
            <Link href="/business" className="btn">Start as promoter</Link>
          </div>
          <div className="home-role-card">
            <div className="home-role-label">VENUES</div>
            <h3>List your nights. Get discovered.</h3>
            <Link href="/business" className="btn">Start as venue</Link>
          </div>
          <div className="home-role-card">
            <div className="home-role-label">FANS</div>
            <h3>Find your next night out.</h3>
            <Link href="/discover" className="btn">Explore events</Link>
          </div>
        </div>
      </section>

      <section className="home-section" style={{ textAlign: "center" }}>
        <h2>How it works</h2>
        <p className="home-section-sub" style={{ margin: "0 auto 40px" }}>Three steps. That is it.</p>
        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-num">01</div>
            <h3>Create your profile</h3>
            <p>Two minutes. Pick your role. Add your links.</p>
          </div>
          <div className="home-step">
            <div className="home-step-num">02</div>
            <h3>Build your audience</h3>
            <p>Share your page, upload music, list shows.</p>
          </div>
          <div className="home-step">
            <div className="home-step-num">03</div>
            <h3>Book and sell</h3>
            <p>Accept bookings, sell tickets, get paid.</p>
          </div>
        </div>
      </section>

      <section className="home-testimonial">
        <blockquote>"GRID is the first platform that actually understands how the underground works."</blockquote>
        <cite>DJ POXY, LONDON</cite>
      </section>

      <section className="home-cta">
        <h2>Ready to move the scene?</h2>
        <p>Free forever. No card needed.</p>
        <Link href="/network" className="btn">Create free</Link>
      </section>
    </div>
  );
}
