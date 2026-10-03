import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { getDb } from './turso';
import { ensureSchema } from './schema';

const SESSION_DAYS = 30;

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(password), salt, 64).toString('hex');
  return salt + ':' + hash;
}

export function verifyPassword(password, stored) {
  try {
    const [salt, hash] = String(stored).split(':');
    const check = scryptSync(String(password), salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
  } catch {
    return false;
  }
}

export function isAdminEmail(email) {
  const admin = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();
  return admin !== '' && String(email).toLowerCase().trim() === admin;
}

export async function createSession(userId) {
  await ensureSchema().catch(() => {});
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5).toISOString();
  await getDb().execute({
    sql: 'INSERT INTO sessions(token, user_id, expires_at) VALUES(?, ?, ?)',
    args: [token, userId, expires],
  });
  return { token, expires };
}

export async function getSessionUser(token) {
  if (!token) return null;
  await ensureSchema().catch(() => {});
  const rs = await getDb().execute({
    sql: 'SELECT u.id, u.name, u.email, u.role, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?',
    args: [token],
  });
  if (!rs.rows.length) return null;
  const row = rs.rows[0];
  if (new Date(row.expires_at).getTime() < Date.now()) {
    await getDb().execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
    return null;
  }
  let role = row.role;
  if (role !== 'admin' && isAdminEmail(row.email)) {
    await getDb().execute({ sql: "UPDATE users SET role = 'admin' WHERE id = ?", args: [row.id] });
    role = 'admin';
  }
  return { id: row.id, name: row.name, email: row.email, role };
}

export async function destroySession(token) {
  if (!token) return;
  await getDb().execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
}

export const SESSION_COOKIE = 'btc_session';

export function sessionCookie(token, expires) {
  return SESSION_COOKIE + '=' + token + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + SESSION_DAYS * 86400 + '; Secure';
}

export function clearSessionCookie() {
  return SESSION_COOKIE + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

export function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function orderCode() {
  return 'BTC-' + Date.now().toString(36).toUpperCase() + randomBytes(2).toString('hex').toUpperCase();
}
