import { MemberLoanDetailPage } from '@/features/members';

export const metadata = { title: 'Detail Peminjaman — Rete Mali' };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MemberLoanDetailPage loanId={id} />;
}
