import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin';

export async function GET(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const convoId = Number(searchParams.get('convo_id')) || 0;
  if (convoId) {
    const after = Number(searchParams.get('after') || 0);
    const rs = await db.execute({
      sql: 'SELECT id, sender, text, created_at FROM chat_messages WHERE convo_id = ? AND id > ? ORDER BY id ASC LIMIT 100',
      args: [convoId, after],
    });
    await db.execute({ sql: "UPDATE chat_messages SET seen = 1 WHERE convo_id = ? AND sender = 'visitor'", args: [convoId] });
    return NextResponse.json({ messages: rs.rows });
  }
  const rs = await db.execute({
    sql: 'SELECT c.id, c.visitor_name, c.visitor_email, c.status, c.updated_at, (SELECT COUNT(*) FROM chat_messages m WHERE m.convo_id = c.id AND m.sender = \'visitor\' AND m.seen = 0) AS unread, (SELECT text FROM chat_messages m2 WHERE m2.convo_id = c.id ORDER BY m2.id DESC LIMIT 1) AS last_msg FROM conversations c ORDER BY c.updated_at DESC LIMIT 100',
  });
  return NextResponse.json({ conversations: rs.rows });
}

export async function POST(req) {
  const { error, db } = await requireAdmin();
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  if (body.heartbeat) {
    await db.execute({ sql: "INSERT INTO presence(key, value) VALUES('admin_last_seen', datetime('now')) ON CONFLICT(key) DO UPDATE SET value=datetime('now')", args: [] });
    return NextResponse.json({ ok: true });
  }
  const convoId = Number(body.convo_id);
  const text = String(body.text || '').trim().slice(0, 1000);
  if (!convoId || !text) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  await db.execute({
    sql: "INSERT INTO chat_messages(convo_id, sender, text, seen) VALUES(?, 'admin', ?, 1)",
    args: [convoId, text],
  });
  await db.execute({ sql: "UPDATE conversations SET updated_at = datetime('now') WHERE id = ?", args: [convoId] });
  if (body.close) {
    await db.execute({ sql: "UPDATE conversations SET status = 'closed' WHERE id = ?", args: [convoId] });
  }
  return NextResponse.json({ ok: true });
}
