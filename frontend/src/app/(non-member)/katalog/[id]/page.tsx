import { CatalogDetailPage } from '@/features/books';

export const metadata = { title: 'Detail Buku — Rete Mali' };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CatalogDetailPage bookId={id} />;
}
