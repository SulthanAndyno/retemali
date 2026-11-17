import { clearSession } from '@/features/auth/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  await clearSession();
  return Response.json({ status: 'success' });
}
