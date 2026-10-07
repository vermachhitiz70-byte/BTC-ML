import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';
import { ensureSchema } from '@/lib/schema';

export async function GET(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  await ensureSchema().catch(() => {});
  const { searchParams } = new URL(req.url);
  const onlyUnread = searchParams.get('unread') === '1';
  const rs = await db.execute({
    sql: onlyUnread
      ? 'SELECT id, name, email, phone, subject, body, read, created_at FROM messages WHERE read = 0 ORDER BY id DESC LIMIT 200'
      : 'SELECT id, name, email, phone, subject, body, read, created_at FROM messages ORDER BY id DESC LIMIT 200',
  });
  return NextResponse.json({ messages: rs.rows });
}

export async function PATCH(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  if (body.mark_all_read) {
    await db.execute({ sql: 'UPDATE messages SET read = 1 WHERE read = 0', args: [] });
    return NextResponse.json({ ok: true });
  }
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  await db.execute({ sql: 'UPDATE messages SET read = ? WHERE id = ?', args: [body.read ? 1 : 0, id] });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  await db.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [id] });
  return NextResponse.json({ ok: true });
}