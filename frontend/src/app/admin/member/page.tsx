import { AdminMembersPage } from '@/features/admin';

export const metadata = { title: 'Manajemen Member — Rete Mali' };

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function single(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = single(params.status);

  return (
    <AdminMembersPage
      initialSearch={single(params.q)}
      initialStatus={
        status === 'active' || status === 'pending' || status === 'expired'
          ? status
          : 'all'
      }
    />
  );
}
