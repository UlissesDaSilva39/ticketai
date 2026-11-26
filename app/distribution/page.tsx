import Link from "next/link";

// Stores we plan to deliver to once a delivery partner is live. Shown as plans,
// not as current coverage.
const PLATFORMS = [
  "Spotify", "Apple Music", "YouTube Music", "TikTok", "Amazon Music",
  "Deezer", "Tidal", "SoundCloud",
];

const STEPS = [
  { n: 1, title: "Build your release", body: "Add your tracks, cover art, credits and release date in the GRID release builder. Available now." },
  { n: 2, title: "Pass the store checks", body: "GRID checks artwork, audio and metadata against common store rules, so your release isn't rejected later." },
  { n: 3, title: "Deliver when we launch", body: "When delivery opens, submit your ready release in one click. Royalties will flow into your GRID balance with your splits." },
];

const FAQ = [
  { q: "Can GRID put my music on Spotify today?", a: "Not yet. GRID distribution is in early access: you can build and check releases now, and we'll email you as soon as delivery to stores opens." },
  { q: "Do I keep my rights?", a: "Yes. You keep 100% of your master rights and publishing. GRID never claims ownership of your music." },
  { q: "What does it cost?", a: "Preparing releases is free. We'll confirm delivery pricing before it opens, and nothing is charged without you agreeing to it first." },
  { q: "My music is already with another distributor. Can I move?", a: "When delivery opens you'll be able to move releases. Keep them live with your current distributor until your GRID release is live, so you don't lose streams." },
  { q: "How will royalties be paid?", a: "Royalties will go into your GRID balance and be shared using your GRID split sheets. You'll be able to withdraw them like any other GRID earnings." },
];

