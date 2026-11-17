import { AdminBooksPage, type CatalogSort } from '@/features/books';

export const metadata = { title: 'Manajemen Buku — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

function parseSort(value: string): CatalogSort {
  return value === 'popular' || value === 'rating' ? value : 'newest';
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(single(params.hal)) || 1;

  return (
    <AdminBooksPage
      initialSearch={single(params.cari)}
      initialCategory={single(params.kategori) || 'ALL'}
      initialSort={parseSort(single(params.urut))}
      initialPage={page}
    />
  );
}
