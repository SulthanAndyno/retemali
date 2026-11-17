import { AdminRegistrationsPage } from '@/features/admin';

export const metadata = { title: 'Pendaftaran Kegiatan — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(single(params.hal)) || 1;

  return (
    <AdminRegistrationsPage
      initialPage={page}
      initialPaymentStatus={single(params.bayar)}
      initialEventId={single(params.kegiatan)}
    />
  );
}
