import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getDb } from '@/lib/turso';
import { getSessionUser, SESSION_COOKIE } from '@/lib/auth';
import { ensureSchema } from '@/lib/schema';

export async function requireAdmin() {
  await ensureSchema().catch(() => {});
  const store = await cookies();
  const user = await getSessionUser(store.get(SESSION_COOKIE)?.value).catch(() => null);
  if (!user || user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden.' }, { status: 403 }) };
  }
  return { user, db: getDb() };
}
