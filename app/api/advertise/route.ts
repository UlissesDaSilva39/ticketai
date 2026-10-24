import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, promote, newsletter, plan } = body;

    if (!name || !email || !promote) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      console.error('Missing Supabase env vars for advertise API');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const supabase = createClient(url, key);

    const { error } = await supabase.from('advertise_requests').insert({
      name,
      email,
      promote,
      newsletter: !!newsletter,
      plan: plan || 'Basic',
      status: 'new',
    });

    if (error) {
      console.error('advertise insert error:', error);
      return NextResponse.json({ error: 'Could not save request' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('advertise POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
