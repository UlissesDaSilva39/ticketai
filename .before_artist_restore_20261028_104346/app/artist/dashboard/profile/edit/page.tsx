import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { ArtistEditForm } from '@/components/artists/ArtistEditForm';

export const dynamic = 'force-dynamic';

export default async function ArtistProfileEditPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/artist/dashboard/profile/edit');

  const { data: artist } = await supabase
    .from('artists')
    .select('id, name, handle, bio, city, country, genre, artist_type, website, spotify, instagram, avatar_url, owner_id, slug')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!artist) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>No artist profile linked</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>You do not own an artist profile yet. Claim an artist to edit their details.</p>
          <Link href="/discover/artists" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: '#111827', color: 'white', textDecoration: 'none', fontWeight: 700 }}>Browse artists</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link href="/artist/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>&larr; Back to dashboard</Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 4px', color: '#111827' }}>Edit artist profile</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
          Changes are live on{' '}
          <Link href={'/artist/' + (artist.slug ?? '')} style={{ color: '#7c5cff', textDecoration: 'underline' }}>/artist/{artist.slug}</Link>
          {' '}immediately after saving.
        </p>
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 32 }}>
          <ArtistEditForm artist={artist} />
        </div>
      </div>
    </div>
  );
}