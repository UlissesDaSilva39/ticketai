import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { id } = await params;

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, status, booker_id, artist:artist_id (user_id)')
    .eq('id', id)
    .maybeSingle();

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  }
  if ((booking as any).artist?.user_id !== user.id) {
    return NextResponse.json({ error: 'Not your booking.' }, { status: 403 });
  }
  if (booking.status !== 'pending') {
    return NextResponse.json({ error: 'Booking is not pending.' }, { status: 400 });
  }

  const { data: updated, error: updateErr } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', id)
    .select('*')
    .single();

  if (updateErr || !updated) {
    return NextResponse.json({ error: 'Update failed.' }, { status: 500 });
  }

  await supabase.from('notifications').insert({
    user_id: booking.booker_id,
    type: 'BOOKING_CONFIRMED',
    payload: {
      booking_id: id,
      preview: 'Your booking was confirmed. Pay the deposit to lock the date.',
    },
  });

  return NextResponse.json({ ok: true, booking: updated });
}