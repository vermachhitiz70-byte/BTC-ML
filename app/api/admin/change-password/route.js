import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(req) {
  const { error, db, user } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const currentPassword = String(body.currentPassword || '');
  const newPassword = String(body.newPassword || '');

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
  }

  const rs = await db.execute({
    sql: 'SELECT id, password_hash FROM users WHERE id = ?',
    args: [user.id],
  });
  if (!rs.rows.length) {
    return NextResponse.json({ error: 'Admin user not found.' }, { status: 404 });
  }
  const valid = verifyPassword(currentPassword, rs.rows[0].password_hash || '');
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  await db.execute({
    sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
    args: [hashPassword(newPassword), user.id],
  });
  return NextResponse.json({ ok: true });
}
