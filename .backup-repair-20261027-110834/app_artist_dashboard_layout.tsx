import { redirect } from 'next/navigation';
import { createServerSupabase } from "@/lib/supabase/server";
import { supabase } from '@/lib/supabase';

export default async function artist  const supabase = await createServerSupabase();: { children: React.ReactNode }) {
  const supabase = supabase;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['artist', 'admin'].includes(profile.role)) {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
