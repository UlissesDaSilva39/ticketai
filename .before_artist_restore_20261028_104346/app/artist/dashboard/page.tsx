import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ArtistDashboard() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/artist/dashboard');

  const { data: artist } = await supabase
    .from('artists')
    .select('id, name, slug, bio, avatar_url, verified')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!artist) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>No artist profile yet</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>Claim your artist profile to start managing your page.</p>
          <Link href="/discover/artists" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: '#111827', color: 'white', textDecoration: 'none', fontWeight: 700 }}>Browse artists</Link>
        </div>
      </div>
    );
  }

  const sections = [
    { label: 'Bio', done: !!artist.bio },
    { label: 'Avatar', done: !!artist.avatar_url },
  ];
  const doneCount = sections.filter(s => s.done).length;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 4px', color: '#111827' }}>{artist.name}</h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{artist.verified ? 'Verified artist' : 'Unverified artist'}</p>
          </div>
          <Link href="/artist/dashboard/profile/edit" style={{ padding: '10px 20px', borderRadius: 8, background: '#111827', color: '#ffffff', textDecoration: 'none', fontSize: 13, fontWeight: 700 }}>
            Edit public profile
          </Link>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Profile completeness</h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px' }}>{doneCount} of {sections.length} sections complete</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {sections.map(s => (
              <span key={s.label} style={{ padding: '6px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600, background: s.done ? '#f0fdf4' : '#fef3c7', color: s.done ? '#10b981' : '#92400e' }}>
                {s.done ? '✓' : '○'} {s.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 12px' }}>Your public page</h2>
          <Link href={'/artist/' + (artist.slug ?? '')} style={{ color: '#7c5cff', textDecoration: 'underline', fontSize: 14 }}>
            /artist/{artist.slug}
          </Link>
        </div>
      </div>
    </div>
  );
}