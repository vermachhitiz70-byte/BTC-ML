import { NextResponse } from 'next/server';
import { getDb } from '@/lib/turso';
import { validEmail } from '@/lib/auth';
import { ensureSchema } from '@/lib/schema';

function str(v, max) {
  return String(v ?? '').trim().slice(0, max);
}

/** Public contact form -> messages table */
export async function POST(req) {
  await ensureSchema().catch(() => {});
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = str(body.name, 60);
  const email = str(body.email, 80).toLowerCase();
  const phone = str(body.phone, 20);
  const subject = str(body.subject, 120);
  const message = str(body.body, 3000);

  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: 'Please write a short message (at least 10 characters).' }, { status: 400 });
  }

  await getDb().execute({
    sql: 'INSERT INTO messages(name, email, subject, body, phone) VALUES(?, ?, ?, ?, ?)',
    args: [name, email, subject, message, phone],
  });

  return NextResponse.json({ ok: true, message: 'Thank you — your message has been received.' });
}