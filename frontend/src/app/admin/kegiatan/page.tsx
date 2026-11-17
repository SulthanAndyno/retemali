import { AdminEventsPage, type EventCategory } from '@/features/events';

export const metadata = { title: 'Manajemen Kegiatan — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const CATEGORIES: EventCategory[] = [
  'ANAK',
  'SAINS',
  'KLUB_BUKU',
  'MENULIS',
  'DONGENG',
  'UMUM',
];

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = single(params.kategori);
  const initialCategory = CATEGORIES.includes(category as EventCategory)
    ? (category as EventCategory)
    : 'ALL';

  return <AdminEventsPage initialCategory={initialCategory} />;
}
