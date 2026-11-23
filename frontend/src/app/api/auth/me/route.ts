import { meUpstream } from '@/features/auth/api/auth';
import {
  clearSession,
  getSessionToken,
  setSession,
} from '@/features/auth/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const token = await getSessionToken();

  if (!token) {
    return Response.json(
      { status: 'error', message: 'Sesi tidak ditemukan.' },
      { status: 401 },
    );
  }

  const result = await meUpstream(token);

  if (result.status === 401) {
    await clearSession();
    return Response.json(
      { status: 'error', message: result.error ?? 'Sesi Anda berakhir.' },
      { status: 401 },
    );
  }

  const user = result.data?.data;

  if (!result.ok || !user) {
    return Response.json(
      { status: 'error', message: result.error ?? 'Gagal mengambil profil.' },
      { status: result.status || 502 },
    );
  }

  // Peran akun bisa berubah di server (mis. relawan diturunkan menjadi anggota
  // oleh Admin). Segarkan cookie peran dari database agar guard rute memakai
  // nilai terbaru pada navigasi berikutnya.
  if (user.role) {
    await setSession(token, user.role);
  }

  return Response.json({ status: 'success', data: { user } });
}
