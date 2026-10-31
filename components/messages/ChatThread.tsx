'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
type Message = { id: string; body: string; sender_id: string; created_at: string; };
export default function ChatThread({ threadId, currentUserId }: { threadId: string; currentUserId: string; }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);  useEffect(() => {
    const supabase = createClient();
    supabase.from('messages').select('id, body, sender_id, created_at')
      .eq('thread_id', threadId).order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setMessages(data as Message[]); });
    const channel = supabase.channel('thread-' + threadId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: 'thread_id=eq.' + threadId }, (payload) => {
        const next = payload.new as Message;
        setMessages((prev) => prev.some((m) => m.id === next.id) ? prev : [...prev, next]);
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [threadId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.from('messages').insert({ thread_id: threadId, sender_id: currentUserId, body: text });
    if (!error) setInput(''); else alert('Could not send: ' + error.message);
    setSending(false);
  }  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', maxHeight: '600px' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#fafafa', borderRadius: 12, marginBottom: 12 }}>
        {messages.length === 0 && <p style={{ color: '#888', fontSize: 14, textAlign: 'center', marginTop: 40 }}>No messages yet. Say hello.</p>}
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.sender_id === currentUserId ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <div style={{ maxWidth: '75%', padding: '8px 12px', borderRadius: 12, fontSize: 14, whiteSpace: 'pre-wrap', background: m.sender_id === currentUserId ? '#111' : '#e9e9e9', color: m.sender_id === currentUserId ? '#fff' : '#111' }}>{m.body}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>      <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." disabled={sending}
          style={{ flex: 1, padding: '12px 16px', border: '1px solid #ccc', borderRadius: 999, fontSize: 14, outline: 'none' }} />
        <button type="submit" disabled={sending || !input.trim()}
          style={{ padding: '12px 24px', borderRadius: 999, border: 'none', background: sending ? '#999' : '#111', color: '#fff', fontSize: 14, fontWeight: 600, cursor: sending ? 'not-allowed' : 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}