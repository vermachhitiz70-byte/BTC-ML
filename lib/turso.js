import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

export const dbEnabled = Boolean(url);

let db = null;
if (dbEnabled) {
  db = createClient({ url, authToken });
}

export function getDb() {
  if (!db) throw new Error('Turso is not configured. Set TURSO_DATABASE_URL.');
  return db;
}
