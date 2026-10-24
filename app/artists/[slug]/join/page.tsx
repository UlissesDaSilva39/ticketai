export default function ArtistJoinPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', borderRadius: 16, padding: 40, border: '1px solid #e5e7eb' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>Join the club</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
          Get exclusive access, early ticket drops, and direct messages from the artist. £5/month.
        </p>
        <a href='/checkout' style={{ display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 8, background: 'linear-gradient(135deg, #7c5cff, #ff5c8a)', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
          Continue to checkout
        </a>
      </div>
    </div>
  );
}
