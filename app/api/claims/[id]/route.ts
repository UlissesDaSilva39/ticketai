import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/require-admin';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json({ error: 'status must be approved or rejected' }, { status: 400 });
    }

    // Only admins may approve or reject ownership claims.
    const gate = await requireAdmin();
    if ('response' in gate) return gate.response;
    const user = gate.user;

    const admin = createAdminClient();

    const { data: claim } = await admin
      .from('profile_claims')
      .select('id, claimant_id, target_type, target_id, status')
      .eq('id', id)
      .maybeSingle();

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    const { error: updateErr } = await admin
      .from('profile_claims')
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    if (status === 'approved') {
      const table = claim.target_type === 'promoter' ? 'promoters' : claim.target_type + 's';
      const ownerCol = claim.target_type === 'promoter' ? 'user_id' : 'owner_id';
      await admin.from(table).update({ [ownerCol]: claim.claimant_id }).eq('id', claim.target_id);
    }

    return NextResponse.json({ ok: true, status });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}