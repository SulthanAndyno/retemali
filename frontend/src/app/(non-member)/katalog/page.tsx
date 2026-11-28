import { CatalogPage, resolveBookAgeGroup } from '@/features/books';

export const metadata = { title: 'Katalog Buku — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

function parseSort(value: string) {
  return value === 'title-desc' ||
    value === 'newest' ||
    value === 'popular' ||
    value === 'rating'
    ? value
    : 'title-asc';
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CatalogPage
      initialSearch={single(params.cari) || single(params.search)}
      initialCategory={single(params.kategori) || single(params.category) || 'ALL'}
      initialAgeGroup={resolveBookAgeGroup(single(params.usia))}
      initialAvailableOnly={single(params.tersedia) === '1'}
      initialSort={parseSort(single(params.urut))}
      initialPage={Number(single(params.hal)) || 1}
    />
  );
}
