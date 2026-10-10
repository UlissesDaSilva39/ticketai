import { createServerSupabase } from '@/lib/supabase/server';
import { HomeLoggedOut } from '@/components/home/HomeLoggedOut';
import { HomeLoggedIn } from '@/components/home/HomeLoggedIn';

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <HomeLoggedOut />;

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  const now = new Date().toISOString();
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('events')
    .select('id, title, start_date, venue_name, city, image_url, price_min, price_max')
    .gte('start_date', now)
    .lte('start_date', in7Days)
    .order('start_date', { ascending: true })
    .limit(6);

  return (
    <HomeLoggedIn
      user={{ name: profile?.username ?? user.email?.split('@')[0] }}
      events={events ?? []}
    />
  );
}
