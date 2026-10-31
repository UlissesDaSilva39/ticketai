import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import ChatThread from '@/components/messages/ChatThread';
export const dynamic = 'force-dynamic';
export default async function ThreadPage({ params }: { params: Promise<{ id: string }>; }) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');  const { data: thread } = await supabase.from('threads').select('id, participant_a, participant_b').eq('id', id).maybeSingle();
  if (!thread) notFound();
  const isParticipant = thread.participant_a === user.id || thread.participant_b === user.id;
  if (!isParticipant) notFound();
  const otherId = thread.participant_a === user.id ? thread.participant_b : thread.participant_a;
  const { data: other } = await supabase.from('profiles').select('username, full_name, avatar_url').eq('id', otherId).maybeSingle();
  const name = other?.full_name || other?.username || 'Conversation';