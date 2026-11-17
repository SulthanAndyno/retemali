import type { BorrowingsQuery } from '../types/circulation.types';

export const BORROWINGS_PAGE_SIZE = 20;

export function buildBorrowingsParams(query: BorrowingsQuery): URLSearchParams {
  const params = new URLSearchParams({
    page: String(query.page),
    limit: String(BORROWINGS_PAGE_SIZE),
  });

  if (query.status !== 'ALL') params.set('status', query.status);
  if (query.search.trim()) params.set('search', query.search.trim());

  return params;
}
