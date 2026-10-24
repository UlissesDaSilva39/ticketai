import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { PromoterEditForm } from '@/components/promoters/PromoterEditForm';

export const dynamic = 'force-dynamic';

export default async function PromoterProfileEditPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/promoter/dashboard/profile/edit');

  const { data: promoter } = await supabase
    .from('promoters')
    .select('id, display_name, bio, city, instagram, tiktok, youtube, commission_rate, user_id, slug')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!promoter) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '64px 24px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 48, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>No promoter profile linked</h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
            You do not own a promoter profile yet. Claim a promoter to edit its details.
          </p>
          <Link href="/discover/promoters" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: 8, background: '#111827', color: 'white', textDecoration: 'none', fontWeight: 700 }}>
            Browse promoters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '32px 24px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Link href="/promoter/dashboard" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>
          &larr; Back to dashboard
        </Link>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0 4px', color: '#111827' }}>Edit promoter profile</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 24px' }}>
          Changes are live on{' '}
          <Link href={'/promoters/' + (promoter.slug ?? '')} style={{ color: '#7c5cff', textDecoration: 'underline' }}>
            /promoters/{promoter.slug}
          </Link>
          {' '}immediately after saving.
        </p>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: 16, padding: 32 }}>
          <PromoterEditForm promoter={promoter} />
        </div>
      </div>
    </div>
  );
}