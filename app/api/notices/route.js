import { NextResponse } from 'next/server';
import { getNotices } from '@/lib/notices';

export const dynamic = 'force-dynamic';

export async function GET() {
  const notices = await getNotices(3);
  return NextResponse.json({ notices });
}
