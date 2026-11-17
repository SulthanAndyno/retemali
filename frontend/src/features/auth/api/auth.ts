import 'server-only';
import { upstreamRequest } from '@/shared/lib/server-upstream';
import type { SafeUser } from '../types';

export interface AuthEnvelope {
  status: string;
  message?: string;
  data?: {
    token: string;
    user: SafeUser;
  };
}

export interface MeEnvelope {
  status: string;
  message?: string;
  data?: SafeUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
  rtRw?: string;
}

export function loginUpstream(email: string, password: string) {
  return upstreamRequest<AuthEnvelope>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function registerUpstream(input: RegisterInput) {
  return upstreamRequest<AuthEnvelope>('/auth/register', {
    method: 'POST',
    body: input,
  });
}

export function meUpstream(token: string, timeoutMs = 10000) {
  return upstreamRequest<MeEnvelope>('/auth/me', { token, timeoutMs });
}
