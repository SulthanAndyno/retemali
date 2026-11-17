import { CatalogPage } from '@/features/books';

export const metadata = { title: 'Katalog Buku — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <CatalogPage
      initialSearch={single(params.search)}
      initialCategory={single(params.category) || 'ALL'}
    />
  );
}
