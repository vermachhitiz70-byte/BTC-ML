import { NextResponse } from 'next/server';
import { getDb } from '@/lib/turso';
import { verifyPassword, createSession, sessionCookie, validEmail } from '@/lib/auth';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');
  if (!validEmail(email) || !password) {
    return NextResponse.json({ error: 'Please enter your email and password.' }, { status: 400 });
  }
  const db = getDb();
  const rs = await db.execute({ sql: 'SELECT id, name, email, password_hash, role FROM users WHERE email = ?', args: [email] });
  if (!rs.rows.length || !verifyPassword(password, rs.rows[0].password_hash)) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }
  const user = rs.rows[0];
  const { token } = await createSession(user.id);
  const res = NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  res.headers.set('Set-Cookie', sessionCookie(token));
  return res;
}
