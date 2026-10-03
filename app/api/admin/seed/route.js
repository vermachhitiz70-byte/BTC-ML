import { NextResponse } from 'next/server';
import { getDb } from '@/lib/turso';
import { hashPassword } from '@/lib/auth';
import { ensureSchema } from '@/lib/schema';

export async function POST() {
  await ensureSchema().catch(() => {});
  const db = getDb();
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@btcmlai.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'VdxixXoXmfcz';

  // Create admin user if not exists
  const existing = await db.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: [adminEmail],
  });

  if (!existing.rows.length) {
    const passwordHash = hashPassword(adminPassword);
    await db.execute({
      sql: 'INSERT INTO users(name, email, password_hash, role) VALUES(?, ?, ?, ?)',
      args: ['Admin', adminEmail, passwordHash, 'admin'],
    });
  } else {
    // Update password if provided
    const passwordHash = hashPassword(adminPassword);
    await db.execute({
      sql: 'UPDATE users SET password_hash = ?, role = ? WHERE email = ?',
      args: [passwordHash, 'admin', adminEmail],
    });
  }

  return NextResponse.json({ ok: true, message: 'Admin user created/updated' });
}