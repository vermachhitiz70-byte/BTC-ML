import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSessionUser, SESSION_COOKIE } from '@/lib/auth';

export async function GET() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const user = await getSessionUser(token).catch(() => null);
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  return NextResponse.json({ ok: true, user });
}

export async function DELETE() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const { destroySession } = await import('@/lib/auth');
    await destroySession(token);
  }
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}