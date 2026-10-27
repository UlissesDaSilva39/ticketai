import { redirect } from 'next/navigation';
import { createServerSupabase } from "@/lib/supabase/server";
import { supabase } from '@/lib/su  const supabase = await createServerSupabase();nc function LabelDashboardPage() {
  const supabase = supabase;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/label/dashboard');

  const { data: profile } = await supabase
    .from('users')
    .select('role, artist_type')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/unauthorized');
  if (!['artist', 'admin'].includes(profile.role)) redirect('/unauthorized');

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Label Dashboard</h1>
        <p className="text-gray-600 mb-8">A&R / record company tools - manage your roster, scout talent, track releases.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold mb-1">Roster</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-500">Artists signed</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold mb-1">Scouting</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-500">Candidates</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-semibold mb-1">Releases</h2>
            <p className="text-3xl font-bold">0</p>
            <p className="text-sm text-gray-500">Upcoming</p>
          </div>
        </div>
      </div>
    </div>
  );
}
