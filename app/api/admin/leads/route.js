import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const rs = await db.execute({
    sql: 'SELECT id, name, email, phone, page, read, created_at FROM chat_leads ORDER BY id DESC LIMIT 200',
  });
  return NextResponse.json({ leads: rs.rows });
}

export async function PATCH(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  if (body.mark_all_read) {
    await db.execute({ sql: 'UPDATE chat_leads SET read = 1' });
    return NextResponse.json({ ok: true });
  }
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  await db.execute({ sql: 'UPDATE chat_leads SET read = ? WHERE id = ?', args: [body.read ? 1 : 0, id] });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  await db.execute({ sql: 'DELETE FROM chat_leads WHERE id = ?', args: [id] });
  return NextResponse.json({ ok: true });
}
