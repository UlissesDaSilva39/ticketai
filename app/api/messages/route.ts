import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

const MAX_BODY = 1000;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  const { toSlug, subject, body, context } = await req.json();

  if (!toSlug || typeof toSlug !== 'string') {
    return NextResponse.json({ error: 'Missing recipient.' }, { status: 400 });
  }
  if (typeof body !== 'string' || body.trim().length < 5) {
    return NextResponse.json({ error: 'Message too short.' }, { status: 400 });
  }
  if (body.length > MAX_BODY) {
    return NextResponse.json({ error: 'Message too long.' }, { status: 400 });
  }

  const recipient = await db.promoter.findUnique({
    where: { slug: toSlug },
    select: { id: true, userId: true },
  });
  if (!recipient) {
    return NextResponse.json({ error: 'Promoter not found.' }, { status: 404 });
  }
  if (recipient.userId === session.user.id) {
    return NextResponse.json({ error: 'Cannot message yourself.' }, { status: 400 });
  }

  const thread = await db.messageThread.upsert({
    where: {
      promoterId_senderId: {
        promoterId: recipient.id,
        senderId: session.user.id,
      },
    },
    create: {
      promoterId: recipient.id,
      senderId: session.user.id,
    },
    update: {},
  });

  await db.message.create({
    data: {
      threadId: thread.id,
      senderId: session.user.id,
      subject: subject ?? null,
      body: body.trim(),
      context: context ?? undefined,
    },
  });

  await db.notification.create({
    data: {
      userId: recipient.userId,
      type: 'MESSAGE',
      payload: {
        fromUserId: session.user.id,
        threadId: thread.id,
        preview: body.slice(0, 80),
      },
    },
  });

  return NextResponse.json({ ok: true, threadId: thread.id });
}