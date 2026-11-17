import { registerUpstream } from '@/features/auth/api/auth';
import { setSession } from '@/features/auth/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        email?: string;
        password?: string;
        phone?: string;
        rtRw?: string;
      }
    | null;

  if (!body?.name || !body?.email || !body?.password) {
    return Response.json(
      { status: 'error', message: 'Nama, email, dan password wajib diisi.' },
      { status: 400 },
    );
  }

  const result = await registerUpstream({
    name: body.name,
    email: body.email,
    password: body.password,
    phone: body.phone,
    rtRw: body.rtRw,
  });
  const data = result.data?.data;

  if (!result.ok || !data) {
    return Response.json(
      { status: 'error', message: result.error ?? 'Registrasi gagal.' },
      { status: result.status || 502 },
    );
  }

  await setSession(data.token, data.user.role);

  return Response.json(
    { status: 'success', data: { user: data.user } },
    { status: 201 },
  );
}
