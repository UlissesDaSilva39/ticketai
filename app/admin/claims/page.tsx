import { createAdminClient } from '@/lib/supabase/admin';
import { ClaimActions } from './ClaimActions';

export const dynamic = 'force-dynamic';

export default async function AdminClaimsPage() {
  const supabase = createAdminClient();

  const { data: claims } = await supabase
    .from('profile_claims')
    .select('id, claimant_id, target_type, target_id, verification_method, status, notes, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const pending = (claims ?? []).filter(c => c.status === 'pending');
  const reviewed = (claims ?? []).filter(c => c.status !== 'pending');

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'var(--font-antonio)' }}>
          Profile Claims
        </h1>
        <p className="text-gray-600 mb-8">
          {pending.length} pending · {reviewed.length} reviewed
        </p>

        <h2 className="text-xl font-bold mb-4">Pending review</h2>
        {pending.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No pending claims.
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {pending.map(c => (
              <div key={c.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-semibold">
                      {c.target_type} · {c.target_id.slice(0, 8)}…
                    </p>
                    <p className="text-sm text-gray-600">
                      Claimant: {c.claimant_id.slice(0, 8)}… · Method: {c.verification_method}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(c.created_at).toLocaleString('en-GB')}
                    </p>
                    {c.notes && <p className="text-sm mt-2 text-gray-700">{c.notes}</p>}
                  </div>
                  <ClaimActions claimId={c.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Reviewed</h2>
        {reviewed.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            No reviewed claims yet.
          </div>
        ) : (
          <div className="space-y-2">
            {reviewed.map(c => (
              <div key={c.id} className="rounded-lg border border-gray-200 bg-white p-3 flex justify-between text-sm">
                <span>{c.target_type} · {c.target_id.slice(0, 8)}…</span>
                <span className={`font-semibold ${c.status === 'approved' ? 'text-green-700' : 'text-red-700'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}