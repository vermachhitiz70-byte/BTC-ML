import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/turso';
import { getSessionUser, validEmail, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const page = String(body.page || '').slice(0, 200);
  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (!/^[+\d][\d\s\-()]{5,19}$/.test(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 });
  }
  await getDb().execute({
    sql: 'INSERT INTO chat_leads(name, email, phone, page) VALUES(?, ?, ?, ?)',
    args: [name, email, phone, page],
  });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const store = await cookies();
  const user = await getSessionUser(store.get(SESSION_COOKIE)?.value).catch(() => null);
  if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  const rs = await getDb().execute({
    sql: 'SELECT id, name, email, phone, page, read, created_at FROM chat_leads ORDER BY id DESC LIMIT 200',
  });
  return NextResponse.json({ leads: rs.rows });
}
