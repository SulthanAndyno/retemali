import { AdminCashReportPage } from '@/features/dashboard';

export const metadata = { title: 'Laporan Kas — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <AdminCashReportPage
      initialFrom={single(params.dari)}
      initialTo={single(params.sampai)}
    />
  );
}
