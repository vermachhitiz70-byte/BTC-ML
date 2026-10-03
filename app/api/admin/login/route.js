import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/turso';
import { verifyPassword, createSession, sessionCookie, isAdminEmail } from '@/lib/auth';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

  const db = getDb();

  // Check for admin user by email
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@btcmlai.com').toLowerCase();
  const rs = await db.execute({
    sql: 'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
    args: [adminEmail],
  });

  if (!rs.rows.length) {
    return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
  }

  const user = rs.rows[0];
  const valid = verifyPassword(password, user.password_hash || '');

  if (!valid) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Update role to admin if not already
  if (user.role !== 'admin') {
    await db.execute({ sql: "UPDATE users SET role = 'admin' WHERE id = ?", args: [user.id] });
  }

  const { token, expires } = await createSession(user.id);
  const store = await cookies();
  store.set('btc_session', token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 30 * 86400,
  });

  return NextResponse.json({ ok: true, user: { id: user.id, name: user.name, email: user.email, role: 'admin' } });
}