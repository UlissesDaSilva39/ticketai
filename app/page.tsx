import { createServerSupabase } from '@/lib/supabase/server';
import { HomeLoggedOut } from '@/components/home/HomeLoggedOut';
import { HomeLoggedIn } from '@/components/home/HomeLoggedIn';

export default async function HomePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <HomeLoggedOut />;

  let displayName: string | null = null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();
  displayName = profile?.username ?? user.email?.split('@')[0] ?? null;

  return <HomeLoggedIn user={{ name: displayName ?? undefined }} />;
}
