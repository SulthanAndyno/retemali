import { getJson } from '@/shared/lib/same-origin';
import type { ApiEnvelope } from '@/shared/types/api';
import { BORROWINGS_PAGE_SIZE } from '../lib/borrowing-query';
import type {
  BorrowingsQuery,
  BorrowingsResponse,
} from '../types/circulation.types';

export function getBorrowings(query: BorrowingsQuery) {
  return getJson<ApiEnvelope<BorrowingsResponse>>('/api/borrowings', {
    page: query.page,
    limit: BORROWINGS_PAGE_SIZE,
    status: query.status === 'ALL' ? undefined : query.status,
    search: query.search.trim() || undefined,
  });
}
