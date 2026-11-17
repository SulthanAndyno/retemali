import { get } from '@/lib/api';
import type { ApiEnvelope } from '@/shared/types/api';
import type { PublicHome } from '../types/home.types';

export function getPublicHome() {
  return get<ApiEnvelope<PublicHome>>('/dashboard/public');
}
