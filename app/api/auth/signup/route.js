import { NextResponse } from 'next/server';
import { getDb } from '@/lib/turso';
import { hashPassword, verifyPassword, createSession, sessionCookie, validEmail } from '@/lib/auth';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  if (!validEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });

  const db = getDb();
  const exists = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
  if (exists.rows.length) {
    return NextResponse.json({ error: 'This email is already registered. Please log in.' }, { status: 409 });
  }
  const rs = await db.execute({
    sql: "INSERT INTO users(name, email, password_hash, role) VALUES(?, ?, ?, 'user')",
    args: [name, email, hashPassword(password)],
  });
  const userId = Number(rs.lastInsertRowid);
  const { token } = await createSession(userId);
  const res = NextResponse.json({ ok: true, user: { id: userId, name, email, role: 'user' } });
  res.headers.set('Set-Cookie', sessionCookie(token));
  return res;
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405 });
}
