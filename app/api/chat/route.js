import { NextResponse } from 'next/server';
import { getDb } from '@/lib/turso';
import { validEmail } from '@/lib/auth';
import { ensureSchema } from '@/lib/schema';

function isOnline(lastSeen) {
  if (!lastSeen) return false;
  const t = Date.parse(lastSeen.replace(' ', 'T') + 'Z');
  return Date.now() - t < 120000;
}

async function presence(db) {
  try {
    const r = await db.execute({ sql: "SELECT value FROM presence WHERE key='admin_last_seen'", args: [] });
    return isOnline(r.rows[0]?.value || '');
  } catch {
    return false;
  }
}

const OFFLINE_ACK =
  'Hello! The support team is not live right now, but your query has been received. ' +
  'We will contact you soon regarding your query. You are a valued customer of ours — thank you for your patience.';

function inquiryMessage(name, email, phone, query) {
  return [
    'New Inquiry',
    'Name: ' + name,
    'Email: ' + email,
    phone ? 'Phone: ' + phone : null,
    '────────────────',
    query,
  ]
    .filter(Boolean)
    .join('\n');
}

// Visitor: start conversation / send message
export async function POST(req) {
  await ensureSchema().catch(() => {});
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const text = String(body.text || '').trim().slice(0, 1000);
  if (!text) return NextResponse.json({ error: 'Please write a message.' }, { status: 400 });
  const phone = String(body.phone || '').trim().slice(0, 20);

  const db = getDb();
  let convoId = Number(body.convo_id) || 0;
  if (convoId) {
    const c = await db.execute({ sql: 'SELECT id FROM conversations WHERE id = ?', args: [convoId] });
    if (!c.rows.length) convoId = 0;
  }
  let adminOnline = await presence(db);
  if (!convoId) {
    const name = String(body.name || '').trim().slice(0, 60);
    const email = String(body.email || '').trim().toLowerCase();
    if (name.length < 2) return NextResponse.json({ error: 'Please enter your name.', need: 'name' }, { status: 400 });
    if (!validEmail(email)) return NextResponse.json({ error: 'Please enter a valid email address.', need: 'email' }, { status: 400 });
    const r = await db.execute({
      sql: 'INSERT INTO conversations(visitor_name, visitor_email) VALUES(?, ?)',
      args: [name, email],
    });
    convoId = Number(r.lastInsertRowid);
    await db.execute({
      sql: "INSERT INTO chat_messages(convo_id, sender, text, seen) VALUES(?, 'visitor', ?, 0)",
      args: [convoId, inquiryMessage(name, email, phone, text)],
    });
    if (!adminOnline) {
      await db.execute({
        sql: "INSERT INTO chat_messages(convo_id, sender, text, seen) VALUES(?, 'admin', ?, 1)",
        args: [convoId, OFFLINE_ACK],
      });
    }
  } else {
    await db.execute({
      sql: "INSERT INTO chat_messages(convo_id, sender, text, seen) VALUES(?, 'visitor', ?, 0)",
      args: [convoId, text],
    });
  }
  await db.execute({ sql: "UPDATE conversations SET updated_at = datetime('now') WHERE id = ?", args: [convoId] });
  return NextResponse.json({ ok: true, convo_id: convoId, admin_online: adminOnline });
}

// Visitor: poll messages
export async function GET(req) {
  await ensureSchema().catch(() => {});
  const { searchParams } = new URL(req.url);
  const convoId = Number(searchParams.get('convo_id')) || 0;
  const after = Number(searchParams.get('after') || 0);
  if (!convoId) return NextResponse.json({ messages: [], admin_online: false });
  const db = getDb();
  const rs = await db.execute({
    sql: 'SELECT id, sender, text, created_at FROM chat_messages WHERE convo_id = ? AND id > ? ORDER BY id ASC LIMIT 50',
    args: [convoId, after],
  });
  return NextResponse.json({ messages: rs.rows, admin_online: await presence(db) });
}
