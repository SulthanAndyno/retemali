import { loginUpstream } from '@/features/auth/api/auth';
import { setSession } from '@/features/auth/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        email?: string;
        password?: string;
        expectedRole?: 'MEMBER' | 'VOLUNTEER' | 'DONOR' | 'ADMIN';
      }
    | null;

  if (!body?.email || !body?.password) {
    return Response.json(
      { status: 'error', message: 'Email dan password wajib diisi.' },
      { status: 400 },
    );
  }

  const result = await loginUpstream(
    body.email,
    body.password,
    body.expectedRole
  );
  const data = result.data?.data;

  if (!result.ok || !data) {
    return Response.json(
      { status: 'error', message: result.error ?? 'Login gagal.' },
      { status: result.status || 502 },
    );
  }

  await setSession(data.token, data.user.role);

  return Response.json({ status: 'success', data: { user: data.user } });
}
