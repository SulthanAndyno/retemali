import {
  AdminBorrowingsPage,
  type BorrowingStatusFilter,
} from '@/features/circulation';

export const metadata = { title: 'Manajemen Peminjaman — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

function parseStatus(value: string): BorrowingStatusFilter {
  return value === 'BORROWED' ||
    value === 'RETURNED' ||
    value === 'OVERDUE' ||
    value === 'LOST'
    ? value
    : 'ALL';
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(single(params.hal)) || 1;

  return (
    <AdminBorrowingsPage
      initialStatus={parseStatus(single(params.status))}
      initialSearch={single(params.q)}
      initialPage={page}
    />
  );
}
