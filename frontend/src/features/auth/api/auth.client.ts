import { ApiError } from '@/lib/api';
import type { SafeUser } from '../types';

interface RegisterResponse {
  status: string;
  message?: string;
  data?: {
    user: SafeUser;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  rtRw?: string;
}

export async function registerAccount(input: RegisterInput): Promise<SafeUser> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(input),
  });

  const payload = (await response.json().catch(() => null)) as RegisterResponse | null;

  if (!response.ok || !payload?.data?.user) {
    throw new ApiError(
      payload?.message ?? 'Pendaftaran gagal. Coba lagi.',
      response.status,
      payload
    );
  }

  return payload.data.user;
}
