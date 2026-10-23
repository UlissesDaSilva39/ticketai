export default function LabelsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: '0 0 8px', letterSpacing: '-0.02em' }}>Labels</h1>
        <p style={{ fontSize: 16, color: '#6b7280', margin: '0 0 32px' }}>Discover record labels and their rosters. Claim your label page to showcase your artists.</p>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>No labels listed yet</h2>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>Label profiles are being added. If you run a label, claim your page to showcase your artists and releases.</p>
          <a href='/advertise' style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: '#111827', color: 'white', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>Claim your label</a>
        </div>
      </div>
    </div>
  );
}
