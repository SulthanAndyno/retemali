import { FinancialConfirmationPage } from '@/features/donations';

export const metadata = { title: 'Konfirmasi Donasi Finansial — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  return <FinancialConfirmationPage reference={single(params.ref)} />;
}
