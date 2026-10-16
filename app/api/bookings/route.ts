import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

const MAX_DETAILS = 1000;

export async function POST(req: Request) {
  const supabase = await createServerSupabase();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { artistSlug, service, date, details } = await req.json();

  if (!artistSlug || typeof artistSlug !== 'string') {
    return NextResponse.json({ error: 'Missing artist.' }, { status: 400 });
  }
  if (!service || typeof service !== 'string') {
    return NextResponse.json({ error: 'Missing service.' }, { status: 400 });
  }
  if (!date || typeof date !== 'string') {
    return NextResponse.json({ error: 'Missing date.' }, { status: 400 });
  }
  if (typeof details !== 'string' || details.trim().length < 10) {
    return NextResponse.json(
      { error: 'Please describe your project (at least 10 characters).' },
      { status: 400 }
    );
  }
  if (details.length > MAX_DETAILS) {
    return NextResponse.json({ error: 'Description too long.' }, { status: 400 });
  }

  // Look up the artist by slug
  const { data: artist, error: artistErr } = await supabase
    .from('artists')
    .select('id, user_id, name')
    .eq('slug', artistSlug)
    .maybeSingle();

  if (artistErr || !artist) {
    return NextResponse.json({ error: 'Artist not found.' }, { status: 404 });
  }
  if (artist.user_id === user.id) {
    return NextResponse.json({ error: 'Cannot book yourself.' }, { status: 400 });
  }

  // Insert the booking
  const { data: booking, error: bookingErr } = await supabase
    .from('bookings')
    .insert({
      artist_id: artist.id,
      booker_id: user.id,
      service,
      start_date: date,
      details: details.trim(),
      status: 'pending',
    })
    .select('id, status')
    .single();

  if (bookingErr || !booking) {
    console.error('Booking insert failed:', bookingErr);
    return NextResponse.json({ error: 'Failed to create booking.' }, { status: 500 });
  }

  // Notify the artist (best-effort)
  await supabase.from('notifications').insert({
    user_id: artist.user_id,
    type: 'BOOKING_REQUEST',
    payload: {
      from_user_id: user.id,
      booking_id: booking.id,
      preview: details.slice(0, 80),
    },
  });

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    status: booking.status,
  });
}