export default function DistributionPage() {
  return (
    <main className="dist-root">
      <style dangerouslySetInnerHTML={{ __html: `
        .dist-root{--bg:#0a0a0a;--surface:#141414;--border:#262626;--text:#f5f5f5;--muted:#9a9a9a;--accent:#1DB954;--radius:14px;--max:1120px;
          background:var(--bg);color:var(--text);font-family:inherit;min-height:100vh}
        .dist-wrap{max-width:var(--max);margin:0 auto;padding:0 24px}
        .dist-eyebrow{font-size:12px;letter-spacing:.18em;color:var(--muted);text-transform:uppercase;margin:0 0 14px}
        .dist-h1{font-size:56px;line-height:1.05;margin:0 0 18px;font-weight:700;letter-spacing:-.02em}
        .dist-h2{font-size:36px;margin:0 0 32px;font-weight:650;letter-spacing:-.01em}
        .dist-p{color:var(--muted);font-size:17px;line-height:1.6;margin:0 0 24px;max-width:640px}
        .dist-btn{display:inline-block;padding:14px 26px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;transition:transform .15s}
        .dist-btn:hover{transform:translateY(-1px)}
        .dist-btn-primary{background:var(--accent);color:#000}
        .dist-btn-ghost{background:transparent;color:var(--text);border:1px solid var(--border)}
        .dist-section{padding:96px 0}
        .dist-hero{padding:120px 0 80px}
        .dist-trust{display:flex;gap:28px;flex-wrap:wrap;margin-top:32px;font-size:13px;color:var(--muted)}
        .dist-trust span::before{content:"·";margin-right:10px;color:var(--accent)}
        .dist-trust span:first-child::before{content:"";margin:0}
        .dist-logos{display:flex;flex-wrap:wrap;gap:14px 36px;align-items:center;justify-content:center;padding:36px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .dist-logos span{color:#3a3a3a;font-weight:700;font-size:18px;filter:grayscale(1);transition:color .2s,filter .2s}
        .dist-logos span:hover{color:var(--text);filter:none}
        .dist-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
        .dist-step{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:28px}
        .dist-step .num{width:40px;height:40px;border-radius:999px;background:var(--accent);color:#000;display:flex;align-items:center;justify-content:center;font-weight:700;margin-bottom:18px}
        .dist-step h3{margin:0 0 8px;font-size:18px}
        .dist-step p{margin:0;font-size:14px;color:var(--muted)}
        .dist-pricing{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:820px}
        .dist-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:36px;position:relative}
        .dist-card.pro{border:2px solid var(--accent)}
        .dist-badge{position:absolute;top:-12px;right:20px;background:var(--accent);color:#000;font-size:11px;font-weight:700;letter-spacing:.08em;padding:4px 10px;border-radius:999px}
        .dist-price{font-size:42px;font-weight:700;margin:6px 0 4px}
        .dist-price small{font-size:15px;color:var(--muted);font-weight:500}
        .dist-card ul{list-style:none;padding:0;margin:22px 0 28px}
        .dist-card li{padding:9px 0;color:#d4d4d4;font-size:14px}
        .dist-card li::before{content:"✓";color:var(--accent);margin-right:10px;font-weight:700}
        .dist-faq{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px 24px;margin-bottom:12px}
        .dist-faq summary{cursor:pointer;font-weight:600;font-size:15px;list-style:none;display:flex;justify-content:space-between;align-items:center}
        .dist-faq summary::-webkit-details-marker{display:none}
        .dist-faq summary::after{content:"+";font-size:22px;color:var(--accent);font-weight:400;transition:transform .2s}
        .dist-faq[open] summary::after{transform:rotate(45deg)}
        .dist-faq p{margin:14px 0 0;font-size:14px;color:var(--muted)}
        .dist-cta{text-align:center;background:linear-gradient(180deg,#111,#0a0a0a);border-top:1px solid var(--border);padding:110px 24px}
        .dist-cta h2{font-size:40px;margin-bottom:14px}
        .dist-cta p{margin:0 auto 32px;text-align:center}
        @media (max-width:760px){
          .dist-h1{font-size:38px} .dist-h2{font-size:28px}
          .dist-steps,.dist-pricing{grid-template-columns:1fr}
          .dist-section{padding:64px 0}
        }
      ` }} />

      <section className="dist-hero">
        <div className="dist-wrap">
          <p className="dist-eyebrow">Music Distribution · Early access</p>
          <h1 className="dist-h1">Get your next release<br />store-ready on GRID</h1>
          <p className="dist-p">
            Build your release, pass the store checks and lock in your splits today.
            When GRID delivery opens, send it to Spotify, Apple Music, TikTok and more in one click.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/distribution/releases/new" className="dist-btn dist-btn-primary">Start a release</Link>
            <Link href="/distribution/releases" className="dist-btn dist-btn-ghost">My releases</Link>
          </div>
          <div className="dist-trust">
            <span>Free to prepare</span><span>Store-ready checks</span>
            <span>Split sheets built in</span><span>Keep 100% of your rights</span>
          </div>
        </div>
      </section>

      <div className="dist-wrap">
        <p className="dist-eyebrow" style={{ textAlign: "center", margin: "0 0 4px" }}>Stores we plan to deliver to</p>
        <div className="dist-logos">
          {PLATFORMS.map((p) => <span key={p}>{p}</span>)}
        </div>
      </div>

      <section className="dist-section" id="how">
        <div className="dist-wrap">
          <h2 className="dist-h2">How it works</h2>
          <div className="dist-steps">
            {STEPS.map((s) => (
              <div className="dist-step" key={s.n}>
                <div className="num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dist-section">
        <div className="dist-wrap">
          <h2 className="dist-h2">Early access</h2>
          <div className="dist-pricing">
            <div className="dist-card">
              <p className="dist-eyebrow" style={{ margin: 0 }}>Now</p>
              <div className="dist-price">Free <small>to prepare</small></div>
              <ul>
                <li>Unlimited draft releases</li>
                <li>Cover art and audio checks</li>
                <li>Credits, ISRCs and release dates</li>
                <li>Split sheets for every track</li>
              </ul>
              <Link href="/distribution/releases/new" className="dist-btn dist-btn-ghost">Start a release</Link>
            </div>
            <div className="dist-card pro">
              <span className="dist-badge">COMING SOON</span>
              <p className="dist-eyebrow" style={{ margin: 0 }}>At launch</p>
              <div className="dist-price">Delivery <small>to stores</small></div>
              <ul>
                <li>One-click delivery of ready releases</li>
                <li>Release status and store links</li>
                <li>Royalties into your GRID balance</li>
                <li>Pricing confirmed before launch</li>
              </ul>
              <Link href="/distribution/releases" className="dist-btn dist-btn-primary">Get notified</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="dist-section">
        <div className="dist-wrap">
          <h2 className="dist-h2">Questions</h2>
          {FAQ.map((f) => (
            <details className="dist-faq" key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="dist-cta">
        <h2 className="dist-h2">Get your next release<br />ready today.</h2>
        <p className="dist-p">Free to prepare. No credit card. No rights taken.</p>
        <Link href="/distribution/releases/new" className="dist-btn dist-btn-primary">Start a release</Link>
      </div>
    </main>
  );
}
