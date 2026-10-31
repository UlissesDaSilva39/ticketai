import Link from 'next/link';
import AudienceView from '@/components/business/AudienceView';

export const metadata = {
  title: 'Dashboard | GRID',
  description: 'Manage your audience and events on GRID.',
};

export default function DashboardPage() {
  return (
    <main style={{ background: '#ffffff', color: '#111111', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#888888', marginBottom: '8px' }}>
            Dashboard
          </p>
          <h1 style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Your audience and events
          </h1>
          <p style={{ fontSize: '15px', color: '#666666' }}>
            See who is following you, who has bought tickets, and who has messaged you.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #e5e5e5' }}>
          <Link href="/business" style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#111111', borderBottom: '2px solid #111111', textDecoration: 'none' }}>
            Audience
          </Link>
          <Link href="/business" style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 500, color: '#666666', textDecoration: 'none' }}>
            Events
          </Link>
        </div>

        <AudienceView />
      </div>
    </main>
  );
}
