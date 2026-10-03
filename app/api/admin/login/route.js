import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/turso';
import { verifyPassword, hashPassword, createSession, sessionCookie, isAdminEmail } from '@/lib/auth';
import { ensureSchema } from '@/lib/schema';

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 });

  await ensureSchema().catch(() => {});
  const db = getDb();

  // Check for admin user by email
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@btcmlai.com').toLowerCase();
  const bootstrapPassword = process.env.ADMIN_PASSWORD || 'VdxixXoXmfcz';
  let rs = await db.execute({
    sql: 'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
    args: [adminEmail],
  });

  if (!rs.rows.length) {
    // Bootstrap the admin account on first login attempt
    if (String(password) !== String(bootstrapPassword)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
    await db.execute({
      sql: 'INSERT INTO users(name, email, password_hash, role) VALUES(?, ?, ?, ?)',
      args: ['Admin', adminEmail, hashPassword(bootstrapPassword), 'admin'],
    });
    rs = await db.execute({
      sql: 'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      args: [adminEmail],
    });
    if (!rs.rows.length) {
      return NextResponse.json({ error: 'Could not create admin user' }, { status: 500 });
    }
  }

  const user = rs.rows[0];
  let valid = verifyPassword(password, user.password_hash || '');

  // If the stored hash is stale/empty but the canonical password was given, reset it
  if (!valid && String(password) === String(bootstrapPassword)) {
    const fresh = hashPassword(bootstrapPassword);
    await db.execute({ sql: 'UPDATE users SET password_hash = ? WHERE id = ?', args: [fresh, user.id] });
    valid = true;
  }

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