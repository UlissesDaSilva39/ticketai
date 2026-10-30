import { retrieveRelevant } from '@/lib/retrieval';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop();
  const userQuery = lastUserMessage?.content ?? '';

  const sources = retrieveRelevant(userQuery, 3);
  const context = sources
    .map(s => `[${s.id}] ${s.question}\nAnswer: ${s.answer}\nSource: ${s.source}`)
    .join('\n\n');

  const system = `You are a support assistant for a music platform.
Answer ONLY using the knowledge entries below. Cite the entry ID after each claim.
If the entries do not contain the answer, say "I don't have verified information about that" and OFFER to create a support ticket.
Never invent fees, policies, refund outcomes, or shipping times.

KNOWLEDGE ENTRIES:
${context || 'No matching entries found.'}`;

  const apiKey = process.env.ZAI_API_KEY;
  if (!apiKey) {
    return new Response('ZAI_API_KEY not set', { status: 500 });
  }

  const zaiRes = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4.5-flash',
      messages: [
        { role: 'system', content: system },
        ...messages.map((m: any) => ({ role: m.role, content: m.content ?? '' })),
      ],
      stream: true,
    }),
  });

  if (!zaiRes.ok) {
    const err = await zaiRes.text();
    console.error('Z.ai error:', zaiRes.status, err);
    return new Response(`Z.ai error: ${zaiRes.status} ${err}`, { status: 502 });
  }

  return new Response(zaiRes.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
