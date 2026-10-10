import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const now = new Date().toISOString();
  const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: events } = await supabase
    .from('events')
    .select('id, title, start_date, venue_name, city, image_url, price_min, price_max, currency')
    .gte('start_date', now)
    .lte('start_date', in7Days)
    .order('start_date', { ascending: true })
    .limit(6);

  let friendsGoing: any[] = [];
  if (user) {
    const { data: friendships } = await supabase
      .from('friendships')
      .select('user_id, friend_id')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
      .eq('status', 'accepted');

    const friendIds = (friendships ?? []).map((f: any) =>
      f.friend_id === user.id ? f.user_id : f.friend_id
    );

    if (friendIds.length > 0) {
      const { data: interested } = await supabase
        .from('event_interest')
        .select('event_id, user_id, events(id, title, start_date, venue_name, city)')
        .in('user_id', friendIds)
        .limit(10);
      friendsGoing = interested ?? [];
    }
  }

  let followingFeed: any[] = [];
  if (user) {
    const { data: follows } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', user.id)
      .limit(20);

    const followedIds = (follows ?? []).map((f: any) => f.followed_id);

    if (followedIds.length > 0) {
      const { data: artistEvents } = await supabase
        .from('events')
        .select('id, title, start_date, venue_name, city, artist_id')
        .in('artist_id', followedIds)
        .gte('start_date', now)
        .order('start_date', { ascending: true })
        .limit(4);
      followingFeed = artistEvents ?? [];
    }
  }

  return NextResponse.json({
    events: events ?? [],
    friendsGoing,
    followingFeed,
    isAuthenticated: !!user,
  });
}
